from django.contrib.auth.models import Group
from django.db import Error, transaction

from api.serializers import *
from api.variables import  *


def add_client(data):
    """
    Function that adds a new client to the db.
    :param data: The information about the new client that is going to be registered.
    :return: False, and the respective error message if it happened some error. True, and the respective success message
    """
    email = data.get("email")
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    password = data.get("password")

    # treat nullable fields
    phone_number = data.get("phone_number") if "phone_number" in data else None
    photo = data.get("photo") if "photo" in data else DEFAULT_USER_IMAGE

    if User.objects.filter(username=email).exists():
        error_message = "Já existe um utilizador com esse email! O cliente não foi adicionado à base de dados!"
        return False, error_message, email

    try:
        # create a user
        user = User.objects.create_user(username=email, email=email, first_name=first_name, last_name=last_name,
                                        password=password)

    except Error:
        error_message = "Erro ao criar novo utilizador!"
        return False, error_message, email
    try:
        # link the user to a client
        Client.objects.create(user=user, phone_number=phone_number, photo=photo)

    except Exception as e:
        user.delete()
        error_message = "Erro ao criar novo cliente!"
        return False, error_message, email

    # check if the client group exists, else create it
    # finally add client to group
    try:
        if not Group.objects.filter(name="clients_group").exists():
            Group.objects.create(name="clients_group")

        clients_group = Group.objects.get(name="clients_group")
        clients_group.user_set.add(user)

    except Exception:
        user.delete()
        error_message = "Erro a criar o client!"
        return False, error_message, email

    state_message = "O cliente foi criado com sucesso!"
    return True, state_message, email


def update_client(request, email):
    """
    Function that updates the info of a given client from the database.
    :param request:
    :param email:
    :return:
    """
    transaction.set_autocommit(False)

    data, state, message = request.data, None, None

    user = User.objects.filter(username=email)
    if not user.exists():
        state, message = False, "Utilizador não existe!"
        return state, message

    client = Client.objects.filter(user=user[0])
    if not client.exists():
        state, message = False, "O utilizador não é um cliente!"
        return state, message

    try:
        if "email" in data:
            email = data.get("email")
            user.update(email=email)
            user.update(username=email)

        if "first_name" in data:
            first_name = data.get("first_name")
            user.update(first_name=first_name)

        if "last_name" in data:
            last_name = data.get("last_name")
            user.update(last_name=last_name)

        if "password" in data:
            user = User.objects.get(username=email)
            user.set_password(data.get("password"))
            user.save()

        if "phone_number" in data:
            phone_number = data.get("phone_number")
            client.update(phone_number=phone_number)

        if "photo" in data:
            photo = data.get("photo")
            client.update(photo=photo)

        if state is None:
            state = True
            message = "Cliente atualizado com sucesso!"
            transaction.commit()

        if not state:
            transaction.rollback()

    except Error as e:
        state, message = False, "Erro durante a atualização do cliente!"
        transaction.rollback()

    transaction.set_autocommit(True)
    return state, message


def get_client(email):
    """
    """
    state, message = None, None

    user = User.objects.filter(username=email)
    if not user.exists():
        state, message = False, "Utilizador não existe!"
        return state, message

    client = Client.objects.filter(user=user[0])
    if not client.exists():
        state, message = False, "O utilizador não é um cliente!"
        return state, message

    state, message = True, ClientSerializer(Client.objects.get(user=user[0])).data
    return state, message


def get_all_clients():
    return True, [AllClientsSerializer(c).data for c in Client.objects.all()]


def delete_user(user):
    """
    Function that delete a user from the db.
    :param user: The user that is going to be deleted.
    :return: False, and the respective error message if it happened some error. True, and the respective success message
    """
    try:
        user.delete()
        state, message = True, "Utilizador eliminado com sucesso!"
    except Error:
        state, message = False, "Erro a eliminar o utilizador!"

    finally:
        return state, message


def add_owner(data):
    """
    Function that adds a new owner to the db.
    :param data: The information about the new owner that is going to be registered.
    :return: False, and the respective error message if it happened some error. True, and the respective success message
    """
    email = data.get("email")
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    password = data.get("password")

    # treat nullable fields
    phone_number = data.get("phone_number") if "phone_number" in data else None
    photo = data.get("photo") if "photo" in data else DEFAULT_USER_IMAGE

    if User.objects.filter(username=email).exists():
        error_message = "Já existe um utilizador com esse email! O owner não foi adicionado à base de dados!"
        return False, error_message, email

    try:
        # create a user
        user = User.objects.create_user(username=email, email=email, first_name=first_name, last_name=last_name,
                                        password=password)

    except Error:
        error_message = "Erro ao criar novo utilizador!"
        return False, error_message, email
    try:
        # link the user to a client
        Owner.objects.create(user=user, phone_number=phone_number, photo=photo)

    except Exception as e:
        user.delete()
        error_message = "Erro ao criar novo owner!"
        return False, error_message, email

    # check if the owner group exists, else create it
    # finally add owner to group
    try:
        if not Group.objects.filter(name="owners_group").exists():
            Group.objects.create(name="owners_group")

        clients_group = Group.objects.get(name="owners_group")
        clients_group.user_set.add(user)

    except Exception:
        user.delete()
        error_message = "Erro a criar o owner!"
        return False, error_message, email

    state_message = "O cliente foi criado com sucesso!"
    return True, state_message, email


def update_owner(request, email):
    """
    Function that updates the info of a given owner from the database.
    :param request:
    :param email:
    :return:
    """
    transaction.set_autocommit(False)

    data, state, message = request.data, None, None

    user = User.objects.filter(username=email)
    if not user.exists():
        state, message = False, "Utilizador não existe!"
        return state, message

    owner = Owner.objects.filter(user=user[0])
    if not owner.exists():
        state, message = False, "O utilizador não é um owner!"
        return state, message

    try:
        if "email" in data:
            email = data.get("email")
            user.update(email=email)
            user.update(username=email)

        if "first_name" in data:
            first_name = data.get("first_name")
            user.update(first_name=first_name)

        if "last_name" in data:
            last_name = data.get("last_name")
            user.update(last_name=last_name)

        if "password" in data:
            user = User.objects.get(username=email)
            user.set_password(data.get("password"))
            user.save()

        if "phone_number" in data:
            phone_number = data.get("phone_number")
            owner.update(phone_number=phone_number)

        if "photo" in data:
            photo = data.get("photo")
            owner.update(photo=photo)

        if state is None:
            state = True
            message = "Owner atualizado com sucesso!"
            transaction.commit()

        if not state:
            transaction.rollback()

    except Error as e:
        state, message = False, "Erro durante a atualização do owner!"
        transaction.rollback()

    transaction.set_autocommit(True)
    return state, message


def get_owner_profile(email):
    """
    """
    state, message = None, None

    user = User.objects.filter(username=email)
    if not user.exists():
        state, message = False, "Utilizador não existe!"
        return state, message

    owner = Owner.objects.filter(user=user[0])
    if not owner.exists():
        state, message = False, "O utilizador não é um cliente!"
        return state, message

    state, message = True, OwnerSerializer(owner[0]).data
    return state, message


def get_owner(email):
    """
    """
    state, message = None, None

    user = User.objects.filter(username=email)
    if not user.exists():
        state, message = False, "Utilizador não existe!"
        return state, message

    owner = Owner.objects.filter(user=user[0])
    if not owner.exists():
        state, message = False, "O utilizador não é um cliente!"
        return state, message

    owner_info = OwnerSerializer(owner[0]).data
    owner_info["rests"] = get_owner_restaurants(owner[0])[1]

    state, message = True, owner_info
    return state, message


def get_all_owners():
    return True, [AllOwnersSerializer(o).data for o in Owner.objects.all()]


def add_restaurant(data, username):
    """
    Function that adds a new owner to the db.
    :param data: The information about the new owner that is going to be registered.
    :return: False, and the respective error message if it happened some error. True, and the respective success message
    """
    name = data.get("name")
    address = data.get("address")
    city = data.get("address")
    zip_code = data.get("zip_code")
    country = data.get("country")
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    phone_number = data.get("phone_number")

    # treat nullable fields
    photo = data.get("photo") if "photo" in data else DEFAULT_RESTAURANT_IMAGE
    description = data.get("description") if "description" in data else None

    owner = Owner.objects.filter(user__username=username)

    if not owner.exists():
        return False, "Utilizador não é um owner!"

    try:
        # try to create restaurant object
        Restaurant.objects.create(owner=owner[0], name=name, description=description, address=address, city=city,
                                  zip_code=zip_code, country=country, latitude=latitude, longitude=longitude,
                                  phone_number=phone_number, photo=photo)

    except Exception as e:
        error_message = "Erro ao criar novo Restaurante!"
        return False, error_message

    state_message = "O restaurante foi criado com sucesso!"
    return True, state_message


def update_restaurant(request, rest):
    """
    Function that updates the info of a given owner from the database.
    :param request:
    :param email:
    :return:
    """
    transaction.set_autocommit(False)

    data, state, message = request.data, None, None

    try:
        if "name" in data:
            name = data.get("name")
            rest.update(name=name)

        if "description" in data:
            description = data.get("description")
            rest.update(description=description)

        if "address" in data:
            address = data.get("address")
            rest.update(address=address)

        if "name" in data:
            name = data.get("name")
            rest.update(phone_number=name)

        if "city" in data:
            city = data.get("city")
            rest.update(city=city)

        if "zip_code" in data:
            zip_code = data.get("zip_code")
            rest.update(zip_code=zip_code)

        if "country" in data:
            country = data.get("country")
            rest.update(country=country)

        if "latitude" in data:
            latitude = data.get("latitude")
            rest.update(latitude=latitude)

        if "longitude" in data:
            longitude = data.get("longitude")
            rest.update(longitude=longitude)

        if "phone_number" in data:
            phone_number = data.get("phone_number")
            rest.update(phone_number=phone_number)

        if "is_open" in data:
            is_open = data.get("is_open")
            rest.update(is_open=is_open)

        if "photo" in data:
            photo = data.get("photo")
            rest.update(photo=photo)

        if state is None:
            state = True
            message = "Restaurante atualizado com sucesso!"
            transaction.commit()

        if not state:
            transaction.rollback()

    except Error as e:
        state = False
        message = "Erro durante a atualização do restaurante!"
        transaction.rollback()

    transaction.set_autocommit(True)
    return state, message


def delete_restaurant(rest):
    """
    Function that delete a user from the db.
    :param rest: The user that is going to be deleted.
    :return: False, and the respective error message if it happened some error. True, and the respective success message
    """
    try:
        rest.delete()
        state, message = True, "Restaurante eliminado com sucesso!"
    except Error:
        state, message = False, "Erro a eliminar o restaurante!"

    finally:
        return state, message


def get_restaurant(number, user_type=None, username=None):
    """
    """
    state, message = None, None

    rest = Restaurant.objects.filter(id=number)
    if not rest.exists():
        state, message = False, f"O restaurante com o id {number} não existe!"
        return state, message

    rest_data = RestaurantSerializer(Restaurant.objects.get(id=number)).data
    if user_type == "client":
        client = Client.objects.get(user__username=username)
        rest_data["is_favorite"] = True if rest[0] in list(client.favorites.all()) else False

    state, message = True, rest_data
    return state, message


def get_all_restaurants(username=None, user_type=None, data=None):
    """
    """
    name = data["name"] if "name" in data else None
    city = data["city"] if "city" in data else None
    attr = data["attr"] if "attr" in data else None
    _order = data["order"] if "order" in data else None

    rests_source = None
    if name is None and city is None:
        rests_source = Restaurant.objects.all()
    elif name is not None and city is None:
        rests_source = Restaurant.objects.filter(name__icontains=name)
    elif city is not None and name is None:
        rests_source = Restaurant.objects.filter(city__icontains=city)
    elif name is not None and city is not None:
        rests_source = Restaurant.objects.filter(name__icontains=name, city__icontains=city)

    # just a failsafe
    if rests_source is None:
        rests_source = Restaurant.objects.all()

    if user_type == "client":
        client = Client.objects.get(user__username=username)

        rests = []
        for r in rests_source:
            data = AllRestaurantsSerializer(r).data
            data["is_favorite"] = True if r in list(client.favorites.all()) else False
            rests.append(data)
        return True, sort_restaurant(rests, attr=attr, order=_order)

    else:
        return True, sort_restaurant([AllRestaurantsSerializer(r).data for r in rests_source], attr=attr, order=_order)


def get_owner_restaurants(owner):
    """
    """
    return True, sort_restaurant([AllRestaurantsSerializer(r).data for r in Restaurant.objects.filter(owner=owner)])


def get_client_favorites(client):
    """
    """
    rests = []
    for r in client.favorites.all():
        data = AllRestaurantsSerializer(r).data
        data["is_favorite"] = True
        rests.append(data)
    return True, sort_restaurant(rests)


def sort_restaurant(lst, attr=None, order=None):
    """
    """
    if attr is None:
        attr = "avg_score"

    if order is None or order == "desc":
        return sorted(lst, key=lambda rest: (-rest[attr], -rest["avg_score"]))
    else:
        return sorted(lst, key=lambda rest: (rest[attr], -rest["avg_score"]))


def register_review(data, number, user):
    """
    """
    rest, state, message = None, None, None
    try:
        rest = Restaurant.objects.get(id=number)
    except Restaurant.DoesNotExist:
        state, message = False, f"O restaurante com o id {number} não existe!"
        return state, message

    client = Client.objects.get(user=user)
    comment = data.get("comment")
    title = data.get("title")
    score = data.get("score")
    price = data.get("price")
    clean = data.get("clean")
    quality = data.get("quality")
    speed = data.get("speed")

    if Review.objects.filter(restaurant=rest, user=client).exists():
        r = Review.objects.filter(restaurant=rest, user=client)
        r.update(comment=comment, stars=score, price=price, title=title, cleanliness=clean, quality=quality,
                 speed=speed)

    else:
        Review.objects.create(restaurant=rest, user=Client.objects.get(user=user), comment=comment,
                              stars=score, price=price, title=title, cleanliness=clean, quality=quality,
                              speed=speed)
    return True, "Review registada com sucesso!"


def add_restaurant_to_favorites(client, rest_id):
    rest = None
    try:
        rest = Restaurant.objects.get(id=rest_id)
    except Restaurant.DoesNotExist:
        state, message = False, f"O restaurante com o id {rest_id} não existe!"
        return state, message

    client.favorites.add(rest)
    return True, f"O restaurante com o id {rest_id} foi adicionado com sucesso aos favoritos do cliente!"


def remove_restaurant_from_favorites(client, rest_id):
    rest = None
    try:
        rest = Restaurant.objects.get(id=rest_id)
    except Restaurant.DoesNotExist:
        state, message = False, f"O restaurante com o id {rest_id} não existe!"
        return state, message

    client.favorites.remove(rest)
    return True, f"O restaurante com o id {rest_id} foi removido com sucesso dos favorites do cliente!"


def get_review(number, user):
    """
    """
    rest, review, state, message = None, None, None, None
    try:
        rest = Restaurant.objects.get(id=number)
    except Restaurant.DoesNotExist:
        state, message = False, f"O restaurante com o id {number} não existe!"
        return state, message

    try:
        client = Client.objects.get(user=user)
        review = Review.objects.get(restaurant=rest, user=client)
    except Review.DoesNotExist:
        state, message = False, f"A review não existe!"
        return state, message

    state, message = True, ReviewSerializer(review).data
    return state, message


def reload_database():
    """
    """
    try:
        #######################################
        #          WIPE DATABASE              #
        #######################################
        for owner in Owner.objects.all():
            owner.user.delete()

        for client in Client.objects.all():
            client.user.delete()

        #######################################
        #          CREATE CLIENTS             #
        #######################################
        u1 = User.objects.create_user(username="client1@ua.pt", email="client1@ua.pt", first_name="James",
                                      last_name="Thompson", password="client1")

        u2 = User.objects.create_user(username="client2@ua.pt", email="client2@ua.pt", first_name="Patricia",
                                      last_name="Clark", password="client2")

        u3 = User.objects.create_user(username="client3@ua.pt", email="client3@ua.pt", first_name="Paul",
                                      last_name="Turner", password="client3")

        c1 = Client.objects.create(user=u1, phone_number="913426890", photo=CLIENT_1)

        c2 = Client.objects.create(user=u2, phone_number="925385124", photo=CLIENT_2)

        c3 = Client.objects.create(user=u3, phone_number="963057208", photo=CLIENT_3)

        if not Group.objects.filter(name="clients_group").exists():
            Group.objects.create(name="clients_group")

        clients_group = Group.objects.get(name="clients_group")
        clients_group.user_set.add(u1)
        clients_group.user_set.add(u2)
        clients_group.user_set.add(u3)

        #######################################
        #          CREATE OWNERS              #
        #######################################
        u4 = User.objects.create_user(username="owner1@ua.pt", email="owner1@ua.pt", first_name="John",
                                      last_name="Smith", password="owner1")

        u5 = User.objects.create_user(username="owner2@ua.pt", email="owner2@ua.pt", first_name="Mary",
                                      last_name="Lewis", password="owner2")

        u6 = User.objects.create_user(username="owner3@ua.pt", email="owner3@ua.pt", first_name="Helen",
                                      last_name="Martinez", password="owner3")

        o1 = Owner.objects.create(user=u4, phone_number="928470213", photo=OWNER_1)

        o2 = Owner.objects.create(user=u5, phone_number="910023459", photo=OWNER_2)

        o3 = Owner.objects.create(user=u6, phone_number="931734580", photo=OWNER_3)

        if not Group.objects.filter(name="owners_group").exists():
            Group.objects.create(name="owners_group")

        owners_group = Group.objects.get(name="owners_group")
        owners_group.user_set.add(u4)
        owners_group.user_set.add(u5)
        owners_group.user_set.add(u6)

        #######################################
        #          CREATE RESTAURANTS         #
        #######################################
        r1 = Restaurant.objects.create(name="Emerald Chinese Restaurant", address="30 Eglinton Avenue W",
                                       description="Emerald Chinese Cuisine is one of San Diego's premiere dim sum and Cantonese style restaurant. It presents traditional Chiese flavors in an elegant, contemporary setting in the Convoy Street district of San Diego.  A lavish and jewel-toned dining space draws inspiration from elements of traditional Chinese architecture and contemporary designs that are stunning and eclectic. The elegant surroundings pair perfectly with emerald menu - featuring delicacies like all day al a cart dim sum, Cantonese style Chilean seabass and one of the most popular emerald dishes, table-side carved Peking duck.",
                                       city="Mississauga", zip_code="L5R 3E7", country="Canada", latitude=43.6054989743,
                                       longitude=-79.652288909, is_open=True, phone_number=2142436323, photo=REST_1,
                                       owner=o1)

        r2 = Restaurant.objects.create(name="Musashi Japanese Restaurant", address="10110 Johnston Rd, Ste 15",
                                       description="Established in 1996.  Musashi Japanese Restaurant and Sushi Bar has a long history of providing the Palm Desert and the Valley with the highest quality Japanese cuisine prepared skillfully.",
                                       city="Charlotte", zip_code="28210", country="United States", latitude=35.092564,
                                       longitude=-80.859132, is_open=False, phone_number=4324798765, photo=REST_2,
                                       owner=o2)

        r3 = Restaurant.objects.create(name="Marco's Pizza", address="5981 Andrews Rd",
                                       description="Marco's Pizza, operated by Marco's Franchising, LLC, is an American restaurant chain and interstate franchise based in Toledo, Ohio, that specializes in Italian-American cuisine.",
                                       city="Mentor-on-the-Lake", zip_code="44060", country="United States",
                                       latitude=41.70852,
                                       longitude=-81.359556, is_open=True, phone_number=4324798765, photo=REST_3,
                                       owner=o3)

        r4 = Restaurant.objects.create(name="Carluccio's Tivoli Gardens", address="1775 E Tropicana Ave",
                                       description="Carluccio's Tivoli Gardens is an Italian restaurant in Las Vegas Nevada. The restaurant was designed by non-other than Liberace who owned the restaurant as Liberace's Tivoli Gardens.",
                                       city="Las Vegas", zip_code="44060", country="United States", latitude=36.1000163,
                                       longitude=-115.1285285, is_open=False, phone_number="(702) 795-3236",
                                       photo=REST_4,
                                       owner=o3)

        r5 = Restaurant.objects.create(name="Ipanema Restaurant", address="43 W 46th St",
                                       description="Ipanema is a Brazilian/Portuguese restaurant on Little Brazil street in Midtown West. We feature authentic, homestyle dishes and a variety of cocktails, including our infamous Caipirinha. Guests are welcome for a quick bite or speciality cocktail at the bar, or for a long pleasant dining experience in our relaxed yet unique atmosphere. Some more things we specialize in: Steak, Fish, Seafood, Caipirinhas, Crochets, Paelha, Lobster, Shrimp, Fried Bananas, Black bean soup Mais coisas que se especializam em: Feijoada, Churrasco Gaucho, Costeleta de Porco a Portuguesa, Farofa, Couve, Sopa de Feijão, Banana Frita , Bolhão de Pato, Camarão no Côco, Ipanema Restaurant Serving Little Brazil Street Since 1979",
                                       city="New York", zip_code="NY 10036", country="United States",
                                       latitude=40.757004,
                                       longitude=-73.980624, is_open=True, phone_number="+1-646-791-7171", photo=REST_5,
                                       owner=o2)

        r6 = Restaurant.objects.create(name="Burger & Lobster", address="39 W 19th St",
                                       description="We focus our energy on making two products the absolute best they can be without any other distractions. We’re obsessed with refining our techniques to specialise in the simplicity of our mono-product offering in the most fascinating locations in the world. We craft prime burgers and serve wild, fresh Atlantic lobsters.",
                                       city="New York", zip_code="NY 10011", country="United States",
                                       latitude=40.740367,
                                       longitude=-73.993430, is_open=True, phone_number="+1-646-791-7171", photo=REST_6,
                                       owner=o1)

        r7 = Restaurant.objects.create(name="Paesano of Mulberry Street", address="136 Mulberry St",
                                       description="Nestled in the heart of Little Italy, Paesano's epitomizes Italian culture and charm. Try our Osso Buco veal - shank cooked in its own juices served over rice. In the mood for seafood? Try our Seafood Cartoccio lobster, shrimp, clams, mussels, red snapper, calamari, steamed in white wine served with a side of linguini and clam sauce. Today, the recipes brought from old-world Italy are still cherished and prepared with love at Paesano's of Mulberry Street. For authentic Italian cooking and warm hospitality that is customary in Italian tradition, Paesano's is your Little Italy dinning destination.",
                                       city="New York", zip_code="NY 10013", country="United States",
                                       latitude=40.718783,
                                       longitude=-73.997164, is_open=True, phone_number="+1-212-965-1188", photo=REST_7,
                                       owner=o3)

        #######################################
        #            CREATE REVIEWS           #
        #######################################
        Review.objects.create(restaurant=r7, user=c1, title="Precious food!",
                              comment="So this gem, I spontaneously tried while cruising through Little Italy.\nLuckily I was not disappointed. The hospitality and service was great from start to finish.\nMy sister arrived early and they gave her a glass of red wine on the house.\nEveryone at the table was extremely satisfied with the entres. I had the Carbonara, my sister the Eggplant Parmesan, and our third guest the Spaghetti Bolognese.\nSpeaking from the perspective of an individual who went on a pasta marathon in Italy, the pasta at Paesano's tasted identical to what I had across different Italian cities.\nThe pasta was perfectly cooked and fused perfectly with the sauce, meat etc.\nI highly recommend Paesano's. You taste the passion and authentic flavors in their food.",
                              stars=7.8, price=2, cleanliness=3, quality=2, speed=1)

        Review.objects.create(restaurant=r7, user=c3, title="Kind of disappointed!",
                              comment="We were excited to try this restaurant, we just found it on yelp randomly (we were visiting from out of town). We were sat promptly, and given bread and drinks right Away. We did like the interior, it was inviting and comfy. We loved the bread and oil, that was the tastiest thing we ate for sure.\nWe ordered the Rigitoni and fettuccini in the vodka sauce. We were so excited to try it but unfortunately is was pretty bland. We were expecting much more flavor.\nFor the price I think we could have gotten something much better elsewhere. Didn't try anything else, but don't think we would return.",
                              stars=5.3, price=3, cleanliness=2, quality=2, speed=2)

        Review.objects.create(restaurant=r6, user=c2, title="Great time, great food!",
                              comment="Been there for the first time and I liked it, the food is good as a burger love I can tell when one is good and one isnt and I can say this was amazing... The lobsters were normal they kinda taste all same to me\nThe service is good and people is pretty nice, a really lovely place.\nI'll be coming more often with no doubt.",
                              stars=9.8, price=2, cleanliness=3, quality=3, speed=3)

        Review.objects.create(restaurant=r6, user=c1, title="Amazing experience",
                              comment="Been here three times and loved it each time. It's also by my office so it's super convenient to swing by.\nRestaurant is huge with tons of seating which is great if you ever want to host a dinner with friends here.\nI ordered calamari and a combo - which offers both burger and lobster (highly recommend). Only $35 to get both and very deliciously juicy. It's also very filling so had to bring it back home and ate it for my next meal haha\n10/10 would def recommend",
                              stars=10, price=2, cleanliness=3, quality=3, speed=3)

        Review.objects.create(restaurant=r6, user=c3, title="Good food...",
                              comment="I ordered Lobster bisque and Combo for 1.  It was too much food for one person.\nBisque is Ok, but I have had better.\nLobster is very good.\nBurger is OK. Burgers all taste the same for me. Probably shouldnt have ordered the combo.  Lobster alone would have been sufficient.\nService is very good.",
                              stars=7.5, price=2, cleanliness=3, quality=3, speed=3)

        Review.objects.create(restaurant=r5, user=c3, title="Kind of good!",
                              comment="If you are looking for a great Brazilian restaurant, head over to Ipanema. You will not be disappointed in any way. The food is incredible! We started with mixed salgadinhos (empanadas), which were delicious. We ordered The Picanha steak and the Vatapá ( shrimp in coconut  milk and palm oil), which was my absolute favorite.\nWhile the food was incredible, the service was beyond belief. My husband is from Rio, but our guests had never tried Brazilian food. Our waiter, Cadu, was amazing! So attentive, patient and informative, he really made our night.\nThanks to the entire staff for an incredible evening. We felt like family.",
                              stars=6, price=2, cleanliness=2, quality=2, speed=2)

        Review.objects.create(restaurant=r4, user=c2, title="Nothing special",
                              comment="We asked our hotel concierge for a restaurant recommendation.  She said there's a place off the strip where you can get excellent cheap Italian food.  She said, 'I'm Italian' and I love it and all my out of town guests always ask to go there.  So we said what the heck, beats paying a fortune for a mediocre meal at one of the big fancy hotel restaurants.  \nThe first note about Carluccio's is it is right next door to the Liberace Museum.  Las Vegas is such a bizarre place.  Any way, the interior is a flash back to to the 80's and still kind of charming in that bizarre Las Vegas sort of way.  It was also dark inside, which was a good thing, because they would get negative stars for the cleanliness factor.  Our bread basket and the inside of my menu had globs of marinara sauce on them.  Tasty....um, no....disgusting.\nThe bread was outstanding.  It was just bread, with no fancy dipping oil or vinegar. Just good solid bread with butter.  Side salad...blech.  Bottle of Pinot Grigio...yummy (friend pointed out it could be bought at Costco for half the price we paid).  Mushroom appetizer...good in concept...mushrooms in white wine sauce topped with cheese and baked.  Not so good in execution as the wine sauce was tangy and harsh.  Chicken parmigiana entree, pretty tasty.  It was served with a side of pasta with meat sauce containing very little meat to speak of.  I tried my friend;s gnocchi and it was doughy tasting (not in a good way)!  We skipped dessert.\nService was poor, but what do you expect when  you can get a bottle of wine, 3 entrees, 3 side salads and an appetizer for less than $80 (the wine was half the bill at $40).  \nThis place would be great for a group of people who want decent food for cheap.  Plus Liberace is next door.  That's a big draw right there!  Or not...",
                              stars=4, price=3, cleanliness=2, quality=2, speed=1)

        Review.objects.create(restaurant=r3, user=c1, title="Just food...",
                              comment="I have been wanting to try Marco's Pizza for a while.\nThey have an online deal for medium one-topping pizzas for $5.99/ea so I ordered one in pepperoni and one in pineapple both original crust and both with garlic sauce on the crust.  I also tried chicken wings and cinnasqaures.\nOut of the different food I tried there the wings were my favorite.  Great taste and great wing portion.  The pizzas were decent, but really nothing tasted different from pizza chains.  I was a little disappointed at that.  Even with the garlic sauce on the crust, I couldn't taste it at all.  Also, original crust is too bready.  Next time I'll opt for lite or thin crust and a different crust sauce as well.  I highly do not suggest getting the cinnasquares.  The bread part of it was okay, but the artificial icing is a no-go.  \nService was great and the restaurant itself wasn't bad.  They do serve beer and have a TV which is great for games.  Overall, I'd come back here again for pizza.",
                              stars=6.5, price=2, cleanliness=2, quality=2, speed=1)

        Review.objects.create(restaurant=r2, user=c2, title="Great time, great food!",
                              comment="If you're looking for authentic Japanese food, look no further.\nIt's a small space, so expect to wait on weekends. They do not rush you, and things are prepared fresh so it will take some time to dine.\nThe bento box is my go to, as it has a little bit of everything and you can't beat the price! Delicious food, kind people, and a relaxed atmosphere.",
                              stars=9, price=2, cleanliness=2, quality=2, speed=3)

        Review.objects.create(restaurant=r1, user=c3, title="Pretty good..",
                              comment="Pretty good place to go with family for dim sum.\nThis is one of those restaurants where they walk around with carts of food and you point at what you want, they give it to you and stamp your card.\nWe came here just for some lunch with four people on Victoria day. Got seated quickly, but the restaurant was pretty packed.\nSome of the woman serving food didn't know much English and if you pointed by accident while talking to your table, they thought you wanted it and proceeded to try to place it on your table. Weird...\nThe most disappointing thing was that we wanted the most popular dim sum (shumai) but they didn't have any in the two hours we were there! They had other things except for shumai and when you asked for it, they tried to give you a mushroom dim sum instead...",
                              stars=6, price=2, cleanliness=2, quality=2, speed=2)

        #######################################
        #          CREATE FAVORITES           #
        #######################################
        c1.favorites.add(r7)
        c1.favorites.add(r4)
        c1.favorites.add(r6)
        c2.favorites.add(r2)
        c2.favorites.add(r4)
        c3.favorites.add(r1)

        return True

    except Exception as e:
        print(e)
        return False
