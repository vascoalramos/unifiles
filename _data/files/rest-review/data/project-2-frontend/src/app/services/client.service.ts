import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
};

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = 'http://localhost:8000/';

  constructor(private http: HttpClient) {
  }

  addClient(data: any): Observable<any> {
    const url = this.baseUrl + 'new_client';
    return this.http.post(url, data, httpOptions);
  }

  updateClient(data: any, email: string): Observable<any> {
    const url = this.baseUrl + 'update_client/' + email;
    return this.http.put(url, data, httpOptions);
  }

  deleteClient(email: string): Observable<any> {
    const url = this.baseUrl + 'delete_client/' + email;
    return this.http.delete(url, httpOptions);
  }

  getClient(email: string): Observable<any> {
    const url = this.baseUrl + 'client/' + email;
    return this.http.get(url, httpOptions);
  }

  addToFavorites(restId: number): Observable<any> {
    const url = this.baseUrl + 'add_to_favorites';
    return this.http.post(url, {rest_id: restId}, httpOptions);
  }

  removeFromFavorites(restId: number): Observable<any> {
    const url = this.baseUrl + 'remove_from_favorites';
    httpOptions['body'] = {rest_id: restId};
    return this.http.delete(url, httpOptions);
  }

  getFavorites(): Observable<any> {
    const url = this.baseUrl + 'my_favorites';
    return this.http.get(url, httpOptions);
  }

  registerReview(id: number, title: string, comment: string, score: number, price: number, clean: number, quality: number, speed: number): Observable<any> {
    const url = this.baseUrl + 'register_review/' + id;
    return this.http.post(url, {title, comment, score, price, clean, quality, speed}, httpOptions);
  }

  getReview(id: number): Observable<any> {
    const url = this.baseUrl + 'review/' + id;
    return this.http.get(url, httpOptions);
  }
}
