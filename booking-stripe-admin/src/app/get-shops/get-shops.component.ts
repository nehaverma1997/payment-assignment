import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-get-shops',
  templateUrl: './get-shops.component.html',
  styleUrls: ['./get-shops.component.css']
})
export class GetShopsComponent implements OnInit {

  public data : any;
  constructor(private router : Router, private api : AdminService) { }

  ngOnInit() {
    this.getShops();
  }

  getShops() {
    this.api.getShopList().subscribe(
      (res: any) => {
        this.data = res.data;
        console.log("-------->", res);
      }
    )
  }

}
