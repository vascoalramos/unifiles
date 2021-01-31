import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {

  private baseUrl = 'http://localhost:8000/';

  constructor(private http: HttpClient, private router: Router) {
  }

  login(username: string, password: string): Observable<any> {
    const url = this.baseUrl + 'login';
    return this.http.post(url, {username, password}, httpOptions);
  }

  logout(): Observable<any> {
    const url = this.baseUrl + 'logout';
    return this.http.get(url, httpOptions);
  }
}
