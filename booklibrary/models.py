from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
import datetime


class Publisher(models.Model):
    name = models.CharField(max_length=100)
    place = models.CharField(max_length=50)
    website = models.URLField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    class Meta:
        verbose_name = 'Izdavač'
        verbose_name_plural = "Izdavači"

    def __str__(self):
        return self.name


class ResearchSubject(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = 'Oblast istraživanja'
        verbose_name_plural = "Oblasti istraživanja"

    def __str__(self):
        return self.name


class Journal(models.Model):
    name = models.CharField(max_length=255)
    issn = models.CharField(max_length=10, blank=True, null=True)
    publishers = models.ManyToManyField(Publisher)
    editor = models.CharField(max_length=255, blank=True, null=True)
    website = models.URLField(blank=True, null=True)

    class Meta:
        verbose_name = 'Serijska publikacija'
        verbose_name_plural = "Serijske publikacije"

    def __str__(self):
        return self.name


class ScientificConference(models.Model):
    name = models.CharField(max_length=255)
    isbn = models.CharField(max_length=13, blank=True, null=True)
    issn = models.CharField(max_length=10, blank=True, null=True)
    editor = models.CharField(max_length=255, blank=True, null=True)
    publishers = models.ManyToManyField(Publisher)

    class Meta:
        verbose_name = 'Naučni skup'
        verbose_name_plural = 'Naučni skupovi'

    def __str__(self):
        return self.name


class Author(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(blank=True, null=True)

    class Meta:
        verbose_name = 'Autor'
        verbose_name_plural = 'Autori'

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class Literature(models.Model):

    class Category(models.TextChoices):
        SCIENTIFIC_ARTICLE = "SCI_ART", "Naučni rad"
        SCIENTIFIC_BOOK = "SCI_BOOK", "Naučna knjiga"
        THESIS_DISSERTATION = "THES_DIS", "Teza/Disertacija"
        POPULAR_SCIENCE = "SCI_POP", "Popularna nauka"
        PROJECT = "PROJECT", "Projekat"

    class Language(models.TextChoices):
        SERBIAN = "RS", "Srpski"
        BULGARIAN = "BG", "Bugarski"
        ENGLISH = "EN", "Engleski"

    # class Subject(models.TextChoices):
    #     ENVIRONMENTAL_MONITORING = "ENV_MON", "Monitoring životne sredine"
    #     BIODIVERSITY_RESEARCH = "BD_RES", "Biodiverzitet"
    #     AGRICULTURE = "AGR", "Poljoprivreda"

    title = models.CharField(max_length=255, unique=True)
    cover_image = models.ImageField(upload_to='literature/cover_img/', null=True, blank=True)
    subjects = models.ManyToManyField(ResearchSubject)
    publishers = models.ManyToManyField(Publisher, blank=True)
    publication_year = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(datetime.datetime.now().year)
        ]
    )
    isbn = models.CharField(max_length=13, blank=True, null=True)
    doi = models.CharField(max_length=255, blank=True, null=True)
    journal = models.ForeignKey(Journal, blank=True, null=True, on_delete=models.SET_NULL)
    sci_conf = models.ForeignKey(ScientificConference, blank=True, null=True, on_delete=models.SET_NULL)
    authors = models.ManyToManyField(Author)
    category = models.CharField(choices=Category.choices, max_length=10)
    language = models.CharField(choices=Language.choices, max_length=10)
    pdf = models.FileField(upload_to="literature/pdf/", blank=True, null=True)
    external_url = models.URLField(blank=True, null=True)

    def get_publishers(self):
        if self.journal:
            return self.journal.publishers.all()
        elif self.sci_conf:
            return self.sci_conf.publishers.all()
        return self.publishers.all()

    class Meta:
        verbose_name = "Literatura"
        verbose_name_plural = "Literatura"

    def __str__(self):
        return self.title
