from .models import Post
from django.contrib.auth.models import User
from rest_framework import serializers, fields


class PostSerializer(serializers.ModelSerializer):

    owner = serializers.ReadOnlyField(source = 'owner.username')
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields =  '__all__'

    def get_is_owner(self, obj):
        if hasattr(self.context['request'].user, 'username') and hasattr(obj.owner, 'username'):
            return obj.owner.username == self.context['request'].user.username
        return False


class UserSerializer(serializers.ModelSerializer):
    is_authenticated = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_authenticated')

    def get_is_authenticated(self, obj):
        return obj.is_authenticated()