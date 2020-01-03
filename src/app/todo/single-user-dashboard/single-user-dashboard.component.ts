import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from 'src/app/app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/socket.service';


@Component({
  selector: 'app-single-user-dashboard',
  templateUrl: './single-user-dashboard.component.html',
  styleUrls: ['./single-user-dashboard.component.css']
})
export class SingleUserDashboardComponent implements OnInit {
  public userId:any;
  public userName:any;
  public authToken:any;
  public userInfo:any;
  public allLists:any = [];
  public mode:string;

  constructor(public appService:AppService,public toastr:ToastrManager,public route:Router,public socketService:SocketService) { }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.userId = Cookie.get('userId');
    this.userName = Cookie.get('userName');
    this.userInfo = this.appService.getUserInfoFromLocalStorage()
    this.getAllListForUserMethod()
    this.mode='private'
  }

  public getAllListForUserMethod(){
    console.log('get all list method called')
    if(this.userId!=null && this.authToken!=null){
      this.appService.getAllListForUserMethod(this.userId,this.authToken).subscribe(
        apiResponse=>{
        if(apiResponse.status==200){
         // this.toastr.successToastr("All list found",'Found');
          this.allLists=apiResponse.data;
          console.log(this.allLists);
        }
        else{
         // this.toastr.warningToastr(apiResponse.message,'Error');
         this.allLists=[];
        //this.route.navigate(['single-user-dashboard']);
        }
      },
      error=>{
        if(error.status==400){
          this.toastr.warningToastr("List not found",'error');
        }
        else{
          this.toastr.warningToastr("Some error occured",'error');
          this.route.navigate(['/serverError']);
        }
      }
      )
    }

    else{
      this.toastr.warningToastr("Missing authorization")
    }
  }
  public getUpdatesFromUser= () =>{

    this.socketService.getUpdatesFromUser(this.userId).subscribe((data) =>{
      //getting message from user.
      
      this.toastr.infoToastr(data.message);
    });
  }
 

}
