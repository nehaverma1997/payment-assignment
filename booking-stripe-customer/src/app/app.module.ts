import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateBookingComponent } from './create-booking/create-booking.component';
import { BookingService } from './booking.service';
import { AuthGuard } from './auth.guard';
import { GetBookingComponent } from './get-booking/get-booking.component';
import { GetCardDetailsComponent } from './get-card-details/get-card-details.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { GetProfileComponent } from './get-profile/get-profile.component';
import { AddMoneyToWalletComponent } from './add-money-to-wallet/add-money-to-wallet.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'Register', component: RegisterComponent},
  {path: 'Dashboard', component: DashboardComponent},
  {path: 'Create/Booking', component: CreateBookingComponent, canActivate: [AuthGuard]},
  {path: 'Get/Profile', component: GetProfileComponent},
  {path: 'Get/Bookings', component: GetBookingComponent, canActivate: [AuthGuard]},
]
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    DashboardComponent,
    CreateBookingComponent,
    GetBookingComponent,
    GetCardDetailsComponent,
    PaymentHistoryComponent,
    GetProfileComponent,
    AddMoneyToWalletComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AuthGuard,BookingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
