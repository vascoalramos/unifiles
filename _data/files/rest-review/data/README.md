# RestReview (Client + Rest API)
**Rest Review**: A platform that enables users to search and review restaurants.

* The REST API is available at **https://jmarques.pythonanywhere.com/**. 
* The Angular Interface is available at **https://rest-review.herokuapp.com**.

## Implemented Features

### API's Project
* **Django Models**: We used django models to create and model entities into a database. Regarding entity relations, we implemented N:M, N:1 and 1:1 relations;
* **Django Authentication**: The mechanisms provided by Django Authentication were widely used to allow different users to log in into your web application;
* **Django Authorization**: We decided to restrict some areas of our service to specific groups of users. This being said, we use Django Authorization mechanisms to make sure that only the allowed users could perform certain operations. For instance, a regular user can see restaurants and even submit reviews, but cannot create a new restaurant or edit the information of an existent restaurant. Such operation can only be done by the restaurant's owner.

### Angular Project
* **Components**: We used components for every view and all the logic associated with it;
* **Data Binding**: Mostly for showing persistent data, we used data binding;
* **Directives**: Directives were used for providing additional behavior for DOM elements;
* **Service**: Every data fetched from the server was called from a service;
* **Dependency Injection**: Injection of the service into the components;
* **Routing**: All the navigation in the platform is made with routing;
* **Bootstrap**: Bootstrap is used as a style tool for the interface;
* **Observables**: For dealing with asynchronous programming, we used observables;

## How to Run
1. Delete the database, if it's already created;
2. Build the database;
3. Create a superuser;
4. Run both project;
5. Once the project is running, access to `/reload_database` in the rest api to populate te database with some default data.

## Accesses

### Client

| Username  | Password |
| ------------- | ------------- |
| client1@ua.pt  | client1  |
| client2@ua.pt  | client2  |
| client3@ua.pt  | client3  |

### Owner

| Username  | Password |
| ------------- | ------------- |
| owner1@ua.pt  | owner1  |
| owner2@ua.pt  | owner2  |
| owner3@ua.pt  | owner3  |

## Features

**/reload_database** : Clean and put the database default data

**/register**: Page with registration options as owner or client

**/register-client**: Register a client account

**/register-owner**: Register an owner account

**/login** : Sign in to platform

**/**: Provides the home page with the top 2 restaurants and search feature

**/list-restaurants**: Listing of all restaurants with the ability to search for specific restaurants, restaurants in a city, or order the results by some characteristics

**/owner/{name}**: Access the public profile of some given owner

**/restaurant/{number}**: See all the information of a given restaurant (info, reviews, location, owner, etc)

#### All the following features require a previous login:

**/new-restaurant**: Create a new restaurant (only owners can do this)

**/client**: Access client own profile

**/owner**: Access client own owner

**/my-restaurants**: Access all the restaurants a loged owner has (only owners can do this)

**/edit-restaurant/{number}**: Edit information of a given restaurant (only the owner of that restaurant can do this)

**my-favorites**: Access the user favorites' restaurants (only a client can do this and each client can only access his own favorites list)

### Features not in URL

* A client can add some restaurant to his favorites in `list-restaurants` and `home`.
* From the detail page of restaurant it's possible to access the reviews and the owner profile.
* The location of each restaurant in the detail page is done using google maps api.
* In each edit feature (restaurant, client and owner) it's also possible to eliminate the object (restaurant, object, owner). This action will also remove all related entries in other tables of the database.

## Authors
* **Vasco Ramos:** [vascoalramos](https://github.com/vascoalramos)
* **João Marques:** [joao-p-marques](https://github.com/joao-p-marques)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
