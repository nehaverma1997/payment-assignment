import { Component, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-get-booking',
  templateUrl: './get-booking.component.html',
  styleUrls: ['./get-booking.component.css']
})
export class GetBookingComponent implements OnInit {

  public username: any;
  public bookingData: Array<any>;
  public data: String;
  constructor(private router : Router, private api: BookingService) { }

  ngOnInit() {
    this.getData();
  }
  getData(){
    const data = this.api.isLoggedIn();
    this.username = data;
    this.api.getBookings().subscribe(
      (res: any) =>{
        this.bookingData = res.data;
      }
    );
  }

  makePayment(data){
    this.api.makePayment(data).subscribe(
      (res: any) => {
        this.data = res;
      }
    )
  }

  clickClose(){
    window.location.reload();
  }
  
}
