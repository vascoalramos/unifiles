import {Component, OnInit} from '@angular/core';
import {RestaurantService} from '../../services/restaurant.service';
import {ClientService} from '../../services/client.service';
import {Router} from '@angular/router';
import {Restaurant} from '../../classes/restaurant';
import {HttpResponse} from '@angular/common/http';

export class SearchQuery {
  name: string;
  city: string;
  sort_by: number;
}

@Component({
  selector: 'app-list-restaurants',
  templateUrl: './list-restaurants.component.html',
  styleUrls: ['./list-restaurants.component.css']
})
export class ListRestaurantsComponent implements OnInit {

  // form: FormGroup;
  search_query: SearchQuery;

  rests: Restaurant[];

  constructor(private restaurantService: RestaurantService, private clientService: ClientService, private router: Router) {
    this.search_query = new SearchQuery();
    this.search_query.sort_by = 0;
    this.rests = [];
  }

  ngOnInit() {
    if (localStorage.hasOwnProperty('search_query_name')) {
      this.search_query.name = localStorage.getItem('search_query_name');
    }
    localStorage.removeItem('search_query_name');
    if (localStorage.hasOwnProperty('search_query_city')) {
      this.search_query.city = localStorage.getItem('search_query_city');
    }
    localStorage.removeItem('search_query_city');
    console.log(this.search_query);
    this.getRestaurants();
  }

  submit() {
    console.log(this.search_query);
    this.getRestaurants();
  }

  getRestaurants(): void {
    this.restaurantService.getRestaurantsbyData(this.search_query.name, this.search_query.city, this.search_query.sort_by)
      .subscribe(
        rests => {
          this.rests = rests.message;
          if (rests.token !== 'null') {
            localStorage.setItem('token', rests.token);
          }
        }, (error: HttpResponse<any>) => {
          alert('ERROR ' + error.status + ': returning to login');
          localStorage.removeItem('token');
          this.router.navigateByUrl('login');
        }
      );
  }

  addToFavorites(rest: Restaurant, elem: Event): void {
    const id: string = (elem.target as Element).id;
    this.clientService.addToFavorites(rest.id).subscribe((message) => {
      rest.is_favorite = true;
      if (message.token !== 'null') {
        localStorage.setItem('token', message.token);
      }
    }, (resp: HttpResponse<any>) => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.router.navigateByUrl('login');
    });
  }

  removeFromFavorites(rest: Restaurant, elem: Event): void {
    const id: string = (elem.target as Element).id;
    this.clientService.removeFromFavorites(rest.id).subscribe((message) => {
      rest.is_favorite = false;
      if (message.token !== 'null') {
        localStorage.setItem('token', message.token);
      }
    }, (resp: HttpResponse<any>) => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.router.navigateByUrl('login');
    });
  }

}
