from django.urls import path
from finance import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('hello_world/', views.index),
    path('inventory_items/', views.InventoryItemList.as_view()),
    path('accounts/', views.AccountList.as_view()),
    path('category/', views.TransactionCategoryList.as_view()),
    path('subcategory/', views.TransactionSubCategoryList.as_view()),
    path('map/', views.TransactionMapList.as_view()),
    path('filtered_map/', views.TransactionMapView.as_view()),
    path('filtered_transaction/', views.TransactionFiltering.as_view()),
    path('transaction_files/', views.TransactionFiles.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)