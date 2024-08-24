from rest_framework import serializers
from booklibrary.models import Literature, ResearchSubject, Publisher, Journal, ScientificConference, Author


class ResearchSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchSubject
        fields = ['name']


class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = ['name', 'place', 'website', 'email']


class JournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Journal
        fields = ['name', 'issn', 'editor', 'website']


class ScientificConferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScientificConference
        fields = ['name', 'isbn', 'issn', 'editor']


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['first_name', 'last_name', 'email']


class LiteratureSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True, read_only=True)
    subjects = ResearchSubjectSerializer(many=True, read_only=True)
    # publishers = serializers.SerializerMethodField(method_name='get_publishers')
    publishers = PublisherSerializer(many=True, read_only=True)
    journal = JournalSerializer(read_only=True)
    sci_conf = ScientificConferenceSerializer(read_only=True)
    category = serializers.CharField(source='get_category_display')
    language = serializers.CharField(source='get_language_display')
    # cover_img = serializers.CharField(source='cover_image')

    class Meta:
        model = Literature
        fields = [
            'id',
            'title',
            'cover_image',
            'authors',
            'publishers',
            'publication_year',
            'journal',
            'sci_conf',
            'isbn',
            'doi',
            'language',
            'category',
            'subjects',
            'pdf',
            'external_url',
        ]

    # To access publishers not directly but from the related journal or scientific conference
    # @staticmethod
    # def get_publishers(obj):
    #     # If the Literature is linked to a Journal, return its publishers
    #     if obj.journal:
    #         return PublisherSerializer(obj.journal.publishers.all(), many=True).data
    #     # If the Literature is linked to a Scientific Conference, return its publishers
    #     elif obj.sci_conf:
    #         return PublisherSerializer(obj.sci_conf.publishers.all(), many=True).data
    #     # Otherwise, return the publishers directly linked to the Literature
    #     return PublisherSerializer(obj.publishers.all(), many=True).data
