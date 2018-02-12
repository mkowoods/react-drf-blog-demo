# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

# Create your views here.

from .models import Post
from .serializers import PostSerializer, UserSerializer
from rest_framework import viewsets, permissions, response, views


# Defining Permissions
class IsOwnerOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the snippet.
        return obj.owner == request.user


class PostViewSet(viewsets.ModelViewSet):

    queryset = Post.objects.all().order_by('-create_date')
    serializer_class = PostSerializer

    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    # def list(self, request):
    #     return response .Response(serializer.data)

    def retrieve(self, request, pk):
        resp = super(PostViewSet, self).retrieve(self, request, pk)
        return resp

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CurrentUserView(views.APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return response.Response(serializer.data)