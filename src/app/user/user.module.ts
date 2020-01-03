import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule, MatButtonModule, MatSelectModule, MatIconModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ng6-toastr-notifications';



@NgModule({
  declarations: [SignupComponent, LoginComponent, ForgotPasswordComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    RouterModule.forChild([
      {path:'signup',component:SignupComponent,pathMatch:'full'},
      {path:'forgotpassword',component:ForgotPasswordComponent,pathMatch:'full'},
      {path:'resetpassword/:validationToken',component:ResetPasswordComponent,pathMatch:'full'}
    ]),
    ToastrModule.forRoot()
  ]
})
export class UserModule { }
