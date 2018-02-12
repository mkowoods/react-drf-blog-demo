
from django.conf.urls import url, include
from rest_framework import routers
import views
from django.views.generic import TemplateView

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'posts', views.PostViewSet)

urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^api/current_user', views.CurrentUserView.as_view()),
    url(r'^', TemplateView.as_view(template_name = 'index.html'), name='index'), #all other routes get caught by ReactJS
]