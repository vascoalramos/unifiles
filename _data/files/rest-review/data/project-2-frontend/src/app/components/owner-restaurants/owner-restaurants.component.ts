import {Component, OnInit} from '@angular/core';
import {Restaurant} from '../../classes/restaurant';
import {Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import {OwnerService} from '../../services/owner.service';

@Component({
  selector: 'app-owner-restaurants',
  templateUrl: './owner-restaurants.component.html',
  styleUrls: ['./owner-restaurants.component.css']
})
export class OwnerRestaurantsComponent implements OnInit {

  rests: Restaurant[];

  constructor(private ownerService: OwnerService, private router: Router) {
  }

  ngOnInit() {
    this.getOwnerRestaurants();
  }

  getOwnerRestaurants(): void {
    this.ownerService.getMyRestaurants()
      .subscribe(
        rests => {
          this.rests = rests.message;
          localStorage.setItem('token', rests.token);
        }, (error: HttpResponse<any>) => {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          this.router.navigateByUrl('login');
        });
  }

}
