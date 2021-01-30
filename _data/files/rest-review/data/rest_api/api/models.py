from django.contrib.auth.models import User
from django.db import models


class Owner(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True, primary_key=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    photo = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"


class Restaurant(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    address = models.CharField(max_length=50)
    city = models.CharField(max_length=25)
    zip_code = models.CharField(max_length=10)
    country = models.CharField(max_length=30)
    latitude = models.FloatField()
    longitude = models.FloatField()
    phone_number = models.CharField(max_length=20)
    is_open = models.BooleanField(default=True, blank=True)
    photo = models.TextField(null=True, blank=True)
    owner = models.ForeignKey(Owner, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name}"


class Client(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True, primary_key=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    photo = models.TextField(null=True, blank=True)
    favorites = models.ManyToManyField(Restaurant)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"


class Review(models.Model):
    user = models.ForeignKey(Client, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    title = models.CharField(null=True, blank=True, max_length=50)
    comment = models.TextField(null=True, blank=True)
    stars = models.FloatField()
    price = models.IntegerField()
    quality = models.IntegerField()
    cleanliness = models.IntegerField()
    speed = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
