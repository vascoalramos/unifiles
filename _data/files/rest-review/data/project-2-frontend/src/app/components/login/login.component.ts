import {Component, OnInit} from '@angular/core';
import {AccessControlService} from '../../services/access-control.service';
import {Router} from '@angular/router';

export class LoginUser {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: LoginUser;
  message: string;

  constructor(private accessControlService: AccessControlService, private router: Router) {
    this.user = new LoginUser();
    this.message = null;
  }


  ngOnInit() {
  }

  loginFunc(): void {
    this.accessControlService.login(this.user.username, this.user.password)
      .subscribe(
        data => {
          if (data) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user_type', data.user_type);
            localStorage.setItem('username', data.data.username);
            this.router.navigateByUrl('');
          }
        },
        error => {
          this.message = error.error.detail;
        });
  }

}
