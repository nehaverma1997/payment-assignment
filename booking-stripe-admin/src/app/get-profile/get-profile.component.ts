import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-get-profile',
  templateUrl: './get-profile.component.html',
  styleUrls: ['./get-profile.component.css']
})
export class GetProfileComponent implements OnInit {

  constructor(private router : Router, private api : AdminService) { }
  public username: any;
  updateModel = {
    password: '',
    verify: ''
  }
  public data : any;
  ngOnInit() {
    this.getProfile();
  }

  onSubmit(form: NgForm){
    console.log(form.value);
  }
  resetData(){
    this.updateModel.password ='';
    this.updateModel.verify = '';
  }
  
  getProfile(){
    this.api.getAdminProfile().subscribe(
      (res: any) => {
        this.data = res.data[0];
        if(this.data.admin_wallet == null){
          this.data.admin_wallet = 0;
        }
        if(this.data.pending_amount == null){
          this.data.pending_amount = 0;
        }
        console.log("---------->",res.data[0]);
      }
    )
  }

}
