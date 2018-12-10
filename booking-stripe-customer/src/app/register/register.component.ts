import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private router : Router, private api: BookingService) { }

  loginModel = {
    email: '',
    password: ''
  };
  registerModel = {
    email: '',
    password: '',
    name: '',
    phone: ''
  }
  serverErrorMessages: String;

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.api.login(form.value).subscribe(
      (res: any) => {
        if (res.data.login_user) {
          let accessToken = res.data.login_user;
          this.api.setToken(accessToken);
          this.loginModel.email ='';
          this.loginModel.password = '';
          this.router.navigateByUrl('/Dashboard');
        }
        else {
          window.alert(res.data)
        }
      },
      (err: any) => {
        this.serverErrorMessages = err.message;
        window.alert(err.message)
      }
    );
  }

  registerOnSubmit(form: NgForm){
    this.api.register(form.value).subscribe(
      (res:any) => {
        if(res.message == "Success"){
          this.registerModel.email = '';
          this.registerModel.name = '';
          this.registerModel.password = '';
          this.registerModel.phone = '';
          window.location.reload();
        }
        else{
          this.router.navigateByUrl('/Register');
          window.alert(res.data.add_user)
        }
      },
      (err: any) => {
        this.serverErrorMessages = err.message;
        window.alert(err.message)
      }
    );
  }
}
