import os
import shutil
import tempfile
from datetime import datetime

from dateutil.relativedelta import relativedelta

from finance.s3_util import s3_util
from finance.importer import importer
from finance.models import (
    InventoryItem,
    Account,
    TransactionCategory,
    TransactionSubCategory,
    TransactionMap,
    Transaction
)
from finance.serializers import (
    InventoryItemSerializer,
    UserSerializer,
    AccountSerializer,
    TransactionCategorySerializer,
    TransactionSubCategorySerializer,
    TransactionMapSerializer,
    TransactionSerializer
)
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.parsers import MultiPartParser
from django.contrib.auth.models import User

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class InventoryItemList(generics.ListCreateAPIView):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    permission_classes = [permissions.IsAuthenticated]

# list based view for the account, transaction category,
#    transaction subcategory, and transaction map

class AccountList(generics.ListAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    permission_classes = [permissions.IsAuthenticated]

class TransactionCategoryList(generics.ListCreateAPIView):
    queryset = TransactionCategory.objects.all()
    serializer_class = TransactionCategorySerializer

    permission_classes = [permissions.IsAuthenticated]

class TransactionSubCategoryList(generics.ListCreateAPIView):
    queryset = TransactionSubCategory.objects.all()
    serializer_class = TransactionSubCategorySerializer

    permission_classes = [permissions.IsAuthenticated]

class TransactionMapList(generics.ListCreateAPIView):
    queryset = TransactionMap.objects.all()
    serializer_class = TransactionMapSerializer

    permission_classes = [permissions.IsAuthenticated]

# for transaction maps, create a view that allows filtering by category
class TransactionMapView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: Request, format=None):

        category = request.data["category"]

        serializer = TransactionMapSerializer(subcategory__category__name=category, many=True)
        return Response(serializer.data)
    
    def post(self, request: Request, format=None):

        transaction_subcategory_id = (
            str(request.data["subcategory_id"]) if "subcategory_id" in request.data and request.data["subcategory_id"] not in ["", "None"] else None
        )
        transaction_map_id = (
            str(request.data["map_id"]) if "map_id" in request.data and request.data["map_id"] not in ["", "None"] else None
        )

        if transaction_subcategory_id and transaction_map_id:
            map = TransactionMap.objects.get(id=transaction_map_id)
            map.subcategory = TransactionSubCategory.objects.get(id=transaction_subcategory_id)
            map.save()

        return Response(status=status.HTTP_201_CREATED)


# for transactions create a view that allows filtering by start date, end date, and map
class TransactionFiltering(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: Request, format=None):

        filter_start = (
            datetime.strptime(request.query_params["filter_start"], "%Y-%m-%d").date() if "filter_start" in request.query_params else None
        )
        filter_end = (
            datetime.strptime(request.query_params["filter_end"], "%Y-%m-%d").date() if "filter_end" in request.query_params else None
        )

        transaction_map = (
            request.query_params["transaction_map"]
            if "transaction_map" in request.query_params and request.query_params["transaction_map"] != ""
            else None           
        )

        transaction_filter = Transaction.objects
        if transaction_map:
            transaction_filter = transaction_filter.filter(mapping__id=transaction_map)

        if filter_start and filter_end:
            transactions = (
                transaction_filter.filter(owner=request.user)
                .filter(date__range=(filter_start, filter_end))
                .all()
            )
        else:
            transactions = transaction_filter.all()

        serializer = TransactionSerializer(transactions, many=True)

        return Response(serializer.data)

# have a transaction file view
class TransactionFiles(APIView):

    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

    def get(self, request: Request):

        # check on S3 how many files are there

        accounts = Account.objects.all()

        files_dict = {}
        for account in accounts:
            keys = s3_util.get_s3_filenames(os.path.join("data", request.user.username, account.name))

            # get the filenames
            keys = [(k.split('/')[-1]).split('.')[0] for k in keys]

            files_dict[account.name] = keys

        return Response(files_dict)

    def post(self, request: Request):

        start = (
            datetime.strptime(request.data["date"], "%Y-%m").date()
            if "date" in request.data
            else None
        )

        account = (
            str(request.data["account"])
            if "account" in request.data
            else None
        )

        if start and account and request.FILES["file"]:

            end = start + relativedelta(months=1)

            user = User.objects.get(username=request.user.username)

            key = os.path.join("data", request.user.username, account, start.isoformat() + ".csv")

            file = request.FILES["file"].chunks()

            deleted, _ = Transaction.objects.filter(
                owner=user, account__name=account, date__range=(start, end)
            ).delete()

            with tempfile.NamedTemporaryFile(delete_on_close=False) as f1:

                for row in file:
                    f1.write(row)
                f1.close()

                with open(f1.name, 'r') as f3:
                    for row in f3:
                        print("ROW" + row)
                        importer.import_transaction_from_account(row.replace('"', '').split(','), account, start, end, user)

                with tempfile.NamedTemporaryFile(delete_on_close=False) as f2:
                    shutil.copyfile(f1.name, f2.name)
                    s3_util.bucket.upload_fileobj(f2, key)

                    print("FILE UPLOADED")
        else:
            print("FILE NOT UPLOADED")

        return Response(status=status.HTTP_201_CREATED)
