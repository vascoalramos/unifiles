import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
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


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'my-favorites', component: ClientFavoritesComponent},
  {path: 'list-restaurants', component: ListRestaurantsComponent},
  {path: 'restaurant/:num', component: RestaurantDetailsComponent},
  {path: 'register', component: BaseRegisterComponent},
  {path: 'register-client', component: AddClientComponent},
  {path: 'register-owner', component: AddOwnerComponent},
  {path: 'client', component: ClientProfileComponent},
  {path: 'owner', component: OwnerProfileComponent},
  {path: 'new-restaurant', component: AddRestaurantComponent},
  {path: 'my-restaurants', component: OwnerRestaurantsComponent},
  {path: 'edit-restaurant/:num', component: EditRestaurantComponent},
  {path: 'owner/:email', component: OwnerPublicProfileComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
