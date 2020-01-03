import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(public appService:AppService,public router:Router,public toastr:ToastrManager,public route: ActivatedRoute,) { }

  ngOnInit() {
    this.validationToken = this.route.snapshot.paramMap.get('validationToken');
  }

  password=new FormControl('',[Validators.required]);
  confirmpassword=new FormControl('',[Validators.required]);
  public validationToken: any;

  getErrorMessage(){
    if(this.password.hasError('required')){
      return this.password.hasError('required')? 'You must enter a value':
      '';
    }
    else if(this.confirmpassword.hasError('required')){
      return this.confirmpassword.hasError('required')? 'You must enter a value':
      '';
    }
  }

  public resetPasswordMethod(){
    if (this.password.value != this.confirmpassword.value) {
      this.toastr.warningToastr("Password doesn't match", "Warning!");
    }
    else {
      let data = {
        validationToken: this.validationToken,
        password: this.password.value,
      }

      this.appService.updatePassword(data).subscribe((apiResponse) => {

        if (apiResponse.status == 200) {
          this.toastr.successToastr("Please login Password Updated!");
          this.router.navigate(['/login'])
        }
        else {
          this.toastr.errorToastr(apiResponse.message, "Error!");
        }
      },
        (error) => {
          if (error.status == 404) {
            this.toastr.warningToastr("Password Update failed Please request another password reset!");
          }
          else {
            this.toastr.errorToastr("Some Error Occurred", "Error!");
            this.router.navigate(['/serverError']);

          }

        });//end calling updatePassword

    }

}
}
