import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, tap } from 'rxjs';
import { User } from './user.model';


export interface AuthResponseData {
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

  // private _userAuthenticated = false;
  // comment on the below and comment off above for production
  // private _userAuthenticated = true;
  private _userId = '';
  // private _token = new BehaviorSubject<string>();

  private _user = new BehaviorSubject<User | null>(null);
  

  get userisAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user?.token
        } else {
          return false;
        }  
      })
    );
    // return this._userAuthenticated;
    // console.log(this._userId)
  }

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user?.id
        } else {
          return null;
        }
      })
    );
  }

  constructor(private http: HttpClient) { }


  private setUserData(userData: AuthResponseData) {
    
      const expirationTime = new Date (new Date().getTime() + (+userData.expiresIn * 1000));
      this._user.next(new User(userData.localId, userData.email, userData.idToken, expirationTime ))
    
  }

  signup(email: string, password: string ) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${
        environment.firebaseConfig.apiKey
      }`, {email: email, password: password, returnSecureToken: true}
      ).pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    // this._userAuthenticated = true;
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${
      environment.firebaseConfig.apiKey
    }`,{email: email, password: password}
    ).pipe(tap(this.setUserData.bind(this)));;

  }


  logout() {
    // this._userAuthenticated = false;
    this._user.next(null);
  }
}
