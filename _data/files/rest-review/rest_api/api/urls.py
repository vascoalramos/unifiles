from django.conf.urls import url
from django.urls import path

from .views import *

urlpatterns = [
    # access
    path("login", login, name="login"),
    path("logout", logout, name="logout"),

    # client
    path("new_client", new_client, name="new_client"),
    url("^delete_client/(?P<email>.+)", delete_client, name="delete_client"),
    url("^update_client/(?P<email>.+)", update_client, name="update_client"),
    url("^client/(?P<email>.+)", get_client, name="get_client"),
    path("clients", get_all_clients, name="get_all_clients"),
    path("my_favorites", get_client_favorites, name="get_client_favorites"),
    path("add_to_favorites", add_restaurant_to_favorites, name="add_restaurant_to_favorites"),
    path("remove_from_favorites", remove_restaurant_from_favorites, name="remove_restaurant_from_favorites"),

    # owners
    path("new_owner", new_owner, name="new_owner"),
    url("^delete_owner/(?P<email>.+)", delete_owner, name="delete_owner"),
    url("^update_owner/(?P<email>.+)", update_owner, name="update_owner"),
    url("^owner_profile/(?P<email>.+)", get_owner_profile, name="get_owner_profile"),
    url("^owner/(?P<email>.+)", get_owner, name="get_owner"),
    path("owners", get_all_owners, name="get_all_owners"),
    path("my_restaurants", get_owner_restaurants, name="get_owner_restaurants"),

    # restaurants
    path("new_restaurant", new_restaurant, name="new_restaurant"),
    path("update_restaurant/<int:number>", update_restaurant, name="update_restaurant"),
    path("delete_restaurant/<int:number>", delete_restaurant, name="delete_restaurant"),
    path("restaurant/<int:number>", get_restaurant, name="get_restaurant"),
    path("restaurants", get_all_restaurants, name="get_all_restaurants"),
    path("top-2", get_top_2_rests, name="get_top_2"),

    # reviews
    path("register_review/<int:number>", register_review, name="register_review"),
    path("review/<int:number>", get_review, name="get_review"),

    # reload
    path("reload_database", reload_database, name="reload_database"),
]
