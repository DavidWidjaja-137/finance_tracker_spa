import json
import os

from django.db import migrations


def create_transaction_mappings(apps, schema_editor):

    TransactionCategory = apps.get_model("finance", "TransactionMap")
    TransactionSubCategory = apps.get_model("finance", "TransactionSubCategory")

    with open(os.path.join(os.path.dirname(__file__), "transaction_mappings_1.json"), "r") as f:

        initial_mappings = json.load(f)

        for category, types in initial_mappings.items():
            for type, names in types.items():
                for name in names:
                    TransactionCategory.objects.get_or_create(
                        name=name,
                        description="Initial transaction mapping set",
                        subcategory=TransactionSubCategory.objects.get(name=type),
                    )


class Migration(migrations.Migration):

    dependencies = [
        ("finance", "0003_auto_20240820_0722"),
    ]

    operations = [
        migrations.RunPython(create_transaction_mappings),
    ]
