from django.core.validators import MinValueValidator, MinLengthValidator, MaxLengthValidator
from django.db import models
from django.contrib.auth.models import User
from django_ckeditor_5.fields import CKEditor5Field


class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    cover_image = models.ImageField(upload_to="blog/cover_img/", null=True, blank=True)
    content = CKEditor5Field("Text", config_name="extends")
    snippet = models.TextField(default='')
    created_on = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    views = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    likes = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    url_identifier = models.SlugField(max_length=255, unique=True, blank=True)

    def __str__(self):
        return f"{self.title}"


class Comment(models.Model):
    blog_post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(
        max_length=50,
        validators=[
            MinLengthValidator(2, message='Ovo polje mora da ima najmanje 2 karaktera.'),
            MaxLengthValidator(50, message='Ovo polje može da ima najviše 50 karaktera.')
        ],
    )
    email = models.EmailField(help_text='Za kontakt u slučaju zahteva ili upita (ne prikazuje se javno)')
    content = models.TextField(validators=[MaxLengthValidator(1000)])
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author.username if self.author else self.name} - {self.content[:50]}"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='profile_pics', null=True, blank=True)
    bio = CKEditor5Field('Text', config_name='extends', max_length=500, blank=True)

    def __str__(self):
        return self.user.username
