import {Component} from '@angular/core';
import {AccessControlService} from './services/access-control.service';
import {Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import {ClientService} from './services/client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RestReview';

  constructor(private accessControlService: AccessControlService, private  clientService: ClientService, private router: Router) {
  }

  logout(): void {
    this.accessControlService.logout().subscribe(() => {
      localStorage.removeItem('token');
      this.router.navigateByUrl('');
    }, (resp: HttpResponse<any>) => {
      localStorage.removeItem('token');
      this.router.navigateByUrl('');
    });
  }

  noToken(): boolean {
    return !(localStorage.hasOwnProperty('token') && localStorage.getItem('token') !== 'null');
  }

  getUserType(): string {
    return localStorage.getItem('user_type');
  }

  getUsername(): string {
    return localStorage.getItem('username');
  }
}
