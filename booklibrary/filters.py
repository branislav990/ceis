import django_filters
from django_filters.rest_framework import OrderingFilter
from .models import Literature, Author
from django.db.models import OuterRef, Subquery


class CustomOrderingFilter(OrderingFilter):
    def filter(self, qs, value):
        if not value:
            return qs

        ordering = []
        for param in value:
            # Map custom ordering params to actual annotated field names
            if param == 'author_first':
                ordering.append('first_author_first_name')
            elif param == '-author_first':
                ordering.append('-first_author_first_name')
            elif param == 'author_last':
                ordering.append('first_author_last_name')
            elif param == '-author_last':
                ordering.append('-first_author_last_name')
            elif param.lstrip('-') in self.get_ordering_param(qs):
                ordering.append(param)

        # Ensure default ordering by title if not provided
        if 'title' not in [param.lstrip('-') for param in value]:
            ordering.append('title')

        return qs.order_by(*ordering)

    @staticmethod
    def get_ordering_param(qs):
        model = qs.model
        fields = [f.name for f in model._meta.fields]
        # Include annotated fields in the ordering options
        return fields + ['first_author_first_name', 'first_author_last_name']


class LiteratureFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(field_name='title', lookup_expr='icontains')
    title_single = django_filters.CharFilter(field_name='title', lookup_expr='exact')
    subject = django_filters.CharFilter(field_name='subjects__name', method='filter_subject')
    publisher = django_filters.CharFilter(field_name='publishers__name', lookup_expr='exact')
    published_before = django_filters.NumberFilter(field_name='publication_year', lookup_expr='lte')
    published_after = django_filters.NumberFilter(field_name='publication_year', lookup_expr='gte')
    published_year = django_filters.NumberFilter(field_name='publication_year', lookup_expr='exact')
    isbn = django_filters.CharFilter(field_name='isbn', lookup_expr='icontains')
    udc = django_filters.CharFilter(field_name='udc_number', lookup_expr='icontains')
    doi = django_filters.CharFilter(field_name='doi', lookup_expr='icontains')
    journal = django_filters.CharFilter(field_name='journal__name', lookup_expr='icontains')
    sci_conf = django_filters.CharFilter(field_name='sci_conf__name', lookup_expr='icontains')
    author_first = django_filters.CharFilter(field_name='authors__first_name', lookup_expr='icontains')
    author_last = django_filters.CharFilter(field_name='authors__last_name', lookup_expr='icontains')
    category = django_filters.CharFilter(field_name='category', method='filter_category')
    language = django_filters.CharFilter(field_name='language', method='filter_language')

    @staticmethod
    def filter_language(queryset, name, value):
        languages = value.split(',')
        return queryset.filter(language__in=languages).distinct()

    @staticmethod
    def filter_subject(queryset, name, value):
        subjects = value.split(',')
        return queryset.filter(subjects__name__in=subjects).distinct()

    @staticmethod
    def filter_category(queryset, name, value):
        categories = value.split(',')
        return queryset.filter(category__in=categories).distinct()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        first_author_subquery = Author.objects.filter(literature=OuterRef('pk')).order_by('pk')
        self.queryset = self.queryset.annotate(
            first_author_first_name=Subquery(first_author_subquery.values('first_name')[:1]),
            first_author_last_name=Subquery(first_author_subquery.values('last_name')[:1]),
        )

    order_by = CustomOrderingFilter(
        fields=(
            ('title', 'title'),
            ('publication_year', 'publication_year'),
            # Map 'author_first' and 'author_last' to annotated fields
            ('first_author_first_name', 'author_first'),
            ('first_author_last_name', 'author_last'),
        )
    )

    class Meta:
        model = Literature
        fields = []







# import django_filters
# from django_filters.rest_framework import OrderingFilter
# from .models import Literature, Author
# from django.db.models import OuterRef, Subquery
#
#
# class CustomOrderingFilter(OrderingFilter):
#     def filter(self, qs, value):
#         if not value:
#             return qs
#
#         ordering = []
#         for param in value:
#             if param.lstrip('-') in self.get_ordering_param(qs):
#                 ordering.append(param)
#
#         if 'title' not in [param.lstrip('-') for param in value]:
#             ordering.append('title')
#
#         return qs.order_by(*ordering)
#
#     @staticmethod
#     def get_ordering_param(qs):
#         model = qs.model
#         fields = [f.name for f in model._meta.fields]
#         return fields
#
#
# class LiteratureFilter(django_filters.FilterSet):
#
#     title = django_filters.CharFilter(field_name='title', lookup_expr='icontains')
#     title_single = django_filters.CharFilter(field_name='title', lookup_expr='exact')
#     subject = django_filters.CharFilter(field_name='subjects__name', method='filter_subject')
#     publisher = django_filters.CharFilter(field_name='publishers__name', lookup_expr='exact')
#     published_before = django_filters.NumberFilter(field_name='publication_year', lookup_expr='lte')
#     published_after = django_filters.NumberFilter(field_name='publication_year', lookup_expr='gte')
#     published_year = django_filters.NumberFilter(field_name='publication_year', lookup_expr='exact')
#     isbn = django_filters.CharFilter(field_name='isbn', lookup_expr='icontains')
#     udc = django_filters.CharFilter(field_name='udc_number', lookup_expr='icontains')
#     doi = django_filters.CharFilter(field_name='doi', lookup_expr='icontains')
#     journal = django_filters.CharFilter(field_name='journal__name', lookup_expr='icontains')
#     sci_conf = django_filters.CharFilter(field_name='sci_conf__name', lookup_expr='icontains')
#     author_first = django_filters.CharFilter(field_name='authors__first_name', lookup_expr='icontains')
#     author_last = django_filters.CharFilter(field_name='authors__last_name', lookup_expr='icontains')
#     category = django_filters.CharFilter(field_name='category', method='filter_category')
#     language = django_filters.CharFilter(field_name='language', method='filter_language')
#
#     @staticmethod
#     def filter_language(queryset, name, value):
#         languages = value.split(',')
#         return queryset.filter(language__in=languages).distinct()
#
#     @staticmethod
#     def filter_subject(queryset, name, value):
#         subjects = value.split(',')
#         return queryset.filter(subjects__name__in=subjects).distinct()
#
#     @staticmethod
#     def filter_category(queryset, name, value):
#         categories = value.split(',')
#         return queryset.filter(category__in=categories).distinct()
#
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         first_author_subquery = Author.objects.filter(literature=OuterRef('pk')).order_by('pk')
#         self.queryset = self.queryset.annotate(
#             first_author_first_name=Subquery(first_author_subquery.values('first_name')[:1]),
#             first_author_last_name=Subquery(first_author_subquery.values('last_name')[:1]),
#         )
#
#     order_by = CustomOrderingFilter(
#         fields=(
#             ('title', 'title'),
#             ('publication_year', 'publication_year'),
#         )
#     )
#
#     class Meta:
#         model = Literature
#         fields = []





# import django_filters
# from django_filters.rest_framework import OrderingFilter
# from .models import Literature, Author
# from django.db.models import OuterRef, Subquery
#
#
# class CustomOrderingFilter(OrderingFilter):
#     def filter(self, qs, value):
#         if not value:
#             return qs
#
#         ordering = []
#         for param in value:
#             if param.lstrip('-') in self.get_ordering_param(qs):
#                 ordering.append(param)
#
#         # Ensure default ordering by title if not provided
#         if 'title' not in [param.lstrip('-') for param in value]:
#             ordering.append('title')
#
#         return qs.order_by(*ordering)
#
#     @staticmethod
#     def get_ordering_param(qs):
#         model = qs.model
#         fields = [f.name for f in model._meta.fields]
#         # Include annotated fields in the ordering options
#         return fields + ['first_author_first_name', 'first_author_last_name']
#
#
# class LiteratureFilter(django_filters.FilterSet):
#     title = django_filters.CharFilter(field_name='title', lookup_expr='icontains')
#     title_single = django_filters.CharFilter(field_name='title', lookup_expr='exact')
#     subject = django_filters.CharFilter(field_name='subjects__name', method='filter_subject')
#     publisher = django_filters.CharFilter(field_name='publishers__name', lookup_expr='exact')
#     published_before = django_filters.NumberFilter(field_name='publication_year', lookup_expr='lte')
#     published_after = django_filters.NumberFilter(field_name='publication_year', lookup_expr='gte')
#     published_year = django_filters.NumberFilter(field_name='publication_year', lookup_expr='exact')
#     isbn = django_filters.CharFilter(field_name='isbn', lookup_expr='icontains')
#     udc = django_filters.CharFilter(field_name='udc_number', lookup_expr='icontains')
#     doi = django_filters.CharFilter(field_name='doi', lookup_expr='icontains')
#     journal = django_filters.CharFilter(field_name='journal__name', lookup_expr='icontains')
#     sci_conf = django_filters.CharFilter(field_name='sci_conf__name', lookup_expr='icontains')
#     author_first = django_filters.CharFilter(field_name='authors__first_name', lookup_expr='icontains')
#     author_last = django_filters.CharFilter(field_name='authors__last_name', lookup_expr='icontains')
#     category = django_filters.CharFilter(field_name='category', method='filter_category')
#     language = django_filters.CharFilter(field_name='language', method='filter_language')
#
#     @staticmethod
#     def filter_language(queryset, name, value):
#         languages = value.split(',')
#         return queryset.filter(language__in=languages).distinct()
#
#     @staticmethod
#     def filter_subject(queryset, name, value):
#         subjects = value.split(',')
#         return queryset.filter(subjects__name__in=subjects).distinct()
#
#     @staticmethod
#     def filter_category(queryset, name, value):
#         categories = value.split(',')
#         return queryset.filter(category__in=categories).distinct()
#
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         first_author_subquery = Author.objects.filter(literature=OuterRef('pk')).order_by('pk')
#         self.queryset = self.queryset.annotate(
#             first_author_first_name=Subquery(first_author_subquery.values('first_name')[:1]),
#             first_author_last_name=Subquery(first_author_subquery.values('last_name')[:1]),
#         )
#
#     order_by = CustomOrderingFilter(
#         fields=(
#             ('title', 'title'),
#             ('publication_year', 'publication_year'),
#             ('first_author_first_name', 'first_author_first_name'),
#             ('first_author_last_name', 'first_author_last_name'),
#         )
#     )
#
#     class Meta:
#         model = Literature
#         fields = []
