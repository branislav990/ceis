# Generated by Django 5.0.6 on 2024-07-01 19:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("booklibrary", "0007_rename_symposium_conferencesymposium_and_more"),
    ]

    operations = [
        migrations.RenameModel(
            old_name="ConferenceSymposium",
            new_name="ScientificConference",
        ),
        migrations.AlterModelOptions(
            name="author",
            options={"verbose_name": "Autor", "verbose_name_plural": "Autori"},
        ),
        migrations.AlterModelOptions(
            name="journal",
            options={
                "verbose_name": "Serijska publikacija",
                "verbose_name_plural": "Serijske publikacije",
            },
        ),
        migrations.AlterModelOptions(
            name="literature",
            options={"verbose_name": "Literatura", "verbose_name_plural": "Literatura"},
        ),
        migrations.AlterModelOptions(
            name="publisher",
            options={"verbose_name": "Izdavač", "verbose_name_plural": "Izdavači"},
        ),
        migrations.AlterModelOptions(
            name="researchsubject",
            options={
                "verbose_name": "Oblast istraživanja",
                "verbose_name_plural": "Oblasti istraživanja",
            },
        ),
        migrations.AlterModelOptions(
            name="scientificconference",
            options={
                "verbose_name": "Naučni skup",
                "verbose_name_plural": "Naučni skupovi",
            },
        ),
        migrations.RenameField(
            model_name="literature",
            old_name="conf_symp",
            new_name="sci_conf",
        ),
    ]
