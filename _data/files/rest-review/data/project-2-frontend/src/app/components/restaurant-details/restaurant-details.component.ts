import {Component, Input, OnInit} from '@angular/core';
import {RestaurantService} from '../../services/restaurant.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import {ClientService} from '../../services/client.service';
import {RestaurantDetails} from '../../classes/restaurant-details';

export class ReviewToSubmit {
  title: string;
  comment: string;
  stars: number;
  price: number;
  quality: number;
  cleanliness: number;
  speed: number;
}

@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.css']
})
export class RestaurantDetailsComponent implements OnInit {

  @Input() rest: RestaurantDetails;
  review: ReviewToSubmit;

  constructor(
    private restaurantService: RestaurantService,
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService
  ) {
  }


  ngOnInit() {
    this.review = new ReviewToSubmit();
    this.getRestaurant();
    if (!this.noToken()) {
      this.review.price = 2;
      this.review.quality = 2;
      this.review.cleanliness = 2;
      this.review.speed = 2;
      this.getReview();
    }
  }

  getRestaurant(): void {
    const num = +this.route.snapshot.paramMap.get('num');
    this.restaurantService.getRestaurant(num)
      .subscribe(
        rest => {
          this.rest = rest.message;
          if (rest.token !== 'null') {
            localStorage.setItem('token', rest.token);
          }
        }, (error: HttpResponse<any>) => {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          this.router.navigateByUrl('login');
        });
  }

  addToFavorites(rest: RestaurantDetails, elem: Event): void {
    const id: string = (elem.target as Element).id;
    this.clientService.addToFavorites(rest.id).subscribe((message) => {
      rest.is_favorite = true;
      if (message.token !== 'null') {
        localStorage.setItem('token', message.token);
      }
    }, (resp: HttpResponse<any>) => {
      localStorage.removeItem('token');
      this.router.navigateByUrl('login');
    });
  }

  removeFromFavorites(rest: RestaurantDetails, elem: Event): void {
    const id: string = (elem.target as Element).id;
    this.clientService.removeFromFavorites(rest.id).subscribe((message) => {
      rest.is_favorite = false;
      if (message.token !== 'null') {
        localStorage.setItem('token', message.token);
      }
    }, (resp: HttpResponse<any>) => {
      localStorage.removeItem('token');
      this.router.navigateByUrl('login');
    });
  }

  noToken(): boolean {
    return !(localStorage.hasOwnProperty('token') && localStorage.getItem('token') !== 'null');
  }

  getUserType(): string {
    return localStorage.getItem('user_type');
  }

  submitReview(): void {
    this.clientService.registerReview(this.rest.id, this.review.title, this.review.comment, this.review.stars, this.review.price, this.review.cleanliness, this.review.quality, this.review.speed)
      .subscribe(
        data => {
          if (data) {
            localStorage.setItem('token', data.token);
            document.getElementById('close_btn').click();
            this.ngOnInit();
          }
        },
        error => {
          if (error.status === '401') {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            this.router.navigateByUrl('login');
          }
        });
  }

  getReview(): void {
    const num = +this.route.snapshot.paramMap.get('num');
    this.clientService.getReview(num)
      .subscribe(
        review => {
          this.review = review.message;
          if (review.token !== 'null') {
            localStorage.setItem('token', review.token);
          }
        }, (error: HttpResponse<any>) => {
          if (error.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            this.router.navigateByUrl('login');
          }
        });
  }

}
