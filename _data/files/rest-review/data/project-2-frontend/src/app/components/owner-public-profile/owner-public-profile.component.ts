import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OwnerService} from '../../services/owner.service';
import {HttpResponse} from '@angular/common/http';
import {Restaurant} from '../../classes/restaurant';
import {ClientService} from '../../services/client.service';

class OwnerProfile {
  email: string;
  password: string;
  repeat_password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  photo: string;
  rests: Restaurant[];
}

@Component({
  selector: 'app-owner-public-profile',
  templateUrl: './owner-public-profile.component.html',
  styleUrls: ['./owner-public-profile.component.css']
})
export class OwnerPublicProfileComponent implements OnInit {

  owner: OwnerProfile;
  email: string;

  constructor(private route: ActivatedRoute, private ownerService: OwnerService, private router: Router, private clientService: ClientService) {
  }

  ngOnInit() {
    this.email = this.route.snapshot.paramMap.get('email');
    this.getPublicProfile();
  }

  getPublicProfile() {
    this.ownerService.getPublicProfileOwner(this.email)
      .subscribe(
        rest => {
          this.owner = rest.message;
          if (rest.token !== 'null') {
            localStorage.setItem('token', rest.token);
          }
        }, (error: HttpResponse<any>) => {
          if (error.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('user_type');
            this.router.navigateByUrl('login');
          }

        });
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
