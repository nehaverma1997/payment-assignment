import { Component, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public username: any;
  constructor(private router:Router, private api : BookingService) { }

  ngOnInit() {
    this.getData();
  }
  getData(){
    const data = this.api.isLoggedIn();
    this.username = data;
  }
  userLogout(){
    let val = confirm("Are you sure you want to Logout");
    if(val){
      // this.api.logout().subscribe(
      //   (res: any) => {
      //     if(res.status_code == 200){
      //       this.api.deleteToken();
      //       this.router.navigateByUrl('/Register');
      //     }
      //     else{
      //       this.router.navigateByUrl('/Register');
      //       window.alert("You are already logout. kindly login again..!");
      //     }
      //   }
      // )
      this.router.navigateByUrl('/Register');
    }
    else{
      window.location.reload();
    }
  };
  getProfile(){
    this.router.navigateByUrl('/Get/Profile');
  }
}
