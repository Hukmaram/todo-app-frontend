import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  email=new FormControl('',[Validators.required,Validators.email])

  constructor(public toastr:ToastrManager,public appService:AppService,public router:Router) { }

  ngOnInit() {
  }
  getErrorMessage(){
  return this.email.hasError('required')? 'You must enter a value':
  this.email.hasError('email')?'Not valid email':
  '';
  }
  public forgotPasswordMethod(){
    if(!this.email.value){
      this.toastr.warningToastr('Email cannot blank');
    }
    else{
      let data={email:this.email.value}
      this.appService.forgotPasswordFunction(data).subscribe(
        apiResponse=>{
        if(apiResponse.status===200){
          this.toastr.successToastr("Email Sent Successfully");
        }
        else{
          this.toastr.errorToastr(apiResponse.message);
        }
        },
        error=>{
          if(error.status===404){
          this.toastr.errorToastr("Email not found","Error");
        }
        else{
          this.toastr.errorToastr("Some Error Occured","Error");
          this.router.navigate(['/serverError'])
        }
      }
      )
    }
  }
}
