from django.urls import path
from . import views


app_name = 'blog'
urlpatterns = [
    path("", views.BlogPostListView.as_view(), name="blog-post-list"),
    path("<slug:url_identifier>", views.BlogPostDetailView.as_view(), name="blog-post-detail"),
]

htmx_urlpatterns = [
    path('like/<int:post_pk>', views.like, name="like"),
    path('unlike/<int:post_pk>', views.unlike, name="unlike"),
]

urlpatterns += htmx_urlpatterns
