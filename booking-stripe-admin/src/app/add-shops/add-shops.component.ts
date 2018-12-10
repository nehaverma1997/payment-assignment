import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-add-shops',
  templateUrl: './add-shops.component.html',
  styleUrls: ['./add-shops.component.css']
})
export class AddShopsComponent implements OnInit {

  constructor(private router : Router, private api : AdminService) { }

  addShopModel = {
    shop_name: '',
    shop_author: '',
    shop_address: '',
  }
  serverErrorMessages: String;
  successMessage: String;
  ngOnInit() {
  }

  addShopOnSubmit(form: NgForm) {
    this.api.addShop(form.value).subscribe(
      (res: any) => {
        if(res.statusCode == 200){
          this.successMessage = res.data.add_shop;
          this.addShopModel.shop_address = '';
          this.addShopModel.shop_author = '';
          this.addShopModel.shop_name = '';
        }
        else{
          this.router.navigateByUrl('/dashboard');
        }
      }
    )
  }
}
