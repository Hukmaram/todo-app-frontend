import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  //private baseUrl="https://chatapi.edwisor.com";
  private baseUrl = "http://localhost:3000/api/v1";

  constructor(private http:HttpClient) { }

  public getNameOfCountry():Observable<any>{
    return this.http.get('./../assets/names.json');
  }

  public getCodesOfCountry():Observable<any>
  {
    return this.http.get('./../assets/codes.json');
  }

  public signupFunction(data):Observable<any>
  {
    const params=new HttpParams()
    .set('firstName',data.firstName)
    .set('lastName',data.lastName)
    .set('email',data.email)
    .set('password',data.password)
    .set('phone',data.phone)
    .set('countryName',data.countryName)
   return this.http.post(`${this.baseUrl}/users/signup`,params);
  }

  public signinFunction(data):Observable<any>{
    const params=new HttpParams()
    .set('email',data.email)
    .set('password',data.password)
  return this.http.post(`${this.baseUrl}/users/login`,params);
  }

  public forgotPasswordFunction(data):Observable<any>{
    const params=new HttpParams()
    .set('email',data.email)
    return this.http.post(`${this.baseUrl}/users/forgotpassword`,params)
  }
  public updatePassword(data): Observable<any>{

    const params = new HttpParams()
      .set('validationToken', data.validationToken)
      .set('password', data.password)

    return this.http.put(`${this.baseUrl}/users/updatepassword`, params);
  }
  public setUserInfoInLocalStorage(data){
    localStorage.setItem('userInfo',JSON.stringify(data));
  }
  public getUserInfoFromLocalStorage(){
    return JSON.parse(localStorage.getItem('userInfo'))
  }

  public logout(userId,authToken): Observable<any>{

    const params = new HttpParams()
      .set('authToken',authToken)

    return this.http.post(`${this.baseUrl}/users/${userId}/logout`, params);
  }//end deleteMeeting
  
  public addListFunction(data):Observable<any>
  {

    const params=new HttpParams()
    .set('todoListName',data.todoListName)
    .set('todoListCreatorId',data.todoListCreatorId)
    .set('todoListCreatorName',data.todoListCreatorName)
    .set('todoListModifierId',data.todoListModifierId)
    .set('todoListModifierName',data.todoListModifierName)
    .set('todoListMode',data.userMode)
    .set('authToken',data.authToken)
    return this.http.post(`${this.baseUrl}/lists/createlist`,params)
  }
  public updateListFunction(data):Observable<any>
  {

    const params=new HttpParams()
    //.set('todoListId',data.todoListId)
    .set('todoListName',data.todoListName)
    .set('todoListModifierId',data.todoListModifierId)
    .set('todoListModifierName',data.todoListModifierName)
    .set('todoListMode',data.userMode)
    .set('authToken',data.authToken)
    return this.http.put(`${this.baseUrl}/lists/${data.todoListId}/updatelist`,params)
  }

  public deleteListFunction(data):Observable<any>{
    const params=new HttpParams()
    .set('authToken',data.authToken)
    return this.http.post(`${this.baseUrl}/lists/${data.todoListId}/delete`,params)
  }

  public addItemFunction(data):Observable<any>
  {

    const params=new HttpParams()
    .set('todoListId', data.todoListId)
    .set('todoItemName',data.todoItemName)
    .set('todoItemCreatorId',data.todoItemCreatorId)
    .set('todoItemCreatorName',data.todoItemCreatorName)
    .set('todoItemModifierId',data.todoItemModifierId)
    .set('todoItemModifierName',data.todoItemModifierName)
   // .set('todoItemDone',data.todoItemDone)
    .set('authToken',data.authToken)
    return this.http.post(`${this.baseUrl}/items/createitem`,params)
  }


  public updateItemFunction(data):Observable<any>
  {

    const params=new HttpParams()
    .set('todoItemName',data.todoItemName)
    .set('todoItemModifierId',data.todoItemModifierId)
    .set('todoItemModifierName',data.todoItemModifierName)
    .set('authToken',data.authToken)
    return this.http.put(`${this.baseUrl}/items/${data.todoItemId}/updateitem`,params)
  }

  public deleteItemFunction(data):Observable<any>{
    const params=new HttpParams()
    .set('authToken',data.authToken)
    return this.http.post(`${this.baseUrl}/items/${data.todoItemId}/delete`,params)
  }


  //get all list for a user

  public getAllListForUserMethod(userId,authToken):Observable<any>{

   return this.http.get(`${this.baseUrl}/lists/view/all/lists/${userId}?authToken=${authToken}`);
  }
//get all items of a list
  public getAllItemsOfListForUserFunction(todoListId,authToken):Observable<any>{
    return this.http.get(`${this.baseUrl}/items/view/all/items/${todoListId}?authToken=${authToken}`)

  }

  public markCompletedOrNotFunction(todoItemId,todoItemDone,authToken):Observable<any>{

  const params=new HttpParams()
  .set('todoItemId',todoItemId)
  .set('todoItemDone',todoItemDone)
  .set('authToken',authToken)
    return this.http.put(`${this.baseUrl}/items/${todoItemId}/updateitem`,params);
  }

  public getAllUsers(authToken): Observable<any> {    
    return this.http.get(`${this.baseUrl}/users/view/all?authToken=${authToken}`);
  }

  public sendFriendRequest(data): Observable<any>{

    const params = new HttpParams()
      .set('senderId',data.senderId)
      .set('senderName',data.senderName)
      .set('recieverId',data.recieverId)
      .set('recieverName',data.recieverName)
      .set('authToken',data.authToken)
      

    return this.http.post(`${this.baseUrl}/friends/send/friend/request`, params);
  }
  public unfriendUser(data): Observable<any>{

    const params = new HttpParams()
      .set('senderId',data.senderId)
      .set('senderName',data.senderName)
      .set('recieverId',data.recieverId)
      .set('recieverName',data.recieverName)
      .set('authToken',data.authToken)
      

    return this.http.post(`${this.baseUrl}/friends/unfriend/user`, params);
  }//end sendFriendRequest


  public cancelFriendRequest(data): Observable<any>{

    const params = new HttpParams()
      .set('senderId',data.senderId)
      .set('senderName',data.senderName)
      .set('recieverId',data.recieverId)
      .set('recieverName',data.recieverName)
      .set('authToken',data.authToken)
      

    return this.http.post(`${this.baseUrl}/friends/cancel/friend/request`, params);
  }//end sendFriendRequest


  public acceptFriendRequest(data): Observable<any>{

    const params = new HttpParams()
      .set('senderId',data.senderId)
      .set('senderName',data.senderName)
      .set('recieverId',data.recieverId)
      .set('recieverName',data.recieverName)
      .set('authToken',data.authToken)
      

    return this.http.post(`${this.baseUrl}/friends/accept/friend/request`, params);
  }//end sendFriendRequest
public rejectFriendRequest(data):Observable<any>{
  const params = new HttpParams()
  .set('senderId',data.senderId)
  .set('senderName',data.senderName)
  .set('recieverId',data.recieverId)
  .set('recieverName',data.recieverName)
  .set('authToken',data.authToken)
  return this.http.post(`${this.baseUrl}/friends/reject/friend/request`, params);
}


public getAllSharedList(userId,authToken): Observable<any> {
  const params = new HttpParams()
    .set('userId', userId)
  
  return this.http.post(`${this.baseUrl}/lists/view/all/shared/lists?authToken=${authToken}`,params);
}

public getUserDetails(userId,authToken): Observable<any> {    
  return this.http.get(`${this.baseUrl}/users/${userId}/details?authToken=${authToken}`);
}//end getUserDetails function


}
