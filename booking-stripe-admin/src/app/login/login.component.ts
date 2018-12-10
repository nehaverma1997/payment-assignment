import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router : Router, private api: AdminService) { }

  adminLoginModel = {
    username: '',
    password: ''
  };

  serverErrorMessages: String;

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.api.adminLogin(form.value).subscribe(
      (res: any) => {
        if (res.statusCode == 200) {
          let access_token = res.data.login_admin;
          this.api.setToken(access_token);
          this.adminLoginModel.username ='';
          this.adminLoginModel.password = '';
          this.router.navigateByUrl('/dashboard');
        }
        else {
          window.alert(res.message)
        }
      },
      (err: any) => {
        this.serverErrorMessages = err.message;
        window.alert(err.message)
      }
    );
  }
}
