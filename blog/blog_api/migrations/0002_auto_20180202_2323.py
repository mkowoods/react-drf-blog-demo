# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-02-02 23:23
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog_api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='post',
            old_name='creat_date',
            new_name='create_date',
        ),
    ]