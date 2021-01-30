from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_403_FORBIDDEN
)

from api.models import *
from rest_api import queries
from .authentication import token_expire_handler
from .serializers import UserSerializer, UserLoginSerializer


def get_user_type(username, request=None):
    """
    This method is used to know the type of the user that is requesting some info.
    :param username:
    :param request:
    :return:
    """
    try:
        if username is None:
            username = request.user.username

        if User.objects.get(username=username).is_superuser:
            return "admin"
        elif User.objects.get(username=username).groups.all()[0].name in ["clients_group"]:
            return "client"
        elif User.objects.get(username=username).groups.all()[0].name in ["owners_group"]:
            return "owner"
        else:
            return None

    except User.DoesNotExist:
        return None


def who_am_i(request):
    """
    This method is used to know the username, token and type of the user that is requesting some info.
    :param request:
    :return:
    """
    token = Token.objects.get(user=request.user).key
    username = request.user.username
    user_type = get_user_type(username)

    return token, username, user_type


@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    """
    Functions that logs int the requester user. If there is a existing token, it returns that one.
    Otherwise, creates a new token for valid users.
    :param request: Who has made the request.
    :return: Response 200 with user_type, data and token, if everything goes smoothly.
    Or Response 404 for not found error.
    """
    login_serializer = UserLoginSerializer(data=request.data)
    if not login_serializer.is_valid():
        return Response(login_serializer.errors, status=HTTP_400_BAD_REQUEST)

    user = authenticate(
        username=login_serializer.data['username'],
        password=login_serializer.data['password']
    )
    if not user:
        message = "Credenciais para o login inválidas!"
        return Response({'detail': message}, status=HTTP_404_NOT_FOUND)

    # TOKEN STUFF
    token, _ = Token.objects.get_or_create(user=user)

    # token_expire_handler will check, if the token is expired it will generate new one
    is_expired, token = token_expire_handler(token)  # The implementation will be described further
    user_serialized = UserSerializer(user)

    return Response({"user_type": get_user_type(user.username), "data": user_serialized.data,
                     "token": token.key}, status=HTTP_200_OK)


@csrf_exempt
@api_view(["GET"])
def logout(request):
    """
    Functions that logs out the requester user and deletes the token associated with that user.
    :param request: Who has made the request
    :return: Response 200.
    """
    auth_token = request.META["HTTP_AUTHORIZATION"].split()[1]
    Token.objects.get(key=auth_token).delete()
    return Response(status=HTTP_200_OK)


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def new_client(request):
    """
    Function that allows a new client to register itself.
    :param request: Who has made the request.
    :return: Response 200 with user_type, state, message and token, if everything goes smoothly. Response 400 if there
    is some kind of request error. Response 403 for forbidden. Or Response 404 for not found error.
    """
    if "email" not in request.data or "first_name" not in request.data or "last_name" not in request.data or "password" not in request.data:
        return Response({"state": "Error", "message": "Missing parameters"}, status=HTTP_400_BAD_REQUEST)
    state, message, username = queries.add_client(request.data)

    state, status = ("Success", HTTP_200_OK) if state else ("Error", HTTP_400_BAD_REQUEST)

    return Response({"state": state, "message": message}, status=status)


@csrf_exempt
@api_view(["PUT"])
def update_client(request, email):
    """
    Function that allows a User to update his profile.
    :param request: Who has made the request.
    :param email: Client that the requester wants to update.
    :return: Response 200 with user_type, state, message and token, if everything goes smoothly. Response 400 if there
    is some kind of request error. Response 403 for forbidden. Or Response 404 for not found error.
    """
    token, username, user_type = who_am_i(request)
    if username == email:
        state, message = queries.update_client(request, email)
        if state:
            return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                            status=HTTP_200_OK)
        else:
            return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                            status=HTTP_400_BAD_REQUEST)

    else:
        state, message = "Error", "Não tens permissões para atualizar este utilizador!"
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_403_FORBIDDEN)


@csrf_exempt
@api_view(["DELETE"])
def delete_client(request, email):
    """
    Function that allows the client to delete itself.
    :param request: Who has made the request
    :param email: Client that the requester wants to delete.
    :return: Response 200 with user_type, state, message and token, if everything goes smoothly. Response 400 if there
    is some kind of request error. Response 403 for forbidden. Or Response 404 for not found error.
    """
    token, username, user_type = who_am_i(request)
    try:
        user = User.objects.get(username=email)
    except User.DoesNotExist:
        state, message = "Error", "Uilizador não existe!"
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_400_BAD_REQUEST)

    if get_user_type(email) == "client":
        if username == email:
            state, message = queries.delete_user(user)

            state, status = ("Success", HTTP_200_OK) if state else ("Error", HTTP_400_BAD_REQUEST)

            return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                            status=status)

        else:
            state, message = "Error", "Não tens permissões para eliminar este utilizador!"
            return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                            status=HTTP_403_FORBIDDEN)
    else:
        state, message = "Error", "O utilizador especificado não é um cliente!"
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["GET"])
def get_client(request, email):
    """
    """
    token, username, user_type = who_am_i(request)
    if username == email:
        state, message = queries.get_client(email)
        if state:
            return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                            status=HTTP_200_OK)
        else:
            return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                            status=HTTP_400_BAD_REQUEST)

    else:
        state, message = "Error", "Não tens permissões para aceder à informação deste utilizador!"
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_403_FORBIDDEN)


@csrf_exempt
@api_view(["GET"])
def get_all_clients(request):
    """
    """
    token, username, user_type = who_am_i(request)
    state, message = queries.get_all_clients()
    if state:
        return Response({"user_type": user_type, "state": "Success", "message": message, 'token': token},
                        status=HTTP_200_OK)
    else:
        return Response({"user_type": user_type, "state": "Error", "message": message, 'token': token},
                        status=HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def new_owner(request):
    """
    Function that allows a new owner to register itself.
    :param request: Who has made the request.
    :return: Response 200 with user_type, state, message and token, if everything goes smoothly. Response 400 if there
    is some kind of request error. Response 403 for forbidden. Or Response 404 for not found error.
    """
    if "email" not in request.data or "first_name" not in request.data or "last_name" not in request.data or "password" not in request.data:
        return Response({"state": "Error", "message": "Missing parameters"}, status=HTTP_400_BAD_REQUEST)
    state, message, username = queries.add_owner(request.data)

    state, status = ("Success", HTTP_200_OK) if state else ("Error", HTTP_400_BAD_REQUEST)

    return Response({"state": state, "message": message}, status=status)


@csrf_exempt
@api_view(["PUT"])
def update_owner(request, email):
    """
    Function that allows a User to update his profile.
    :param request: Who has made the request.
    :param email: Client that the requester wants to update.
    :return: Response 200 with user_type, state, message and token, if everything goes smoothly. Response 400 if there
    is some kind of request error. Response 403 for forbidden. Or Response 404 for not found error.
    """
    token, username, user_type = who_am_i(request)
    if username == email:
        state, message = queries.update_owner(request, email)
        if state:
            return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                            status=HTTP_200_OK)
        else:
            return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                            status=HTTP_400_BAD_REQUEST)

    else:
        state, message = "Error", "Não tens permissões para atualizar este utilizador!"
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_403_FORBIDDEN)


@csrf_exempt
@api_view(["DELETE"])
def delete_owner(request, email):
    """
    Function that allows the client to delete itself.
    :param request: Who has made the request
    :param email: Client that the requester wants to delete.
    :return: Response 200 with user_type, state, message and token, if everything goes smoothly. Response 400 if there
    is some kind of request error. Response 403 for forbidden. Or Response 404 for not found error.
    """
    token, username, user_type = who_am_i(request)
    try:
        user = User.objects.get(username=email)
    except User.DoesNotExist:
        state = "Error"
        message = "Uilizador não existe!"
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_400_BAD_REQUEST)

    if get_user_type(email) == "owner":
        if username == email:
            state, message = queries.delete_user(user)

            state, status = ("Success", HTTP_200_OK) if state else ("Error", HTTP_400_BAD_REQUEST)

            return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                            status=status)

        else:
            state, message = "Error", "Não tens permissões para eliminar este utilizador!"
            return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                            status=HTTP_403_FORBIDDEN)
    else:
        state, message = "Error", "O utilizador especificado não é um owner!"
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["GET"])
def get_owner_profile(request, email):
    """
    """
    token, username, user_type = who_am_i(request)
    state, message = queries.get_owner_profile(email)
    if state:
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_200_OK)
    else:
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["GET"])
@permission_classes((AllowAny,))
def get_owner(request, email):
    """
    """
    token, username, user_type = (None, None, None) if request.user.is_anonymous else who_am_i(request)
    state, message = queries.get_owner(email)
    if state:
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_200_OK)
    else:
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["GET"])
def get_all_owners(request):
    """
    """
    token, username, user_type = who_am_i(request)
    state, message = queries.get_all_owners()
    if state:
        return Response({"user_type": user_type, "state": "Success", "message": message, 'token': token},
                        status=HTTP_200_OK)
    else:
        return Response({"user_type": user_type, "state": "Error", "message": message, 'token': token},
                        status=HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def new_restaurant(request):
    """
    Function that allows a new owner to register itself.
    :param request: Who has made the request.
    :return: Response 200 with user_type, state, message and token, if everything goes smoothly. Response 400 if there
    is some kind of request error. Response 403 for forbidden. Or Response 404 for not found error.
    """
    token, username, user_type = who_am_i(request)

    if "name" not in request.data or "address" not in request.data or "city" not in request.data or "zip_code" not in request.data or "country" not in request.data or "latitude" not in request.data or "longitude" not in request.data or "phone_number" not in request.data:
        return Response({"user_type": user_type, "state": "Error", "message": "Missing parameters", "token": token},
                        status=HTTP_400_BAD_REQUEST)

    state, message = queries.add_restaurant(request.data, username)

    state, status = ("Success", HTTP_200_OK) if state else ("Error", HTTP_400_BAD_REQUEST)

    return Response({"user_type": user_type, "state": state, "message": message, "token": token}, status=status)


@csrf_exempt
@api_view(["PUT"])
def update_restaurant(request, number):
    """
    Function that allows a User to update his profile.
    :param request: Who has made the request.
    :param number: Client that the requester wants to update.
    :return: Response 200 with user_type, state, message and token, if everything goes smoothly. Response 400 if there
    is some kind of request error. Response 403 for forbidden. Or Response 404 for not found error.
    """
    token, username, user_type = who_am_i(request)

    rest = Restaurant.objects.filter(id=number)
    if not rest.exists():
        state, message = "Error", "Restaurante não existe!"
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_400_BAD_REQUEST)

    if user_type == "owner":
        owner = Owner.objects.get(user__username=username)
        if rest[0].owner == owner:
            state, message = queries.update_restaurant(request, rest)
            if state:
                return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                                status=HTTP_200_OK)
            else:
                return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                                status=HTTP_400_BAD_REQUEST)

        else:
            state, message = "Error", "Não tens permissões para realizar esta operação!"
            return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                            status=HTTP_403_FORBIDDEN)

    else:
        state, message = "Error", "Não tens permissões para realizar esta operação!"
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_403_FORBIDDEN)


@csrf_exempt
@api_view(["DELETE"])
def delete_restaurant(request, number):
    """
    Function that allows an owner to delete a restaurant it owns.
    :param request: Who has made the request
    :param number: The restaurant id the owner wants to delete
    :return: Response 200 with user_type, state, message and token, if everything goes smoothly. Response 400 if there
    is some kind of request error. Response 403 for forbidden. Or Response 404 for not found error.
    """
    token, username, user_type = who_am_i(request)
    try:
        rest = Restaurant.objects.get(id=number)
    except Restaurant.DoesNotExist:
        state, message = "Error", "Restaurante não existe!"
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_400_BAD_REQUEST)

    if user_type == "owner":
        owner = Owner.objects.get(user__username=username)
        if rest.owner == owner:
            state, message = queries.delete_restaurant(rest)

            state, status = ("Success", HTTP_200_OK) if state else ("Error", HTTP_400_BAD_REQUEST)

            return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                            status=status)

        else:
            state, message = "Error", "Não tens permissões para realizar esta operação!"
            return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                            status=HTTP_403_FORBIDDEN)
    else:
        state, message = "Error", "Não tens permissões para realizar esta operação!"
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["GET"])
@permission_classes((AllowAny,))
def get_restaurant(request, number):
    """
    """
    token, username, user_type = (None, None, None) if request.user.is_anonymous else who_am_i(request)
    state, message = queries.get_restaurant(number=number, user_type=user_type, username=username)
    if state:
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_200_OK)
    else:
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["GET"])
@permission_classes((AllowAny,))
def get_all_restaurants(request):
    """
    """
    token, username, user_type = (None, None, None) if request.user.is_anonymous else who_am_i(request)
    state, message = queries.get_all_restaurants(username=username, user_type=user_type, data=request.query_params)
    if state:
        return Response({"user_type": user_type, "state": "Success", "message": message, "token": token},
                        status=HTTP_200_OK)
    else:
        return Response({"user_type": user_type, "state": "Error", "message": message, "token": token},
                        status=HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["GET"])
@permission_classes((AllowAny,))
def get_top_2_rests(request):
    """
    """
    token, username, user_type = (None, None, None) if request.user.is_anonymous else who_am_i(request)
    state, message = queries.get_all_restaurants(username=username, user_type=user_type, data=request.data)
    if state:
        return Response({"user_type": user_type, "state": "Success", "message": message[:2], "token": token},
                        status=HTTP_200_OK)
    else:
        return Response({"user_type": user_type, "state": "Error", "message": message, "token": token},
                        status=HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def register_review(request, number):
    """
    """
    token, username, user_type = who_am_i(request)
    if not user_type == "client":
        state, message = "Error", "Não tens permissões para atualizar este utilizador!"
        return Response({"user_type": user_type, "state": state, "message": message, "token": token},
                        status=HTTP_403_FORBIDDEN)
    if "comment" not in request.data or "title" not in request.data or "score" not in request.data or "price" not in request.data or "clean" not in request.data or "quality" not in request.data or "speed" not in request.data:
        return Response({"user_type": user_type, "state": "Error", "message": "Missing parameters", "token": token},
                        status=HTTP_400_BAD_REQUEST)
    state, message = queries.register_review(request.data, number, request.user)

    state, status = ("Success", HTTP_200_OK) if state else ("Error", HTTP_400_BAD_REQUEST)

    return Response({"user_type": user_type, "state": state, "message": message, "token": token}, status=status)


@csrf_exempt
@api_view(["GET"])
def get_review(request, number):
    """
    """
    token, username, user_type = who_am_i(request)
    if not user_type == "client":
        state, message = "Error", "Não tens permissões para atualizar este utilizador!"
        return Response({"user_type": user_type, "state": state, "message": message, "token": token},
                        status=HTTP_403_FORBIDDEN)

    state, message = queries.get_review(number, request.user)

    state, status = ("Success", HTTP_200_OK) if state else ("Error", HTTP_400_BAD_REQUEST)

    return Response({"user_type": user_type, "state": state, "message": message, "token": token}, status=status)


@csrf_exempt
@api_view(["GET"])
def get_owner_restaurants(request):
    """
    """
    token, username, user_type = who_am_i(request)

    if user_type != "owner":
        state, message = "Error", "Não tens permissões para aceder esta informação!"
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_403_FORBIDDEN)

    state, message = queries.get_owner_restaurants(owner=Owner.objects.get(user=request.user))
    if state:
        return Response({"user_type": user_type, "state": "Success", "message": message, "token": token},
                        status=HTTP_200_OK)
    else:
        return Response({"user_type": user_type, "state": "Error", "message": message, "token": token},
                        status=HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["GET"])
def get_client_favorites(request):
    """
    """
    token, username, user_type = who_am_i(request)

    if user_type != "client":
        state, message = "Error", "Não tens permissões para aceder esta informação!"
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_403_FORBIDDEN)

    state, message = queries.get_client_favorites(client=Client.objects.get(user=request.user))
    if state:
        return Response({"user_type": user_type, "state": "Success", "message": message, "token": token},
                        status=HTTP_200_OK)
    else:
        return Response({"user_type": user_type, "state": "Error", "message": message, "token": token},
                        status=HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def add_restaurant_to_favorites(request):
    """
    """
    token, username, user_type = who_am_i(request)

    if user_type != "client":
        state, message = "Error", "Não tens permissões para efetuar esta operação!"
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_403_FORBIDDEN)

    if "rest_id" not in request.data:
        return Response({"state": "Error", "message": "Missing parameters"}, status=HTTP_400_BAD_REQUEST)

    state, message = queries.add_restaurant_to_favorites(Client.objects.get(user=request.user), request.data["rest_id"])
    if state:
        return Response({"user_type": user_type, "state": "Success", "message": message, "token": token},
                        status=HTTP_200_OK)
    else:
        return Response({"user_type": user_type, "state": "Error", "message": message, "token": token},
                        status=HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["DELETE"])
def remove_restaurant_from_favorites(request):
    """
    """
    token, username, user_type = who_am_i(request)

    if user_type != "client":
        state, message = "Error", "Não tens permissões para efetuar esta operação!"
        return Response({"user_type": user_type, "state": state, "message": message, 'token': token},
                        status=HTTP_403_FORBIDDEN)

    if "rest_id" not in request.data:
        return Response({"state": "Error", "message": "Missing parameters"}, status=HTTP_400_BAD_REQUEST)

    state, message = queries.remove_restaurant_from_favorites(Client.objects.get(user=request.user),
                                                              request.data["rest_id"])
    if state:
        return Response({"user_type": user_type, "state": "Success", "message": message, "token": token},
                        status=HTTP_200_OK)
    else:
        return Response({"user_type": user_type, "state": "Error", "message": message, "token": token},
                        status=HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["GET"])
@permission_classes((AllowAny,))
def reload_database(request):
    state = queries.reload_database()

    state, status, message = ("Success", HTTP_200_OK, "DB reloaded with success!") if state else (
        "Error", HTTP_400_BAD_REQUEST, "Error while reloading DB!")

    return Response({"state": state, "message": message}, status=status)
