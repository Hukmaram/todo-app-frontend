import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { UserModule } from './user/user.module';
import { ToastrModule } from 'ng6-toastr-notifications';
import { HttpClientModule } from '@angular/common/http';
import { TodoModule } from './todo/todo.module';
import { AppService } from './app.service';
import { SocketService } from './socket.service';
import { NotificationComponent } from './todo/notification/notification.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { SingleUserDashboardComponent } from './todo/single-user-dashboard/single-user-dashboard.component';
import { FriendsDashboardComponent } from './todo/friends-dashboard/friends-dashboard.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    ServerErrorComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    UserModule,
    TodoModule,
    RouterModule.forRoot([
      { path:'login',component:LoginComponent,pathMatch:'full'},
      { path:'',redirectTo:'login',pathMatch:'full'},
      {path :'serverError', component:ServerErrorComponent},
  {path :'*',component:PageNotFoundComponent},
  {path :'**',component:PageNotFoundComponent}
    ]),
    ToastrModule.forRoot()
  ],
  providers: [AppService,SocketService,NotificationComponent,SingleUserDashboardComponent,FriendsDashboardComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
