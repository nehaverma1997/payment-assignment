import { Component, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';
import { Router } from "@angular/router";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-money-to-wallet',
  templateUrl: './add-money-to-wallet.component.html',
  styleUrls: ['./add-money-to-wallet.component.css']
})
export class AddMoneyToWalletComponent implements OnInit {

  constructor(private router : Router, private api: BookingService) { }
  addMoneyMoney = {
    username: '',
    money : ''
  }
  successMessage: String;
  ngOnInit() {
  }

  addMoneyOnSubmit(form: NgForm){
    this.addMoneyMoney.money = '';
    this.addMoneyMoney.username = '';
    this.api.addMoneyToWallet(form.value.money).subscribe(
      (res: any)=>{
        this.successMessage = res.data.add_money;
      }
    )
  }
}
