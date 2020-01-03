import { Component, OnInit, SimpleChanges } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SocketService } from 'src/app/socket.service';
import { promise } from 'protractor';
import { resolve } from 'url';
import { reject } from 'q';

@Component({
  selector: 'app-friends-list-box',
  templateUrl: './friends-list-box.component.html',
  styleUrls: ['./friends-list-box.component.css']
})
export class FriendsListBoxComponent implements OnInit {

  // public allUsers=[
  //   {name:"Hukmaram",status:"online",connected:'notfriend',userId:123},{name:"Sam",status:"online",connected:'myfriend',userId:124},{name:"David",status:"offline",connected:'pending',userId:125},{name:"Randy",status:"online",connected:'pending',userId:1238}
  //  ];
   

   public senderId:any;
   public senderName:any;
   public recieverId:any;
   public recieverName:any;

   public userId: any;
  public userName: any;
  public userInfo: any;
  public authToken: any;
  public userDetails: any;

  public userFriends: any = []
  public allUsers: any = []
  public allUsersData: any = []

  public requestSents: any = []
  public requestRecieved: any = []
  public onlineUserList: any[];
  public id:any;
  constructor( public appService:AppService,public toastr:ToastrManager,public route:Router,public socketService:SocketService) { }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.userId = Cookie.get('userId');
    this.userName = Cookie.get('userName');
    this.userInfo = this.appService.getUserInfoFromLocalStorage()

    this.getUpdatedResultOnLoad()
   // this.getUpdatesFromUser()
    this.getOnlineUserList()
  }


  /* User Related Functions */
  selectUserToSentRequst(user: any) {
    let recieverId = user.userId;
    let recieverName = user.firstName + ' ' + user.lastName;
    this.sendFriendRequestFunction(recieverId, recieverName)
  }

  selectUserToCancelRequst(user: any) {
    let recieverId = user.friendId;
    let recieverName = user.friendName;
    this.cancelFriendRequestFunction(recieverId, recieverName)
  }

  selectUserToRejectRequst(user: any) {
    let senderId = user.friendId;
    let senderName = user.friendName;
    this.rejectFriendRequestFunction(senderId, senderName)
  }

  selectUserToAcceptRequst(user: any) {
    let senderId = user.friendId;
    let senderName = user.friendName;
    this.acceptFriendRequestFunction(senderId, senderName)
  }

  selectUserToUnfriend(user: any) {
    let senderId = user.userId;
    let senderName = user.firstName + ' ' + user.lastName;
    this.unfriendUserFunction(senderId, senderName)
  }


  public sendFriendRequestFunction(recieverId, recieverName): any {

    let data = {
      senderId: this.userId,
      senderName: this.userName,
      recieverId: recieverId,
      recieverName: recieverName,
      authToken: this.authToken
    }

    //console.log(data)  
    this.appService.sendFriendRequest(data).subscribe((apiResponse) => {
      //console.log(apiResponse)
      if (apiResponse.status == 200) {
        this.toastr.successToastr("Friend Request Sent", "Success");

        this.getUpdatedResultOnLoad()


        let dataForNotify = {
          message: `${data.senderName} has sent you a friend request.`,
          userId: data.recieverId
        }

       // this.notifyUpdatesToUser(dataForNotify);


      }
      else {
        this.toastr.errorToastr(apiResponse.message, "Error!");
      }
    },
      (error) => {
        if (error.status == 400) {
          this.toastr.warningToastr("Failed to Send Friend Request", "One or more fields are missing");
        }
        else {
          this.toastr.errorToastr("Some Error Occurred", "Error!");
          this.route.navigate(['/serverError']);

        }
      });//end calling send request
  }//end sendFriendRequestFunction

  public rejectFriendRequestFunction(senderId, senderName): any {
    let data = {
      senderId: senderId,
      senderName: senderName,
      recieverId: this.userId,
      recieverName: this.userName,
      authToken: this.authToken
    }

    //console.log(data)  
    this.appService.rejectFriendRequest(data).subscribe((apiResponse) => {
      //console.log(apiResponse)
      if (apiResponse.status == 200) {
        this.toastr.successToastr("Friend Request Rejected", "Success");
        this.getUpdatedResultOnLoad()


        let dataForNotify = {
          message: `${data.recieverName} has rejected your friend request.`,
          userId: data.senderId
        }

       // this.notifyUpdatesToUser(dataForNotify);


      }
      else {
        this.toastr.errorToastr(apiResponse.message, "Error!");
      }
    },
      (error) => {
        if (error.status == 400) {
          this.toastr.warningToastr("Failed to Reject Friend Request", "One or more fields are missing");
        }
        else {
          this.toastr.errorToastr("Some Error Occurred", "Error!");
          this.route.navigate(['/serverError']);

        }
      });//end calling reject request
  }//end rejectFriendRequestFunction

  public cancelFriendRequestFunction(recieverId, recieverName): any {
    let data = {
      senderId: this.userId,
      senderName: this.userName,
      recieverId: recieverId,
      recieverName: recieverName,
      authToken: this.authToken
    }

    //console.log(data)  
    this.appService.cancelFriendRequest(data).subscribe((apiResponse) => {
      //console.log(apiResponse)
      if (apiResponse.status == 200) {
        this.toastr.successToastr("Friend Request Canceled", "Success");
        this.getUpdatedResultOnLoad()

        let dataForNotify = {
          message: `${data.senderName} has Canceled friend request.`,
          userId: data.recieverId
        }

       // this.notifyUpdatesToUser(dataForNotify);

      }
      else {
        this.toastr.errorToastr(apiResponse.message, "Error!");
      }
    },
      (error) => {
        if (error.status == 400) {
          this.toastr.warningToastr("Failed to Cancel Friend Request", "One or more fields are missing");
        }
        else {
          this.toastr.errorToastr("Some Error Occurred", "Error!");
          this.route.navigate(['/serverError']);

        }
      });//end calling cancel request
  }//end cancelFriendRequestFunction

  public acceptFriendRequestFunction(senderId, senderName): any {
    let data = {
      senderId: senderId,
      senderName: senderName,
      recieverId: this.userId,
      recieverName: this.userName,
      authToken: this.authToken
    }

    //console.log(data)  
    this.appService.acceptFriendRequest(data).subscribe((apiResponse) => {
      //console.log(apiResponse)
      if (apiResponse.status == 200) {
        this.toastr.successToastr("Friend Request Accepted", "Success");
        this.getUpdatedResultOnLoad()

        let dataForNotify = {
          message: `${data.recieverName} has accepted your friend request.`,
          userId: data.senderId
        }

      //  this.notifyUpdatesToUser(dataForNotify);


      }
      else {
        this.toastr.errorToastr(apiResponse.message, "Error!");
      }
    },
      (error) => {
        if (error.status == 400) {
          this.toastr.warningToastr("Failed to accept Friend Request", "One or more fields are missing");
        }
        else {
          this.toastr.errorToastr("Some Error Occurred", "Error!");
          this.route.navigate(['/serverError']);

        }
      });//end calling accept request
  }//end acceptFriendRequestFunction

  public unfriendUserFunction(senderId, senderName): any {
    let data = {
      senderId: senderId,
      senderName: senderName,
      recieverId: this.userId,
      recieverName: this.userName,
      authToken: this.authToken
    }

    //console.log(data)  
    this.appService.unfriendUser(data).subscribe((apiResponse) => {
      //console.log(apiResponse)
      if (apiResponse.status == 200) {
        this.toastr.successToastr("You are not friends ", "Success");
        this.getUpdatedResultOnLoad()
        console.log(apiResponse)

        let dataForNotify = {
          message: `You are no longer friend of ${data.recieverName}.`,
          userId: data.senderId
        }

       // this.notifyUpdatesToUser(dataForNotify);

      }
      else {
        this.toastr.errorToastr(apiResponse.message, "Error!");
      }
    },
      (error) => {
        if (error.status == 400) {
          this.toastr.warningToastr("Failed to unfriend User", "One or more fields are missing");
        }
        else {
          this.toastr.errorToastr("Some Error Occurred", "Error!");
          this.route.navigate(['/serverError']);

        }
      });//end calling unfriend request
  }//end unfriendUserFunction

  getUpdatedResultOnLoad = () => {

    let getUserDetailsPromise = () => {
      return new Promise((resolve, reject) => {
        if (this.authToken != null && this.userId != null) {
          this.appService.getUserDetails(this.userId, this.authToken).subscribe((apiResponse) => {
            if (apiResponse.status == 200) {

              this.userDetails = apiResponse.data;
              
              this.appService.setUserInfoInLocalStorage(this.userDetails);


              //console.log(apiResponse.data)

              resolve(this.userDetails)
            }
            else {
              this.toastr.infoToastr(apiResponse.message, "Update!");
              reject(apiResponse.message)
            }
          },
            (error) => {
              if (error.status == 400) {
                this.toastr.warningToastr("User Details not found", "Error!");
                reject("User Details not found")
              }
              else {
                this.toastr.errorToastr("Some Error Occurred", "Error!");
                this.route.navigate(['/serverError']);

              }
            }//end error
          );//end appservice.getuserdetails

        }//end if checking undefined
        else {
          this.toastr.infoToastr("Missing Authorization Key", "Please login again");
          this.route.navigate(['/user/login']);

        }

      })
    }// end getUserDetailsPromise
    let getAllUsersPromise = (userDetails) => {

      return new Promise((resolve, reject) => {
        //this function will get all the users. 

        if (this.authToken != null) {
          this.appService.getAllUsers(this.authToken).subscribe((apiResponse) => {
            if (apiResponse.status == 200) {

              this.allUsers = apiResponse.data;


              this.allUsers = this.allUsers.filter(user => user.userId != this.userId);

              this.allUsersData = this.allUsers
              this.userFriends = userDetails.friends;
              this.requestSents = userDetails.friendRequestSent;
              this.requestRecieved = userDetails.friendRequestRecieved;


              /* Will set a connected flag true if both the user are friends */
              for (let user of this.allUsers) {
                for (let friend of this.userFriends) {
                  if (user.userId == friend.friendId) {
                    user.connected = true
                  }
                }
              }


              /* Remove user from all users list if he is is in the list of sent requests*/
              for (let user of this.allUsers) {
                for (let friendSent of this.requestSents) {
                  if (user.userId == friendSent.friendId) {
                    this.allUsers = this.allUsers.filter(user => user.userId != friendSent.friendId);
                  }
                }
              }

              /* Remove user from all users list if he is is in the list of requests recieved*/
              for (let user of this.allUsers) {
                for (let friendRecieved of this.requestRecieved) {
                  if (user.userId == friendRecieved.friendId) {
                    this.allUsers = this.allUsers.filter(user => user.userId != friendRecieved.friendId);
                  }
                }
              }

              resolve(this.allUsers)
              //console.log(this.allUsers)

            }
            else {
              this.toastr.infoToastr(apiResponse.message, "Update!");
              reject(apiResponse.message)

            }
          },
            (error) => {
              if (error.status == 400) {
                this.toastr.warningToastr("User List falied to Update", "Error!");
                reject("User List falied to Update")

              }
              else {
                this.toastr.errorToastr("Some Error Occurred", "Error!");
                this.route.navigate(['/serverError']);

              }
            }//end error
          );//end appservice.getAllUsers

        }//end if checking undefined
        else {
          this.toastr.infoToastr("Missing Authorization Key", "Please login again");
          this.route.navigate(['/user/login']);

        }

      })
    } //end getAllUsersPromise


    getUserDetailsPromise()
      .then(getAllUsersPromise)
      .then((resolve) => {
        //console.log(resolve)
      })
      .catch((err) => {
        console.log("errorhandler");
        console.log(err);
      })
  }

  public notifyUpdatesToUser: any = (data) => {
    //data will be object with message and userId(recieverId)
    this.socketService.notifyUpdates(data);

  }//end notifyUpdatesToUser
  public getUpdatesFromUser= () =>{

    this.socketService.getUpdatesFromUser(this.userId).subscribe((data) =>{
      //getting message from user.
      
      this.toastr.infoToastr(data.message);
      this.getUpdatedResultOnLoad()
    });
  }

  public getOnlineUserList: any = () => {
    this.socketService.onlineUserList().subscribe((data) => {
        

        this.onlineUserList = []
        for (let x in data) {
          //let temp = { 'userId': x, 'userName': data[x] };
          this.onlineUserList.push(x);

        }
        //console.log(this.onlineUserList)
        for (let user of this.allUsers) {

          if (this.onlineUserList.includes(user.userId)) {
            user.status = "online"
          } else {
            user.status = "offline"
          }

        }
        //console.log(this.allUsers)

      });//end subscribe
  }//end getOnlineUserList
  ngOnDestroy() {
    this.socketService.exitSocket()
  }
}