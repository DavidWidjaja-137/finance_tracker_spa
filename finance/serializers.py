from rest_framework import serializers
from finance.models import (
    InventoryItem,
    Account,
    TransactionCategory,
    TransactionSubCategory,
    TransactionMap,
    Transaction
)
from django.contrib.auth.models import User

class InventoryItemSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = InventoryItem
        fields = ["id", "name", "description", "owner"]

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username']

class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = ['id', 'name', 'description']

class TransactionCategorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = TransactionCategory
        fields = ['id', 'name', 'description']

class TransactionSubCategorySerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=TransactionCategory.objects.all())

    class Meta:
        model = TransactionSubCategory
        fields = ['id', 'name', 'description', 'category']

class TransactionMapSerializer(serializers.ModelSerializer):
    subcategory = serializers.PrimaryKeyRelatedField(queryset=TransactionSubCategory.objects.all())

    class Meta:
        model = TransactionMap
        fields = ['id', 'name', 'description', 'subcategory']

class TransactionSerializer(serializers.ModelSerializer):
    
    account = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all())
    owner = serializers.ReadOnlyField(source='owner.username')
    mapping = serializers.PrimaryKeyRelatedField(queryset=TransactionMap.objects.all())

    class Meta:
        model = Transaction
        fields = ['id', 'date', 'account', 'mapping', 'amount', 'flow', 'owner']