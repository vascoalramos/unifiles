import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  private baseUrl = 'http://localhost:8000/';

  constructor(private http: HttpClient) {
  }

  addOwner(data: any): Observable<any> {
    const url = this.baseUrl + 'new_owner';
    return this.http.post(url, data, httpOptions);
  }

  updateOwner(data: any, email: string): Observable<any> {
    const url = this.baseUrl + 'update_owner/' + email;
    return this.http.put(url, data, httpOptions);
  }

  deleteOwner(email: string): Observable<any> {
    const url = this.baseUrl + 'delete_owner/' + email;
    return this.http.delete(url, httpOptions);
  }

  getOwner(email: string): Observable<any> {
    const url = this.baseUrl + 'owner_profile/' + email;
    return this.http.get(url, httpOptions);
  }

  getMyRestaurants(): Observable<any> {
    const url = this.baseUrl + 'my_restaurants';
    return this.http.get(url, httpOptions);
  }

  getPublicProfileOwner(email: string): Observable<any> {
    const url = this.baseUrl + 'owner/' + email;
    return this.http.get(url, httpOptions);
  }
}
