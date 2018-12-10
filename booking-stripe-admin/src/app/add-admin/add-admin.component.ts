import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css']
})
export class AddAdminComponent implements OnInit {

  constructor(private router : Router, private api : AdminService) { }

  addAdminModel = {
    username: '',
    password: '',
    name: '',
  }
  serverErrorMessages: String;
  successMessage: String;
  ngOnInit() {
  }

  addAdminOnSubmit(form: NgForm) {
    this.api.addAdmin(form.value).subscribe(
      (res: any) => {
        if(res.statusCode == 200){
          this.successMessage = res.data.insert_admin;
        }
        else{
          this.router.navigateByUrl('/dashboard');
        }
      }
    )
  }

}
