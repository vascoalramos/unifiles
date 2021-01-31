import {Component, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {Restaurant} from '../../classes/restaurant';
import {ClientService} from '../../services/client.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-client-favorites',
  templateUrl: './client-favorites.component.html',
  styleUrls: ['./client-favorites.component.css']
})
export class ClientFavoritesComponent implements OnInit {

  rests: Restaurant[];

  constructor(private clientService: ClientService, private router: Router) {
  }

  ngOnInit() {
    this.getFavorites();
  }

  getFavorites(): void {
    this.clientService.getFavorites()
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
        });
  }

  removeFromFavorites(rest: Restaurant, elem: Event): void {
    const id: string = (elem.target as Element).id;
    this.clientService.removeFromFavorites(rest.id).subscribe((message) => {
      if (message.token !== 'null') {
        localStorage.setItem('token', message.token);
      }
      this.ngOnInit();
    }, (resp: HttpResponse<any>) => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.router.navigateByUrl('login');
    });
  }

}
