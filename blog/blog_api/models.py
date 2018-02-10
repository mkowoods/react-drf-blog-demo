# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

from django.db import models


# Create your models here.

class Post(models.Model):
    create_date = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255)
    categories = models.CharField(max_length=255)
    content = models.TextField(max_length=4000)
    owner = models.ForeignKey('auth.User', related_name='snippets', on_delete=models.DO_NOTHING, null=True)

    class Meta:
        ordering = ['-create_date']