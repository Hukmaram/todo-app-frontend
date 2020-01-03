import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from 'src/app/app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friends-dashboard',
  templateUrl: './friends-dashboard.component.html',
  styleUrls: ['./friends-dashboard.component.css']
})
export class FriendsDashboardComponent implements OnInit {
  public userId:any;
  public userName:any;
  public authToken:any;
  public userInfo:any;
  public allLists:any = [];
  public userFriendsTemp: any = [];
  public userFriends: any = [];
  public mode:string;
  constructor(public appService:AppService,public toastr:ToastrManager,public route:Router) { }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.userId = Cookie.get('userId');
    this.userName = Cookie.get('userName');
     this.mode='public';
    
    this.userInfo = this.appService.getUserInfoFromLocalStorage()
    
   // this.userFriendsTemp.push(this.userId) // add all friends and user to variable to get their public lists

    for (let x of this.userInfo.friends) {
      this.userFriendsTemp.push(x.friendId)
      this.userFriends.push(x.friendId) // array of friends to notify about changes of todo
    }

    
    this.getAllListForAllUserMethod(this.userFriendsTemp)

  }
 
  public getAllListForAllUserMethod(userIds){
    this.allLists = []
    if (this.authToken != null) {
      this.appService.getAllSharedList(userIds, this.authToken).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {
          console.log("SHARED LIST DATA")
          console.log(apiResponse.data)

          for (let apiItem of apiResponse.data) {
            this.allLists.push(apiItem)
          }


        }
        else {
          this.toastr.infoToastr(apiResponse.message, "Update!");
          this.allLists.length = 0;

        }
      },
        (error) => {
          if (error.status == 400) {
            this.toastr.warningToastr("Lists Failed to Update", "Either user or List not found");
            this.allLists.length = 0;
          }
          else {
            this.toastr.errorToastr("Some Error Occurred", "Error!");
            this.route.navigate(['/serverError']);

          }
        }//end error
      );//end appservice.getAllLists

    }//end if checking undefined
    else {
      this.toastr.infoToastr("Missing Authorization Key", "Please login again");
      this.route.navigate(['/login']);

    }

  }

}
