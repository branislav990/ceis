# Generated by Django 5.0.6 on 2024-05-15 18:53

import django_ckeditor_5.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0003_postimage"),
    ]

    operations = [
        migrations.AlterField(
            model_name="blogpost",
            name="content",
            field=django_ckeditor_5.fields.CKEditor5Field(blank=True, null=True),
        ),
        migrations.DeleteModel(
            name="PostImage",
        ),
    ]
