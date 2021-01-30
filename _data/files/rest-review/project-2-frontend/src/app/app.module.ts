import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Interceptor} from './interceptor';
import {ClientFavoritesComponent} from './components/client-favorites/client-favorites.component';
import {RestaurantDetailsComponent} from './components/restaurant-details/restaurant-details.component';
import {ListRestaurantsComponent} from './components/list-restaurants/list-restaurants.component';
import {BaseRegisterComponent} from './components/base-register/base-register.component';
import {AddClientComponent} from './components/add-client/add-client.component';
import {AddOwnerComponent} from './components/add-owner/add-owner.component';
import {ClientProfileComponent} from './components/client-profile/client-profile.component';
import {OwnerProfileComponent} from './components/owner-profile/owner-profile.component';
import {AddRestaurantComponent} from './components/add-restaurant/add-restaurant.component';
import {OwnerRestaurantsComponent} from './components/owner-restaurants/owner-restaurants.component';
import {EditRestaurantComponent} from './components/edit-restaurant/edit-restaurant.component';
import {OwnerPublicProfileComponent} from './components/owner-public-profile/owner-public-profile.component';
import {CustomFormsModule} from 'ng2-validation';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ClientFavoritesComponent,
    RestaurantDetailsComponent,
    ListRestaurantsComponent,
    BaseRegisterComponent,
    AddClientComponent,
    AddOwnerComponent,
    ClientProfileComponent,
    OwnerProfileComponent,
    AddRestaurantComponent,
    OwnerRestaurantsComponent,
    EditRestaurantComponent,
    OwnerPublicProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor() {
  }
}
