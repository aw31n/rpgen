from django.db import models
from django.conf import settings

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .managers import UserManager

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_("email address"), unique=True)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    @property
    def is_staff(self):
        return self.is_superuser

    def __str__(self):
        return self.email

class Character(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=60)
    age = models.IntegerField(null=True, blank=False)
    character_class = models.CharField(max_length=60, null=True, blank=True)
    race = models.CharField(max_length=60, null=True, blank=True)
    weapon = models.CharField(max_length=60, null=True, blank=True)
    gender = models.TextField(null=True, blank=True)
    story = models.TextField(default='', null=True, blank=True)
    prompt = models.TextField(default='', null=True, blank=True)
    image_prompt = models.TextField(default='', null=True, blank=True)

    def __str__(self):
        return f'Character(id:{self.pk}, name: "{self.name}", owner: {self.owner})'
    
class CharacterImage(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    character = models.ForeignKey(
        Character,
        on_delete=models.CASCADE,
    )
    filename = models.CharField(max_length=60)
    prompt = models.TextField(default='', null=True, blank=True)
    created = models.DateTimeField(auto_now_add= True)

    def __str__(self):
        return f'CharacterImage(id:{self.pk}, filename: {self.filename}, owner: {self.owner}, character: {self.character})'