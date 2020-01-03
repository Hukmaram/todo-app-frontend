import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/socket.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppService } from 'src/app/app.service';
declare var $:any;
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
   public notifiedData:any[];
   public notifications:any;
  constructor(public socketService:SocketService,public toastr:ToastrManager,public appService:AppService) { }

  ngOnInit() {
    this.getNotifications();
    //this.getNotificationAboutTodoMethod()
    $("#myModal").modal('show');

  }

  getNotifications() {
    // this.appService.getUserNotifications().subscribe(
    //   result => {
    //     this.notifications = result.data.map(item => {
    //       let obj = {
    //         message: item.message,
    //         arrived: Date()
    //       };
    //       return obj;
    //     });
    //   }
    // );
  }
}
