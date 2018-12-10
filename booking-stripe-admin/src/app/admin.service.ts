import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public baseUrl: string = 'http://localhost:4444';

  constructor(private http: Http) { }

  adminLogin(authCredentials){
    // console.log(this.http.post(this.baseUrl + '/login', authCredentials));
    return this.http.post(this.baseUrl + '/admin_login', authCredentials)
    .map(res => res.json());
  }

  setToken(access_token: string) {
    localStorage.setItem('access_token', access_token);
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  deleteToken() {
    localStorage.removeItem('access_token');
  }

  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      return (userPayload);
    }
    else
      return null;
  }
  
  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload){
      return userPayload;
    }
    else
      return false;
  }

  getHeaders(){
    var access_token = this.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('access_token', access_token);
    return headers;
  }

  addAdmin(dataToSend){
    return this.http.post(this.baseUrl+'/add_admin',dataToSend)
    .map(res => res.json());
  }

  getAllBookings(){
    return this.http.get(this.baseUrl+'/get_all_bookings')
    .map(res => res.json());
  }

  addShop(dataToSend){
    return this.http.post(this.baseUrl+'/add_shops', dataToSend)
    .map(res => res.json());
  }

  addShopBank(dataToSend){
    return this.http.post(this.baseUrl+'/add_shop_bank', dataToSend)
    .map(res => res.json());
  }

  getShopList(){
    return this.http.get(this.baseUrl+'/get_all_shops')
    .map(res => res.json());
  }

  getAdminProfile(){
    let headers = this.getHeaders();
    return this.http.get(this.baseUrl+'/get_admin_profile', {headers : headers})
    .map(res => res.json());
  }
  
  getAllAdmins(){
    return this.http.get(this.baseUrl+'/get_all_admins')
    .map(res => res.json());
  }
  
  adminLogout(){
    let headers = this.getHeaders();
    return this.http.get(this.baseUrl+'/admin_logout', {headers : headers})
    .map(res => res.json());
  }
}
