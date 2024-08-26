# Generated by Django 5.0.6 on 2024-06-05 21:39

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0014_alter_comment_content_alter_comment_email_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="comment",
            name="content",
            field=models.TextField(
                validators=[django.core.validators.MaxLengthValidator(1000)]
            ),
        ),
        migrations.AlterField(
            model_name="comment",
            name="email",
            field=models.EmailField(
                help_text="Za kontakt u slučaju zahteva ili upita (ne prikazuje se javno)",
                max_length=254,
            ),
        ),
        migrations.AlterField(
            model_name="comment",
            name="name",
            field=models.CharField(
                max_length=50,
                validators=[
                    django.core.validators.MinLengthValidator(
                        2, message="Ovo polje mora da ima najmanje 2 karaktera."
                    ),
                    django.core.validators.MaxLengthValidator(
                        50, message="Ovo polje može da ima najviše 50 karaktera."
                    ),
                ],
            ),
        ),
    ]
