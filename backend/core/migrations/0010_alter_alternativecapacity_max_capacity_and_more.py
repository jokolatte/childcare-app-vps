# Generated by Django 5.1.4 on 2025-01-03 01:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_rename_name_classroom_classroom_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='alternativecapacity',
            name='max_capacity',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='alternativecapacity',
            name='program_type',
            field=models.CharField(max_length=100),
        ),
    ]
