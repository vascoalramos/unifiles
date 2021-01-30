import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import {RestaurantService} from '../../services/restaurant.service';
import {Location} from '@angular/common';

class Rest {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  zip_code: string;
  phone_number: string;
  photo: string;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-edit-restaurant',
  templateUrl: './edit-restaurant.component.html',
  styleUrls: ['./edit-restaurant.component.css']
})
export class EditRestaurantComponent implements OnInit {

  countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua & Deps', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
    'Bosnia Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde',
    'Central African Rep', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Congo Democratic Rep', 'Costa Rica', 'Croatia',
    'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt',
    'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia',
    'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland',
    'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland Republic', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan',
    'Kenya', 'Kiribati', 'Korea North', 'Korea South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia',
    'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta',
    'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
    'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman',
    'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania',
    'Russian Federation', 'Rwanda', 'St Kitts & Nevis', 'St Lucia', 'Saint Vincent & the Grenadines', 'Samoa', 'San Marino',
    'Sao Tome & Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia',
    'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden',
    'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey',
    'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
    'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia'
  ];
  rest: Rest;
  data: any;
  reader: any;

  constructor(private router: Router, private restaurantService: RestaurantService, private route: ActivatedRoute, private location: Location) {
  }

  ngOnInit() {
    this.getRestaurant();
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
    this.rest.photo = this.reader.result.split(',')[1];
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

  triggerInput() {
    document.getElementById('photo_input').click();
  }

  updateRestaurant() {
    this.restaurantService.updateRestaurant(this.rest, this.rest.id)
      .subscribe(data => {
        localStorage.setItem('token', data.token);
        alert('Your restaurant was updated with success!');
        this.ngOnInit();
      }, (error: HttpResponse<any>) => {
        console.log(error);
      });
  }

  deleteRestaurant() {
    this.restaurantService.deleteRestaurant(this.rest.id)
      .subscribe(data => {
        alert('Your restaurant was deleted with success!');
        document.getElementById('close_btn').click();
        this.location.back();
      }, (error: HttpResponse<any>) => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('user_type');
        this.router.navigateByUrl('login');
      });
  }

}
