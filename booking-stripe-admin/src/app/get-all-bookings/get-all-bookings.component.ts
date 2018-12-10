import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-get-all-bookings',
  templateUrl: './get-all-bookings.component.html',
  styleUrls: ['./get-all-bookings.component.css']
})
export class GetAllBookingsComponent implements OnInit {

  public data : any;
  constructor(private router : Router, private api : AdminService) { }

  ngOnInit() {
    this.getBookings();
  }

  getBookings() {
    this.api.getAllBookings().subscribe(
      (res: any) => {
        this.data = res.data;
      }
    )
  }

}
