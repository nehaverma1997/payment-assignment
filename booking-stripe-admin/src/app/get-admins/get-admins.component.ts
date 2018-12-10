import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-get-admins',
  templateUrl: './get-admins.component.html',
  styleUrls: ['./get-admins.component.css']
})
export class GetAdminsComponent implements OnInit {

  public data : any;
  constructor(private router : Router, private api : AdminService) { }

  ngOnInit() {
    this.getAdmins();
  }

  getAdmins() {
    this.api.getAllAdmins().subscribe(
      (res: any) => {
        this.data = res.data;
      }
    )
  }

}
