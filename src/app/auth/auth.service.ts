import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userAuthenticated = false;
  // comment on the below and comment off above for production
  // private _userAuthenticated = true;
  private _userId = '';
  

  get userisAuthenticated() {
    return this._userAuthenticated;
    // console.log(this._userId)
  }

  get userId() {
    return this._userId;
  }

  constructor(private http: HttpClient) { }

  signup(email: string, password: string ) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${
        environment.firebaseConfig.apiKey
      }`, {email: email, password: password, returnSecureToken: true}
      );
  }

  login() {
    this._userAuthenticated = true;

  }


  logout() {
    this._userAuthenticated = false;
  }
}
