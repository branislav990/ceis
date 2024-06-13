from django.views.generic import ListView, DetailView
from .models import BlogPost, Comment
from .forms import CommentForm
from django.shortcuts import render, get_object_or_404, redirect
# from django.contrib import messages
from .utils import transform_oembed
from django.views.decorators.csrf import csrf_exempt


class BlogPostListView(ListView):
    model = BlogPost
    ordering = ['-created_on']
    template_name = "blog/blog_list.html"


class BlogPostDetailView(DetailView):
    model = BlogPost
    template_name = "blog/blog_detail.html"

    # Setting the path parameter
    slug_field = 'url_identifier'
    slug_url_kwarg = 'url_identifier'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['comments'] = Comment.objects.filter(blog_post=self.object).order_by('-created_on')

        # Initialize "name" and "email" fields based on the cookies
        name = self.request.COOKIES.get('blog_comment_name', '')
        email = self.request.COOKIES.get('blog_comment_email', '')

        if not self.request.user.is_authenticated:
            # Checking if post has already been liked by the reader
            liked_posts = self.request.COOKIES.get('liked_blog_posts', '').split(',')
            context['liked'] = str(self.object.pk) in liked_posts

            # Setting the reader's name and email based on whether they have already commented on the post
            context['comment_form'] = CommentForm(initial={'name': name, 'email': email})
        else:
            context['comment_form'] = CommentForm(user=self.request.user)

        # oembed to iframe conversion for CKeditor5
        context['content'] = transform_oembed(self.object.content)

        return context

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()

        # Increment the view count
        self.object.views += 1
        self.object.save(update_fields=['views'])

        context = self.get_context_data(object=self.object)
        return render(request, self.template_name, context)

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        form = CommentForm(request.POST, user=self.request.user)

        if form.is_valid():
            comment = form.save(commit=False)

            # Set default values for admin users
            if self.request.user.is_authenticated:
                comment.author = self.request.user
                comment.name = self.request.user.first_name + ' ' + self.request.user.last_name
                comment.email = self.request.user.email

            comment.blog_post = self.object
            comment.save()

            comments = Comment.objects.filter(blog_post=self.object).order_by('-created_on')
            comment_form = CommentForm(user=self.request.user)

            # Set predefined comment form values for name and email for non-authenticated readers if stored in cookies
            if not self.request.user.is_authenticated:
                name = self.request.COOKIES.get('blog_comment_name', '')
                email = self.request.COOKIES.get('blog_comment_email', '')
                comment_form = CommentForm(initial={'name': name, 'email': email})

            # messages.success(request, 'Komentar uspešno dodat')
            ctx = self.get_context_data()
            ctx.update({'comments': comments, 'comment_form': comment_form})
            response = render(request, 'blog/partials/comment_section.html', ctx)

            # Set name and email cookie values for readers who comment for the first time
            if not self.request.user.is_authenticated:
                if 'blog_comment_name' not in request.COOKIES:
                    response.set_cookie('blog_comment_name', request.POST['name'], max_age=157_784_760)
                if 'blog_comment_email' not in request.COOKIES:
                    response.set_cookie('blog_comment_email', request.POST['email'], max_age=157_784_760)

            return response

        else:
            comments = Comment.objects.filter(blog_post=self.object).order_by('-created_on')
            ctx = {'comments': comments, 'comment_form': form}
            return render(request, 'blog/partials/comment_section.html', ctx)


@csrf_exempt
def like(request, post_pk):
    blogpost = get_object_or_404(BlogPost, pk=post_pk)
    blogpost.likes += 1
    blogpost.save(update_fields=['likes'])

    liked_posts_list = request.COOKIES.get('liked_blog_posts', '')
    liked_posts_list = liked_posts_list.split(',') if liked_posts_list else []

    liked_posts_list.append(str(post_pk))

    liked_posts_str = ','.join(map(str, liked_posts_list))

    response = render(request, 'blog/partials/unlike.html', {'blogpost': blogpost})
    response.set_cookie('liked_blog_posts', liked_posts_str, max_age=157_784_760)
    return response


@csrf_exempt
def unlike(request, post_pk):
    blogpost = get_object_or_404(BlogPost, pk=post_pk)
    blogpost.likes -= 1
    blogpost.save(update_fields=['likes'])

    liked_posts_list = request.COOKIES.get('liked_blog_posts', '')
    liked_posts_list = liked_posts_list.split(',') if liked_posts_list else []

    liked_posts_list.remove(str(post_pk))

    liked_posts_str = ','.join(map(str, liked_posts_list))

    response = render(request, 'blog/partials/like.html', {'blogpost': blogpost})
    response.set_cookie('liked_blog_posts', liked_posts_str, max_age=157_784_760)
    return response


def return_to_blog(request):
    return redirect('blog/')
