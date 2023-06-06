import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private _userAuthenticated = false;
  // comment on the below and comment off above for production
  private _userAuthenticated = true;
  private _userId = 'stark';

  get userisAuthenticated() {
    return this._userAuthenticated;
  }

  get userId() {
    return this._userId;
  }

  constructor() { }

  login() {
    this._userAuthenticated = true;

  }


  logout() {
    this._userAuthenticated = false;
  }
}
