import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private readonly apiUrl =
  'https://performances-isp-months-gzip.trycloudflare.com/api/Auth';

  constructor(
    private http: HttpClient
  ) {}

  login(
    email: string,
    password: string
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/login`,
      {
        email: email,
        password: password
      }
    );
  }

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/register`,
      {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
      }
    );
  }
}