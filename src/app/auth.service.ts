import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string = 'https://localhost:44391/auth/';

  //headers = new HttpHeaders({'Content-Type' : 'application/json'});

  constructor(private http: HttpClient,private router: Router) {}

  gotoLogin() {
    this.router.navigate(['/login']);
  }
  register(user: any) {
    return this.http.post(this.baseUrl + 'register', user);
  }

  login(user: any) {
    return this.http.post(this.baseUrl + 'login', user);
  }
  logout(){
    localStorage.removeItem('userName');
    localStorage.removeItem('token_value');
    this.gotoLogin();
  }
  
  get getUserName() {
    return localStorage.getItem('userName');
  }

  get isAuthenticated() {
    return !!localStorage.getItem('token_value');
  }

}
