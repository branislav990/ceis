from django.db.models import Max, Min, Count
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from .models import Literature, ResearchSubject, Publisher
from .serializers import LiteratureSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import LiteratureFilter
from django.shortcuts import render


class CustomPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_page_size(self, request):
        limit = request.query_params.get('limit')
        if limit is not None:
            try:
                return min(int(limit), self.max_page_size)
            except ValueError:
                pass  # Handle invalid 'limit' values gracefully
        return super().get_page_size(request)


class LiteratureListAPIView(ListAPIView):
    queryset = Literature.objects.all()
    serializer_class = LiteratureSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = LiteratureFilter
    pagination_class = CustomPagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            paginated_data = serializer.data
            paginated_response = self.get_paginated_response(paginated_data).data
            # Extract pagination metadata
            pagination_metadata = {
                'count': paginated_response['count'],
                'next': paginated_response['next'],
                'previous': paginated_response['previous'],
                'results': paginated_response['results']
            }
        else:
            serializer = self.get_serializer(queryset, many=True)
            paginated_data = serializer.data
            pagination_metadata = {}

        # Category counts
        category_counts = (
            queryset.values('category')
            .annotate(count=Count('category'))
            .order_by('-count')
        )
        category_counts = [
            {'category': Literature.Category(category['category']).label, 'count': category['count']}
            for category in category_counts
        ]

        # Language counts
        language_counts = (
            queryset.values('language')
            .annotate(count=Count('language'))
            .order_by('-count')
        )
        language_counts = [
            {'language': Literature.Language(language['language']).label, 'count': language['count']}
            for language in language_counts
        ]

        # Subject counts
        subject_counts = (
            queryset.values('subjects__name')
            .annotate(count=Count('subjects__name'))
            .order_by('-count')
        )

        # Build final response with everything at the same level
        response_data = {
            'filter_counts': {
                'category_counts': category_counts,
                'language_counts': language_counts,
                'subject_counts': subject_counts,
            },
            **pagination_metadata,
            'results': paginated_data
        }

        return Response(response_data)


class LiteratureDetailAPIView(RetrieveAPIView):
    queryset = Literature.objects.all()
    serializer_class = LiteratureSerializer


class ResearchSubjectAPIView(APIView):
    @staticmethod
    def get(request, *args, **kwargs):
        subjects = ResearchSubject.objects.all()
        names = [subject.name for subject in subjects]
        return Response(names, status=status.HTTP_200_OK)


class CategoriesAPIView(APIView):
    @staticmethod
    def get(request, *args, **kwargs):
        # labels = [choice[1] for choice in Literature.Category.choices]
        labels = Literature.Category.choices
        return Response(labels)


class LanguagesAPIView(APIView):
    @staticmethod
    def get(request, *args, **kwargs):
        languages = Literature.Language.choices
        # languages = [choice[1] for choice in Literature.Language.choices]
        return Response(languages)


class PublicationYearAPIView(APIView):
    @staticmethod
    def get(request, *args, **kwargs):
        publication_years = Literature.objects.aggregate(
            min_year=Min('publication_year'),
            max_year=Max('publication_year')
        )
        return Response(publication_years)


class PublisherAPIView(APIView):
    @staticmethod
    def get(request, *args, **kwargs):
        publishers = Publisher.objects.all()
        names = [publisher.name for publisher in publishers]
        return Response(names, status=status.HTTP_200_OK)


def library_view(request):
    if request.path.endswith('/pdf'):
        template_name = 'booklibrary/pdf_viewer.html'
    else:
        template_name = 'booklibrary/library.html'

    return render(request, template_name)
