import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/socket.service';
import { SingleUserDashboardComponent } from 'src/app/todo/single-user-dashboard/single-user-dashboard.component';
import { TooltipPosition } from '@angular/material';
import { FriendsDashboardComponent } from 'src/app/todo/friends-dashboard/friends-dashboard.component';
declare var $: any;
@Component({
  selector: 'app-todo-list-box',
  templateUrl: './todo-list-box.component.html',
  styleUrls: ['./todo-list-box.component.css']
})
export class TodoListBoxComponent implements OnInit {
  @Input() allLists: any = [];
  @Input() mode: string;
  @Output()
  notify: EventEmitter<String> = new EventEmitter<String>();
  
  public userId:any;
  public userName:any;
  public authToken:any;
  public userInfo:any;
  public userMode:any;
  public selectedListId:any;
  public selectedListName: any;
  //public selectedListNameTemp: string = '';
  public selectedListMode: any;
  public todoListCreatorId:any;
  public isAddList:boolean;
  public todoListName:any;
  public isUpdateList:boolean;
  public isAddItem:boolean;
  public isUpdateItem:boolean;
  public isTodoItemDone:any;
  public todoItemId:any;
  public allItems:any[];
  public selectedItemId:any;
 // public updateTodoItem:any;
  public itemsCount:number
  public itemsDoneCount:number;
  public userFriendsTemp:any=[];
  public userFriends:any=[];


  constructor(public toastr:ToastrManager,public appService:AppService,public route:Router,public socketService:SocketService,public singleUserComponent:SingleUserDashboardComponent,public friendsDashboardComponent:FriendsDashboardComponent) { 

  }
  ngOnInit() {
   this.userId=Cookie.get('userId');
   this.userName=Cookie.get('userName');
   this.authToken=Cookie.get('authToken');
   this.userInfo=this.appService.getUserInfoFromLocalStorage();
   this.getUpdatesFromUser();

}
  todoList=new FormControl('',[Validators.required]);
  updateTodoList=new FormControl('',[Validators.required]);
  todoItem=new FormControl('',[Validators.required]);
  updateTodoItem=new FormControl('',[Validators.required]);

  getErrorMessage(){
    if(this.todoList.hasError('required')){
      return this.todoList.hasError('required')? 'You must enter a value':
      '';
    }
    else if(this.updateTodoList.hasError('required')){
      return this.updateTodoList.hasError('required')? 'You must enter a value':
      '';
    }
    else if(this.todoItem.hasError('required')){
      return this.todoItem.hasError('required')? 'You must enter a value':
      '';
    }
    else if(this.updateTodoItem.hasError('required')){
       return this.updateTodoItem.hasError('required')? 'You must enter a value':
       '';
     }
  }

 public addListMethod():any{
    console.log("add list function called")

    if(!this.todoList.value){
  this.toastr.warningToastr("Please enter your list")
    }
    else{
        // toggle the modal
        $('#ListModal').modal('toggle'); 
        let data={
        todoListName:this.todoList.value,
        todoListCreatorId:this.userId,
        todoListCreatorName:this.userName,
        todoListModifierId:this.userId,
        todoListModifierName:this.userName,
        todoListMode:this.userMode,
        authToken: this.authToken
    
        }

        console.log(data);

        this.appService.addListFunction(data).subscribe(
          apiResponse=>{
            if(apiResponse.status==200){
              this.toastr.successToastr('List Created Successfully','Success');
              
              let notifyData = {
                message: `${data.todoListCreatorName} has added a List named as ${data.todoListName}`,
              }
      this.notifyUserAboutList(notifyData);


              if(this.mode=='private'){
                this.singleUserComponent.getAllListForUserMethod();
               }
               else if(this.mode=='public'){
                 for (let x of this.userInfo.friends) {
                   this.userFriendsTemp.push(x.friendId)
                   this.userFriends.push(x.friendId) // array of friends to notify about changes of todo
                 }
             
                   this.friendsDashboardComponent.getAllListForAllUserMethod(this.userFriendsTemp)
               }
            
            }
            else{
              this.toastr.errorToastr(apiResponse.message, "Error!");
            }
          },
          error=>{
            if(error.status==400){
              this.toastr.errorToastr("Faild to add list",'error')
            }
            else{
              this.toastr.errorToastr("Some Error Occured",'Error');
              this.route.navigate(['/serverError']);
            }
          }

        )
    }
  }

  public updateListMethod():any{

    if(!this.updateTodoList.value){
  this.toastr.warningToastr("Please enter your list")
    }
    else{
        // toggle the modal
        $('#ListModal').modal('toggle'); 
        let data={
        todoListId:this.selectedListId,
        todoListName:this.updateTodoList.value,
        todoListModifierId:this.userId,
        todoListModifierName:this.userName,
        todoListMode:this.userMode,
        authToken: this.authToken

        }

        this.appService.updateListFunction(data).subscribe(
          apiResponse=>{
            if(apiResponse.status==200){
              this.toastr.successToastr('List Upadted Successfully','Success');

               
          let notifyData = {
            message: `${data.todoListModifierName} has updated a list name ${data.todoListName}`,
          }
    
          this.notifyUserAboutList(notifyData);

              if(this.mode=='private'){
             this.singleUserComponent.getAllListForUserMethod();
            }
            else if(this.mode=='public'){
              for (let x of this.userInfo.friends) {
                this.userFriendsTemp.push(x.friendId)
                this.userFriends.push(x.friendId) // array of friends to notify about changes of todo
              }
          
                this.friendsDashboardComponent.getAllListForAllUserMethod(this.userFriendsTemp)
            }

            }
            else{
              //this.toastr.errorToastr(apiResponse.message, "Error!");
            }
          },
          error=>{
            if(error.status==400){
              this.toastr.errorToastr("Faild to update list",'error')
            }
            else{
              this.toastr.errorToastr("Some Error Occured",'Error');
              this.route.navigate(['/serverError']);
            }
          }

        )
    }
  }

public deleteListMethod(){

  let data={
    todoListId:this.selectedListId,
    todoListName:this.selectedListName,
    authToken:this.authToken
  }

  this.appService.deleteListFunction(data).subscribe(
    apiResponse=>{
      if(apiResponse.status==200){
        this.toastr.successToastr('List Deleted Successfully','Success')
        let notifyData = {
          message: `${this.userName} has deleted a List named as ${this.selectedListName}`,
        }
  
        this.notifyUserAboutList(notifyData);
        if(this.mode=='private'){
          this.singleUserComponent.getAllListForUserMethod();
         }
         else if(this.mode=='public'){
           for (let x of this.userInfo.friends) {
             this.userFriendsTemp.push(x.friendId)
             this.userFriends.push(x.friendId) // array of friends to notify about changes of todo
           }
       
             this.friendsDashboardComponent.getAllListForAllUserMethod(this.userFriendsTemp)
         }
      }
      else{
      //  this.toastr.errorToastr(apiResponse.message, "Error!");
      }
    },
    error=>{
      if(error.status==400){
        this.toastr.errorToastr("Faild to delete list",'error')
      }
      else{
        this.toastr.errorToastr("Some Error Occured",'Error');
        this.route.navigate(['/serverError']);
      }
    }
  )
}



  public isAddListDecider(){
   this.isAddList=true;
   this.isUpdateList=false;
  }
  public isUpdateListDecider(){
    this.isUpdateList=true;
    this.isAddList=false;
  }


//get all items of list
public getAllItemsOfListForUser(list){
    this.selectedListName = list.todoListName;
    this.selectedListId = list.todoListId;
    this.selectedListMode = list.todoListMode;
    this.todoListCreatorId = list.todoListCreatorId;
    console.log(this.selectedListId)
    this.getAllItemsOfListForUserMethod();
}


public getAllItemsOfListForUserMethod(){
  if(this.selectedListId!=null && this.authToken!=null){
    this.allItems = [];
    this.appService.getAllItemsOfListForUserFunction(this.selectedListId,this.authToken).subscribe(
      apiResponse=>{
        if(apiResponse.status==200){
          this.allItems=apiResponse.data;
          console.log(this.allItems)
          // this.itemsCount = this.allItems.length;

          // let itemsDone = this.allItems.filter(item => item.itemDone == 'yes');
          // this.itemsDoneCount = itemsDone.length
        }
        else{
         // this.toastr.warningToastr(apiResponse.message);
          //console.log("this is error from backend")
        }
      },
      error=>{
        if(error.status==400){
          this.toastr.warningToastr("Item not found",'error')
        }
        else{
          this.toastr.warningToastr("Some error occured",'error');
          this.route.navigate(['/serverError']);
      }
    }
    )
  }
  else{
    this.toastr.warningToastr('Authorization missing hukmaram');
  }
}




public addItemMethod():any{
  console.log("add item function called")

  if(!this.todoItem.value){
this.toastr.warningToastr("Please enter your Item")
  }
  else{
      // toggle the modal
      $('#ItemModal').modal('toggle'); 
      let data={
      todoListId: this.selectedListId,
      todoItemName:this.todoItem.value,
      todoItemCreatorId:this.userId,
      todoItemCreatorName:this.userName,
      todoItemModifierId:this.userId,
      todoItemModifierName:this.userName,
      authToken:this.authToken

      }

      this.appService.addItemFunction(data).subscribe(
        apiResponse=>{
          if(apiResponse.status==200){
            this.toastr.successToastr('Item Created Successfully','Success');

            let notifyData = {
              message: `${this.userName} has added a item into list named as ${this.selectedListName}`,
              todoListId:this.selectedListId
            }
       this.notifyUserAboutList(notifyData);



            this.getAllItemsOfListForUserMethod();
          }
          else{
            this.toastr.errorToastr(apiResponse.message, "Error!");
          }
        },
        error=>{
          if(error.status==400){
            this.toastr.errorToastr("Failed to add Item",'error')
          }
          else{
            this.toastr.errorToastr("Some Error Occured",'Error');
            this.route.navigate(['/serverError']);
          }
        }

      )
  }
}


public updateItemMethod():any{
  

  if(!this.updateTodoItem.value){
this.toastr.warningToastr("Please enter your Item")
  }
  else{
      // toggle the modal
      $('#ItemModal').modal('toggle'); 
      let data={
      todoItemId: this.selectedItemId,
      todoItemName:this.updateTodoItem.value,
      todoItemModifierId:this.userId,
      todoItemModifierName:this.userName,
      authToken:this.authToken
      }
      console.log("SELECTED ITEM ID")
      console.log(this.selectedItemId)

      this.appService.updateItemFunction(data).subscribe(
        apiResponse=>{
          if(apiResponse.status==200){
            this.toastr.successToastr('Item Updated Successfully','Success');
            this.getAllItemsOfListForUserMethod();

            
        let notifyData = {
          message: `${this.userName} has updated a item from list named as ${this.selectedListName}`,
          listId:this.selectedListId

        }
  
        this.notifyUserAboutList(notifyData);

          }
          else{
            this.toastr.errorToastr(apiResponse.message, "Error!");
          }
        },
        error=>{
          if(error.status==400){
            this.toastr.errorToastr("Faild to update Item",'error')
          }
          else{
            this.toastr.errorToastr("Some Error Occured",'Error');
            this.route.navigate(['/serverError']);
          }
        }

      )
  }
}

public isAddItemDecider(){
  this.isAddItem=true;
  this.isUpdateItem=false;
 }
 public isUpdateItemDecider(item){
   this.isUpdateItem=true;
   this.isAddItem=false;
   this.selectedItemId=item.todoItemId;
 }


 public deleteItemMethod(item){

  let data={
    todoItemId:item.todoItemId,
    authToken:this.authToken
  }

  this.appService.deleteItemFunction(data).subscribe(
    apiResponse=>{
      if(apiResponse.status==200){
        this.toastr.successToastr('Item Deleted Successfully','Success');
        this.getAllItemsOfListForUserMethod();


        let notifyData = {
          message: `${this.userName} has deleted a item from list named as ${this.selectedListName}`,
          todoListId:this.selectedListId

        }
  
        this.notifyUserAboutList(notifyData);
      }
      else{
        this.toastr.errorToastr(apiResponse.message, "Error!");
      }
    },
    error=>{
      if(error.status==400){
        this.toastr.errorToastr("Faild to delete Item",'error')
      }
      else{
        this.toastr.errorToastr("Some Error Occured",'Error');
        this.route.navigate(['/serverError']);
      }
    }
  )
}

//mark yes if item done othrewise no-- toggling yes and no
public markCompletedOrNot(todoItemId,todoItemDone){
  if(this.userId!=null && this.authToken!=null){
 
    this.appService.markCompletedOrNotFunction(todoItemId,todoItemDone,this.authToken).subscribe(
    apiResponse=> {
      if(apiResponse.status==200){
        //this.toastr.successToastr('Item status updated');
        this.getAllItemsOfListForUserMethod();
      }
      else{
        this.toastr.errorToastr(apiResponse.message, "Error!");
      }
    },
    error=>{
      if(error.status==400){
        this.toastr.errorToastr("Faild to update item status",'error')
      }
      else{
        this.toastr.errorToastr("Some Error Occured",'Error');
        this.route.navigate(['/serverError']);
      }
    }
    )
  }
}


notifyUserAboutList(data) {
  this.notify.emit(data);
}

public getUpdatesFromUser = () => {

  this.socketService.getUpdatesFromUser(this.userId).subscribe((data) => {
    //getting message from user.
    console.log(data)
   
      
      
  });
}//end getUpdatesFromUser

}