from django.urls import path
from . import views
from django.views.generic import TemplateView

from django.urls import re_path
from django.conf import settings
from django.conf.urls.static import static


app_name = 'booklibrary'

urlpatterns = [
    path('api/literatura', views.LiteratureListAPIView.as_view(), name='leterature-list'),
    path('api/literatura/<int:pk>', views.LiteratureDetailAPIView.as_view(), name='literature-detail'),
    path('api/oblast-istrazivanja', views.ResearchSubjectAPIView.as_view(), name='research-subjects'),
    path('api/kategorija', views.CategoriesAPIView.as_view(), name='categories'),
    path('api/jezik', views.LanguagesAPIView.as_view(), name='languages'),
    path('api/godina-izdanja', views.PublicationYearAPIView.as_view(), name='publication-year'),
    path('api/izdavac', views.PublisherAPIView.as_view(), name='publishers'),

    # re_path(r'^.*$', TemplateView.as_view(template_name='booklibrary/library.html')),

    re_path(r'^.*$', views.library_view, name='book-library'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
