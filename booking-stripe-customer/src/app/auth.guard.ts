import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { BookingService } from './booking.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router){}

  canActivate(){
    let access_token =  localStorage.getItem('access_token');
    if (access_token) {
      return true;
    }
    else{
      this.router.navigateByUrl('/Register');
      return false;
    }
  }
}
