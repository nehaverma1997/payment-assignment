import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public username: any;
  constructor(private router:Router, private api : AdminService) { }

  ngOnInit() {
    this.getData();
  }
  getData(){
    const data = this.api.isLoggedIn();
    this.username = data;
  }

  adminLogout(){
    let val = confirm("Are you sure you want to Logout");
    if(val){
      this.api.adminLogout().subscribe(
        (res: any) => {
          if(res.statusCode == 200){
            this.api.deleteToken();
            this.router.navigateByUrl('/login');
          }
          else{
            this.router.navigateByUrl('/login');
            window.alert("You are already logout. kindly login again..!");
          }
        }
      )
      this.router.navigateByUrl('/login');
    }
    else{
      window.location.reload();
    }
  };
}
