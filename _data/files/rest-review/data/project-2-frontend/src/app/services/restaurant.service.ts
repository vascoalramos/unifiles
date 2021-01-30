import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})

export class RestaurantService {

  private baseUrl = 'http://localhost:8000/';

  constructor(private http: HttpClient, private router: Router) {
  }

  newRestaurant(rest: any): Observable<any> {
    const url = this.baseUrl + 'new_restaurant';
    return this.http.post(url, rest, httpOptions);
  }

  updateRestaurant(rest: any, id: number): Observable<any> {
    const url = this.baseUrl + 'update_restaurant/' + id;
    return this.http.put(url, rest, httpOptions);
  }

  deleteRestaurant(id: number): Observable<any> {
    const url = this.baseUrl + 'delete_restaurant/' + id;
    return this.http.delete(url, httpOptions);
  }

  getRestaurant(id: number): Observable<any> {
    const url = this.baseUrl + 'restaurant/' + id;
    return this.http.get(url, httpOptions);
  }

  getRestaurants(): Observable<any> {
    const url = this.baseUrl + 'restaurants';
    return this.http.get(url, httpOptions);
  }

  getRestaurantsbyData(name?: string, city?: string, sort?: number): Observable<any> {
    const url = this.baseUrl + 'restaurants';
    let http_params = new HttpParams();
    if (name != undefined) {
      if (name != '') {
        http_params = http_params.set('name', name);
      }
    }
    if (city != undefined) {
      if (city != '') {
        http_params = http_params.append('city', city);
      }
    }
    if (sort != undefined) {
      if (sort != 0) {
        http_params = http_params.set('attr', this.get_sort_attr(sort));
        http_params = http_params.set('order', this.get_sort_order(sort));
      }
    }
    httpOptions['params'] = http_params;
    console.log(httpOptions);
    const ret = this.http.get(url, httpOptions);
    delete httpOptions['params'];
    return ret;
  }

  getTop2Restaurants(): Observable<any> {
    const url = this.baseUrl + 'top-2';
    return this.http.get(url, httpOptions);
  }

  private get_sort_attr(n: number): string {
    if (n == 1) {
      return 'avg_price';
    } else if (n == 2) {
      return 'avg_price';
    } else if (n == 3) {
      return 'name';
    } else if (n == 4) {
      return 'name';
    } else if (n == 5) {
      return 'avg_score';
    } else if (n == 6) {
      return 'avg_score';
    } else if (n == 7) {
      return 'n_of_reviews';
    } else if (n == 8) {
      return 'avg_cleanliness';
    } else if (n == 9) {
      return 'avg_speed';
    }
  }

  private get_sort_order(n: number): string {
    if (n == 1) {
      return 'ascend';
    } else if (n == 2) {
      return 'desc';
    } else if (n == 3) {
      return 'ascend';
    } else if (n == 4) {
      return 'desc';
    } else if (n == 5) {
      return 'ascend';
    } else if (n == 6) {
      return 'desc';
    } else if (n == 7) {
      return 'desc';
    } else if (n == 8) {
      return 'desc';
    } else if (n == 9) {
      return 'desc';
    }
  }
}
