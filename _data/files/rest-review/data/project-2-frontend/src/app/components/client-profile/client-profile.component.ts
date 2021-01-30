import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientService} from '../../services/client.service';
import {HttpResponse} from '@angular/common/http';

class ClientProfile {
  email: string;
  password: string;
  repeat_password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  photo: string;
}

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileComponent implements OnInit {

  client: ClientProfile;
  email: string;
  pwsMissmatch = false;
  reader: any;
  editable: boolean;

  constructor(private route: ActivatedRoute, private clientService: ClientService, private router: Router) {
  }

  ngOnInit() {
    if (localStorage.getItem('username') == null) {
      this.router.navigateByUrl('login');
    }
    this.email = localStorage.getItem('username');
    this.editable = (this.email === localStorage.getItem('username'));
    this.getProfile();
  }

  getProfile() {
    this.clientService.getClient(this.email)
      .subscribe(
        rest => {
          this.client = rest.message;
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

  handleInputChange(e) {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    const pattern = /image-*/;
    this.reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    this.reader.onload = this._handleReaderLoaded.bind(this);
    this.reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    this.reader = e.target;
    this.client.photo = this.reader.result.split(',')[1];
  }

  updateClient() {
    this.clientService.updateClient(this.client, this.email)
      .subscribe(data => {
        localStorage.setItem('token', data.token);
        alert('Your account was updated with success!');
        this.ngOnInit();
      }, (error: HttpResponse<any>) => {
        console.log(error);
      });
  }

  deleteClient() {
    this.clientService.deleteClient(this.email)
      .subscribe(data => {
        alert('Your account was deleted with success!');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('user_type');
        document.getElementById('close_btn').click();
        this.router.navigateByUrl('');
      }, (error: HttpResponse<any>) => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('user_type');
        this.router.navigateByUrl('login');
      });
  }

  triggerInput() {
    document.getElementById('photo_input').click();
  }

  checkPasswords() {
    this.pwsMissmatch = (this.client.password !== this.client.repeat_password);
  }

}
