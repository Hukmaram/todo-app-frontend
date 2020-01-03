import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public userId:string;
  public userName:string;
  public authToken:string;

  constructor(public appService:AppService,public router:Router,public toastr:ToastrManager,public socketService: SocketService,) { }

  ngOnInit() {
  }

  email=new FormControl('',[Validators.required,Validators.email]);
  password=new FormControl('',[Validators.required]);

  getErrorMessage(){
    if(this.email.hasError('required') || this.email.hasError('email')){
      return this.email.hasError('required')? 'You must enter a value':
       this.email.hasError('email')? 'Not a valid email':
      '';
    }
    else if(this.password.hasError('required')){
      return this.password.hasError('required')? 'You must enter a value':
      '';
    }
  }

  public signinMethod(){
    if(!this.email.value){
      this.toastr.warningToastr('Email cannot blank', 'Oops!');
    }
    else if(!this.password.value){
      this.toastr.warningToastr('Password cannot blank', 'Oops!');
    }
    else{
    let data={
      email:this.email.value,
      password:this.password.value
    }
    this.appService.signinFunction(data).subscribe(
      apiResponse=>{
      if(apiResponse.status===200){
         Cookie.set('authToken',apiResponse.data.authToken);
         Cookie.set('userId',apiResponse.data.userDetails.userId);
         Cookie.set('userName',`${apiResponse.data.userDetails.firstName} ${apiResponse.data.userDetails.lastName}`);
         this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails);
        this.router.navigate(['/single-user-dashboard']);
      }
      else{
        this.toastr.errorToastr(apiResponse.message)
      }
      },
      error=>{
        if(error.status===400){
       this.toastr.errorToastr("Wrong Password","Faild");
        }
        else{
          this.toastr.errorToastr("Some Error Occured","Error");
          this.router.navigate(['/serverError'])
        }
      }
    )

  }
  }
  public logoutFunction = () => {

    this.appService.logout(this.userId,this.authToken).subscribe(
      (apiResponse) => {
        if (apiResponse.status === 200) {
          localStorage.clear();
          Cookie.delete('authToken');//delete all the cookies
          Cookie.delete('userId');
          Cookie.delete('userName');
          this.socketService.disconnectedSocket();//calling the method which emits the disconnect event.
          this.socketService.exitSocket();//this method will disconnect the socket from frontend and close the connection with the server.
          this.router.navigate(['/login']);//redirects the user to login page.
        } else {
          this.toastr.errorToastr(apiResponse.message,"Error!")
          this.router.navigate(['/serverError']);//in case of error redirects to error page.
        } // end condition
      },
      (err) => {
        if(err.status == 404){
          this.toastr.warningToastr("Logout Failed", "Already Logged Out or Invalid User");
          this.router.navigate(['/login']);
        }
        else{
          this.toastr.errorToastr("Some Error Occurred", "Error!");
          this.router.navigate(['/serverError']);

        }
    });

  }//end logout  
}
