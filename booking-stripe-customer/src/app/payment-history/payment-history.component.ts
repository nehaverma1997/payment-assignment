import { Component, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {
  
  public username: any;
  public paymentData:any;
  constructor(private api: BookingService) { }

  ngOnInit() {
    this.getData();
  }
  getData(){
    const data = this.api.isLoggedIn();
    this.username = data;
    this.api.getPaymentHistory().subscribe(
      (res: any) =>{
        this.paymentData = res.data.get_payment_historys;
      }
    );
  }
}
