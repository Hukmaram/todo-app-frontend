import { Component, OnInit } from '@angular/core';
import { NotificationComponent } from 'src/app/todo/notification/notification.component';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from 'src/app/app.service';
import { SocketService } from 'src/app/socket.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  public userName:any;
  public userId:any;
  public authToken:any;
  constructor(public appService:AppService,public socketService:SocketService, public router:Router,public toastr:ToastrManager) { }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.userId = Cookie.get('userId');
    this.userName = Cookie.get('userName');
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
          //this.toastr.warningToastr("Logout Failed", "Already Logged Out or Invalid User");
          this.router.navigate(['/login']);
        }
        else{
          this.toastr.errorToastr("Some Error Occurred", "Error!");
          this.router.navigate(['/serverError']);

        }
    });

  }//end logout  
}
