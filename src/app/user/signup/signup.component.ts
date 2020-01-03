import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  

  constructor(public router:Router,public appService:AppService,public toastr: ToastrManager) { }
  ngOnInit() {
    this.getCountries();
    this.getCountryCode();
  }


 public countries:any[]=[];
 public coutriesCode:any[];
 public country:any;
 public code:any;
 public countryName:any;
 public allCountries:any;

 firstName = new FormControl('', [Validators.required]);
 lastName = new FormControl('', [Validators.required]);
 phone = new FormControl('', [Validators.required]);
 email = new FormControl('', [Validators.required,Validators.email]);
 password = new FormControl('', [Validators.required]);
 countryCode = new FormControl('', [Validators.required]);
 //public countries: any[] = ["India","Bharat","Hindustan","Sone Ki Chidiya"];




   getErrorMessage(){
    if(this.firstName.hasError('required')){
      return this.firstName.hasError('required') ? 'You must enter a value' :
            '';
    }
   else if( this.lastName.hasError('required')){
    return this.lastName.hasError('required') ? 'You must enter a value' :
    '';
   }
   else if(this.email.hasError('required') || this.email.hasError('email')){
    return this.email.hasError('required') ? 'You must enter a value' :
    this.email.hasError('email') ? 'Not a valid email' :
        '';
   }

   else if(this.password.hasError('required')){
    return this.password.hasError('required') ? 'You must enter a value' :
    '';
   }
   else if(this.countryCode.hasError('required')){
    return this.countryCode.hasError('required') ? 'You must enter a value' :
    '';
   }
   else if(this.phone.hasError('required')){
    return this.phone.hasError('required') ? 'You must enter a value' :
    '';
   }
  }

  getCountries(){
   this.appService.getNameOfCountry().subscribe(
     data=>{
       for(let i in data){
         //single coutry name and code object
         // here "i" is key
       let singleCountryNameAndCode={
         name:data[i],
         code:i
       }
       this.countries.push(singleCountryNameAndCode);
      }
      this.allCountries=data;
     })
  }

  getCountryCode(){
  this.appService.getCodesOfCountry().subscribe(
    data=>{
      console.log(data);
      this.coutriesCode=data;
    }
  )
  }
  public callWhenCountryChange(){
    this.code=this.coutriesCode[this.countryCode.value]
    this.countryName=this.allCountries[this.countryCode.value];
  }

  // public gotoSignin(){
  //   this.router.navigate(['/login']);
  // }

  public signupMethod():any{

      console.log("signupMethod called");
      if(!this.firstName.value){
        this.toastr.warningToastr('First Name cannot blank', 'Oops!');
      }
      else if(!this.lastName.value){
        this.toastr.warningToastr('Last Name cannot blank', 'Oops!');
      }
      else if(!this.email.value){
        this.toastr.warningToastr('Email cannot blank', 'Oops!');  
      }
      else if(!this.password.value){
        this.toastr.warningToastr('Password cannot blank', 'Oops!'); 
      }
      else if(!this.countryCode.value){
        this.toastr.warningToastr('Country cannot blank', 'Oops!'); 
      }
      else if(!this.phone.value){
        this.toastr.warningToastr('Phone Number cannot blank','Oops');
      }
      else{
        let data={
          firstName:this.firstName.value,
          lastName:this.lastName.value,
          email:this.email.value,
          password:this.password.value,
          phone:`${this.code}${this.phone.value}`,
          countryName:this.countryName,

        }
        this.appService.signupFunction(data).subscribe(
          apiResponse=>{
            if(apiResponse.status===200){
              this.toastr.successToastr("Account Created Successfully",'success');
              this.router.navigate(['/login']);
            }
            else{
              this.toastr.errorToastr(apiResponse.message);
            }
          },
          error=>{
            this.toastr.errorToastr("Some Error Occured","Error");
            this.router.navigate(['/serverError'])
          })
      }

    
  }


}
