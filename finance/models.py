from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class InventoryItem(models.Model):
    name = models.CharField(max_length=100, unique=False)
    description = models.CharField(max_length=200)
    owner = models.ForeignKey('auth.User', related_name='inventory_item', on_delete=models.CASCADE)


class Account(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=200)

    def __str__(self):

        return self.name


class TransactionCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=200)

    def __str__(self):

        return self.name


class TransactionSubCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=200)
    category = models.ForeignKey(TransactionCategory, on_delete=models.PROTECT)

    def __str__(self):

        return self.name


class TransactionMap(models.Model):
    name = models.CharField(max_length=200, unique=True)
    description = models.CharField(max_length=200)
    subcategory = models.ForeignKey(TransactionSubCategory, on_delete=models.PROTECT)

    def __str__(self):

        return self.name


class TransactionFlow(models.TextChoices):
    INFLOW = "INFLOW"
    OUTFLOW = "OUTFLOW"


class Transaction(models.Model):
    date = models.DateField()
    account = models.ForeignKey(Account, on_delete=models.PROTECT)
    mapping = models.ForeignKey(TransactionMap, on_delete=models.PROTECT)
    amount = models.FloatField()
    flow = models.CharField(max_length=10, choices=TransactionFlow)
    owner = models.ForeignKey('auth.User', related_name="transaction", on_delete=models.CASCADE)
