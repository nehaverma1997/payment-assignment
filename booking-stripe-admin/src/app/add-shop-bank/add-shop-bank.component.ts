import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-add-shop-bank',
  templateUrl: './add-shop-bank.component.html',
  styleUrls: ['./add-shop-bank.component.css']
})
export class AddShopBankComponent implements OnInit {

  constructor(private router : Router, private api : AdminService) { }

  addShopBank = {
    stripe_account_key: '',
    shop_id: ''
  }
  successMessage: String;

  ngOnInit() {
  }

  addShopBankOnSubmit(form: NgForm) {
    this.api.addShopBank(form.value).subscribe(
      (res: any) => {
        if(res.statusCode == 200){
          console.log(res);
          this.successMessage = res.message;
          this.addShopBank.stripe_account_key = '';
          this.addShopBank.shop_id = '';
        }
        else{
          this.router.navigateByUrl('/dashboard');
        }
      }
    )
  }

}
