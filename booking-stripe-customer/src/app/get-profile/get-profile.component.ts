import { Component, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-get-profile',
  templateUrl: './get-profile.component.html',
  styleUrls: ['./get-profile.component.css']
})
export class GetProfileComponent implements OnInit {

  public username: any;
  updateModel = {
    password: '',
    verify: ''
  }
  public profileData: any;
  constructor(private api:BookingService) { }

  ngOnInit() {
    this.getData();
    this.getProfile();
  }
  getData(){
    const data = this.api.isLoggedIn();
    this.username = data;
  }

  onSubmit(form: NgForm){
  }

  getProfile(){
    this.api.getProfile().subscribe(
      (res: any) =>{
        this.profileData = res.data[0];
      }
    )
  }
  resetData(){
    // this.updateModel.name = '';
    this.updateModel.password ='';
    // this.updateModel.phone = '';
    this.updateModel.verify = '';
  }
}
