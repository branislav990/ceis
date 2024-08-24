import os
from urllib.parse import urljoin

from django.conf import settings
from django.core.files.storage import FileSystemStorage


class CustomStorage(FileSystemStorage):
    """Custom storage for django_ckeditor_5 blog images."""

    location = os.path.join(settings.MEDIA_ROOT, "blog/post_img")
    base_url = urljoin(settings.MEDIA_URL, "blog/post_img/")
