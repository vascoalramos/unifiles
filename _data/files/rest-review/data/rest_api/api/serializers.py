from rest_framework import serializers

from .models import *


class UserSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.CharField(required=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)


class ClientSerializer(serializers.Serializer):
    email = serializers.SerializerMethodField()
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    phone_number = serializers.CharField()
    photo = serializers.CharField()

    def get_id(self, obj):
        return obj.user.id

    def get_email(self, obj):
        return obj.user.email

    def get_first_name(self, obj):
        return obj.user.first_name

    def get_last_name(self, obj):
        return obj.user.last_name


class AllClientsSerializer(serializers.Serializer):
    email = serializers.SerializerMethodField()
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    phone_number = serializers.CharField()

    def get_id(self, obj):
        return obj.user.id

    def get_email(self, obj):
        return obj.user.email

    def get_first_name(self, obj):
        return obj.user.first_name

    def get_last_name(self, obj):
        return obj.user.last_name


class OwnerSerializer(serializers.Serializer):
    email = serializers.SerializerMethodField()
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    phone_number = serializers.CharField()
    photo = serializers.CharField()

    def get_id(self, obj):
        return obj.user.id

    def get_email(self, obj):
        return obj.user.email

    def get_first_name(self, obj):
        return obj.user.first_name

    def get_last_name(self, obj):
        return obj.user.last_name


class AllOwnersSerializer(serializers.Serializer):
    email = serializers.SerializerMethodField()
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    phone_number = serializers.CharField()

    def get_id(self, obj):
        return obj.user.id

    def get_email(self, obj):
        return obj.user.email

    def get_first_name(self, obj):
        return obj.user.first_name

    def get_last_name(self, obj):
        return obj.user.last_name


class RestaurantSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(required=True)
    address = serializers.CharField(required=True)
    city = serializers.CharField(required=True)
    zip_code = serializers.CharField(required=True)
    country = serializers.CharField(required=True)
    latitude = serializers.FloatField(required=True)
    longitude = serializers.FloatField(required=True)
    is_open = serializers.BooleanField()
    phone_number = serializers.CharField()
    description = serializers.CharField()
    photo = serializers.CharField()
    owner = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()
    avg_score = serializers.SerializerMethodField()
    n_of_reviews = serializers.SerializerMethodField()

    def get_reviews(self, obj):
        return [ReviewSerializer(r).data for r in Review.objects.filter(restaurant=obj)]

    def get_avg_score(self, obj):
        scores = [r.stars for r in Review.objects.filter(restaurant=obj)]
        return round(sum(scores) / len(scores), 1) if len(scores) != 0 else 0.0

    def get_n_of_reviews(self, obj):
        return len(Review.objects.filter(restaurant=obj))

    def get_owner(self, obj):
        owner_data = OwnerSerializer(obj.owner).data
        owner_data["n_of_rests"] = len([r for r in Restaurant.objects.filter(owner=obj.owner)])
        return owner_data


class AllRestaurantsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(required=True)
    address = serializers.CharField(required=True)
    city = serializers.CharField(required=True)
    country = serializers.CharField(required=True)
    phone_number = serializers.CharField()
    photo = serializers.CharField()
    avg_score = serializers.SerializerMethodField()
    n_of_reviews = serializers.SerializerMethodField()
    avg_cleanliness = serializers.SerializerMethodField()
    avg_price = serializers.SerializerMethodField()
    avg_speed = serializers.SerializerMethodField()

    def get_avg_score(self, obj):
        scores = [r.stars for r in Review.objects.filter(restaurant=obj)]
        return round(sum(scores) / len(scores), 1) if len(scores) != 0 else 0.0

    def get_n_of_reviews(self, obj):
        return len(Review.objects.filter(restaurant=obj))

    def get_avg_cleanliness(self, obj):
        clean = [r.cleanliness for r in Review.objects.filter(restaurant=obj)]
        return round(sum(clean) / len(clean), 1) if len(clean) != 0 else 0.0

    def get_avg_price(self, obj):
        prices = [r.price for r in Review.objects.filter(restaurant=obj)]
        return round(sum(prices) / len(prices), 1) if len(prices) != 0 else 0.0

    def get_avg_speed(self, obj):
        speeds = [r.speed for r in Review.objects.filter(restaurant=obj)]
        return round(sum(speeds) / len(speeds), 1) if len(speeds) != 0 else 0.0


class ReviewSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField(required=True)
    comment = serializers.CharField(required=True)
    stars = serializers.CharField(required=True)
    price = serializers.CharField(required=True)
    quality = serializers.CharField(required=True)
    cleanliness = serializers.FloatField(required=True)
    speed = serializers.FloatField(required=True)
    timestamp = serializers.BooleanField()
    client = serializers.SerializerMethodField()

    def get_client(self, obj):
        cl = ClientSerializer(obj.user).data
        cl["number_of_reviews"] = len(Review.objects.filter(user=obj.user))
        return cl
