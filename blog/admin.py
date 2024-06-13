from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import BlogPost, Comment, Profile


class BlogPostAdmin(admin.ModelAdmin):
    readonly_fields = ('views', 'likes')
    list_display = ('title', 'views', 'likes', 'created_on')
    list_filter = ('created_on',)
    search_fields = ('title', 'content')


class CommentAdmin(admin.ModelAdmin):
    list_display = ('blog_post', 'author_or_name', 'email', 'content', 'created_on')
    list_filter = ('blog_post', 'name', 'email', 'created_on')

    def author_or_name(self, obj):
        return obj.author.username if obj.author else obj.name or 'Anonymous'
    author_or_name.short_description = 'Author/Name'


admin.site.register(BlogPost, BlogPostAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Profile)
