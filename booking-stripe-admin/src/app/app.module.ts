import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './/app-routing.module';
import { AdminService } from './admin.service';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { AddShopBankComponent } from './add-shop-bank/add-shop-bank.component';
import { GetAllBookingsComponent } from './get-all-bookings/get-all-bookings.component';
import { AddShopsComponent } from './add-shops/add-shops.component'
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { GetProfileComponent } from './get-profile/get-profile.component';
import { GetShopsComponent } from './get-shops/get-shops.component';
import { GetAdminsComponent } from './get-admins/get-admins.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'get-profile', component: GetProfileComponent}
]
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    AddAdminComponent,
    AddShopBankComponent,
    GetAllBookingsComponent,
    AddShopsComponent,
    GetProfileComponent,
    GetShopsComponent,
    GetAdminsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AdminService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
