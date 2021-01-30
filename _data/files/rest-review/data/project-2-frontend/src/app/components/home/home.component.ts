import {Component, OnInit} from '@angular/core';
import {Restaurant} from '../../classes/restaurant';
import {RestaurantService} from '../../services/restaurant.service';
import {Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import {ClientService} from '../../services/client.service';

export class SearchQuery {
  name: string;
  city: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  rests: Restaurant[];
  search_query: SearchQuery;

  constructor(private restaurantService: RestaurantService, private clientService: ClientService, private router: Router) {
    this.search_query = new SearchQuery();
  }

  ngOnInit() {
    this.getTop2Rests();
  }

  getTop2Rests(): void {
    this.restaurantService.getTop2Restaurants()
      .subscribe(
        rests => {
          this.rests = rests.message;
          if (rests.token !== 'null') {
            localStorage.setItem('token', rests.token);
          }
        }, (error: HttpResponse<any>) => {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
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

  search(): void {
    if (this.search_query.name != undefined) {
      localStorage.setItem('search_query_name', this.search_query.name);
    }
    if (this.search_query.city != undefined) {
      localStorage.setItem('search_query_city', this.search_query.city);
    }
    this.router.navigate(['list-restaurants']);
  }

}
