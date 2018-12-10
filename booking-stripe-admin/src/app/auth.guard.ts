import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router){}
  canActivate(){
    let accessToken =  localStorage.getItem('accessToken');
    if (accessToken) {
      return true;
    }
    else{
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
