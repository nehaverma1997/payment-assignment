import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  public baseUrl: string = 'http://localhost:4444';
  constructor(private http: Http) { }

  
  login(authCredentials){
    return this.http.post(this.baseUrl + '/user_login', authCredentials)
    .map(res => res.json());
  }
  
  setToken(access_token: string) {
    localStorage.setItem('access_token', access_token);
  }

  register(crendentials){
    return this.http.post(this.baseUrl + '/user_register', crendentials)
    .map(res => res.json());
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

  getBookings(){
    let headers = this.getHeaders();
    // var access_token = this.getToken();
    return this.http.get(this.baseUrl+'/get_bookings', {headers : headers})
    .map(res => res.json());
  }

  getPaymentHistory(){
    let headers = this.getHeaders();
    return this.http.get(this.baseUrl+'/get_payment_history', {headers : headers})
    .map(res => res.json());
  }

  getProfile(){
    let headers = this.getHeaders();
    return this.http.get(this.baseUrl+'/get_user_profile', {headers : headers})
    .map(res => res.json());
  }

  getCardDetails(){
    let headers = this.getHeaders();
    return this.http.get(this.baseUrl+'/get_cards', {headers : headers})
    .map(res => res.json());
  }

  createBookingWithoutPromo(data){
    var access_token = this.getToken();
    var dataToSend = {
      access_token : access_token,
      item_type : data.item_type,
      quantity : data.quantity,
      price: data.price
    }
    return this.http.post(this.baseUrl+'/create_booking', dataToSend)
    .map(res => res.json());
  }

  createBookingWithPromo(data){
    var access_token = this.getToken();
    var dataToSend = {
      access_token : access_token,
      item_type : data.item_type,
      quantity : data.quantity,
      price: data.price,
      promo : data.promo,
      shop_id : 1
    }
    return this.http.post(this.baseUrl+'/create_booking_promo', dataToSend)
    .map(res => res.json());
  }

  createBookingWithPromoCron(data){
    var access_token = this.getToken();
    var dataToSend = {
      access_token : access_token,
      item_type : data.item_type,
      quantity : data.quantity,
      price: data.price,
      promo : data.promo,
      shop_id : 1
    }
    return this.http.post(this.baseUrl+'/create_booking_promo_cron', dataToSend)
    .map(res => res.json());
  }

  makePayment(data){
    var access_token = this.getToken();
    var dataToSend = {
      data: data,
      access_token : access_token
    }
    return this.http.post(this.baseUrl+'/make_payment', dataToSend)
    .map(res => res.json());
  }

  addMoneyToWallet(data){
    var access_token = this.getToken();
    var dataToSend = {
      amount: data,
      access_token : access_token
    }
    return this.http.post(this.baseUrl+'/add_money_to_wallet', dataToSend)
    .map(res => res.json());
  }

  logout(){
    var accessToken = this.getToken();
    return this.http.post(this.baseUrl+'/user_logout', {"accessToken": accessToken})
  }
}
