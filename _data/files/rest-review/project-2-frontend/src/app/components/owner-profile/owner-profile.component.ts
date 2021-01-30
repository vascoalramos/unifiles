import {Component, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {OwnerService} from '../../services/owner.service';

class OwnerProfile {
  email: string;
  password: string;
  repeat_password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  photo: string;
}

@Component({
  selector: 'app-owner-profile',
  templateUrl: './owner-profile.component.html',
  styleUrls: ['./owner-profile.component.css']
})
export class OwnerProfileComponent implements OnInit {

  owner: OwnerProfile;
  email: string;
  pwsMissmatch = false;
  reader: any;
  editable: boolean;

  constructor(private route: ActivatedRoute, private ownerService: OwnerService, private router: Router) {
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
    this.ownerService.getOwner(this.email)
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
    this.owner.photo = this.reader.result.split(',')[1];
  }

  updateOwner() {
    this.ownerService.updateOwner(this.owner, this.email)
      .subscribe(data => {
        localStorage.setItem('token', data.token);
        alert('Your account was updated with success!');
        this.ngOnInit();
      }, (error: HttpResponse<any>) => {
        console.log(error);
      });
  }

  deleteOwner() {
    this.ownerService.deleteOwner(this.email)
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
    this.pwsMissmatch = (this.owner.password !== this.owner.repeat_password);
  }

}
