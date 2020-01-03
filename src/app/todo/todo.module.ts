import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleUserDashboardComponent } from './single-user-dashboard/single-user-dashboard.component';
import { FriendsDashboardComponent } from './friends-dashboard/friends-dashboard.component';
import { FriendsListManagerComponent } from './friends-list-manager/friends-list-manager.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from './notification/notification.component';
import {MatListModule} from '@angular/material';



@NgModule({
  declarations: [SingleUserDashboardComponent, FriendsDashboardComponent, FriendsListManagerComponent, NotificationComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path:'single-user-dashboard',component:SingleUserDashboardComponent},
      {path:'friends-dashboard',component:FriendsDashboardComponent},
      {path:'friends',component:FriendsListManagerComponent},
      {path:'notification',component:NotificationComponent}
    ]),
    SharedModule,
    MatListModule
  ]
})
export class TodoModule { }
