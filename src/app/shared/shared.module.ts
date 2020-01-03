import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSidenavModule,MatIconModule,MatBadgeModule,MatListModule,MatExpansionModule,MatFormFieldModule,
  MatSelectModule,MatRadioModule,MatCheckboxModule,MatInputModule,MatTabsModule,MatTableModule,MatDividerModule,MatTooltipModule} from '@angular/material';
import { TodoListBoxComponent } from './todo-list-box/todo-list-box.component';
import { ToastrModule } from 'ng6-toastr-notifications';
import { FriendsListBoxComponent } from './friends-list-box/friends-list-box.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [NavBarComponent, TodoListBoxComponent, FriendsListBoxComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSidenavModule,
    MatBadgeModule,
    MatListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MatDividerModule,
    MatTooltipModule,
    ToastrModule.forRoot()
  ],
  exports:[
    CommonModule,
    FormsModule,
    NavBarComponent,
    TodoListBoxComponent,
    FriendsListBoxComponent
  ]
})
export class SharedModule { }
