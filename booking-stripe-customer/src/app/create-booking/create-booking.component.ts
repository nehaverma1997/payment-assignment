import { Component, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';
import { Router } from "@angular/router";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.css']
})
export class CreateBookingComponent implements OnInit {
  product = [
    {
      id: 1,
      item_type: "T-Shirt",
      description: "Buy T-Shirt with minimum Price",
      price: "50",
      promo: 0,
      quantity: 1
    },
    {
      id: 2,
      item_type: "Watches",
      description: "Buy Watches with heavy discount buy using Promo",
      price: "100",
      promo: 10,
      quantity: 1
    },
    {
      id: 3,
      item_type: "Shirt",
      description: "Buy Tshirt with Promo in mimimum price",
      price: "100",
      promo: 10,
      quantity: 1
    },
    {
      id: 4,
      item_type: "Aviator Sunglasses",
      description: "Buy Aviator Sunglasses",
      price: "100",
      promo: 40,
      quantity: 1
    },
  ]
  public username: any;
  show: boolean;
  data: { id: number; item_type: string; description: string; price: string; promo: number; quantity: number;};
  public serverErrorMessages: any;
  public successMessage: any;
  constructor(private router : Router, private api: BookingService) { }

  ngOnInit() {
    this.getData();
  }
  getData() {
    const data = this.api.isLoggedIn();
    if(data){
      this.username = data;
    }
    else{
      this.router.navigateByUrl('/Register');
    }
  };

  showPopup(index)
  {
    
    this.show = true;
    for(let i=0;i< this.product.length;i++)
    {
      if(i == index)
      {
        this.data = this.product[i];
      }
    }
  }

  createBooking(dataToCreate){
    if(dataToCreate.promo == 0){
      this.api.createBookingWithoutPromo(dataToCreate).subscribe(
        (res:any)=>{
          if(res.data.insert_booking){
            this.successMessage = res.data.insert_booking;
          }
          else{
            window.alert(res.data)
          }
        },
        (err: any)=>{
          this.serverErrorMessages = err.message;
          window.alert(this.serverErrorMessages)
        }
      )
    }
    else if(dataToCreate.promo == 10){
      this.api.createBookingWithPromo(dataToCreate).subscribe(
        (res:any)=>{
          if(res.statusCode == 200){
            // this.successMessage = res.data.insert_booking;
            console.log("------------->", res);
          }
          else{
            this.successMessage = res.message;
          }
        },
        (err: any)=>{
          this.serverErrorMessages = err.message;
          window.alert(this.serverErrorMessages)
        }
      )
    }
    else{
      this.api.createBookingWithPromoCron(dataToCreate).subscribe(
        (res:any)=>{
          if(res.statusCode == 200){
            this.successMessage = res.message;
          }
          else{
            this.successMessage = res.message;
          }
        },
        (err: any)=>{
          this.serverErrorMessages = err.message;
          window.alert(this.serverErrorMessages)
        }
      )
    }
  }
}
