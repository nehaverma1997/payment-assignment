import { Component, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-get-card-details',
  templateUrl: './get-card-details.component.html',
  styleUrls: ['./get-card-details.component.css']
})
export class GetCardDetailsComponent implements OnInit {

  public username: any;
  public card: any;
  constructor(private router : Router,private api: BookingService) { }

  ngOnInit() {
    this.getData();
  }
  getData(){
    const data = this.api.isLoggedIn();
    if(data){
      this.username = data;
      this.api.getCardDetails().subscribe(
        (res: any) =>{
          this.card = res.data.get_card;
          if(this.card.default == 1 && this.card.id_deleted == 0){
            this.card.default = 'true';
            this.card.id_deleted = 'false'
          }
        }
      )
    }
    else{
      this.router.navigateByUrl('/Register');
    }
  }
}
