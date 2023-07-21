import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, from, map, tap } from 'rxjs';
import { User } from './user.model';
import { Preferences } from '@capacitor/preferences';

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
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private _userAuthenticated = false;
  // comment on the below and comment off above for production
  // private _userAuthenticated = true;
  private _userId = '';

  private _user = new BehaviorSubject<User | null>(null);
  private logoutTimer: any;

  logingInAuto() {
    return from(Preferences.get({ key: 'authData' })).pipe(
      map((dataStored) => {
        if (!dataStored || !dataStored.value) {
          return null;
        }
        const data_parsed = JSON.parse(dataStored.value) as {
          token: string;
          tokenExpirationDate: string;
          userId: string;
          email: string;
        };
        const expirationTime = new Date(data_parsed.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new User(
          data_parsed.userId,
          data_parsed.email,
          data_parsed.token,
          expirationTime
        );
        return user;
      }),
      tap((user) => {
        if (user) {
          this._user.next(user);
          this.logingOutAuto(user.tokenPeriod);
        }
      }),
      map((user) => {
        return !!user;
      })
    );
  }


  private logingOutAuto(tokenPeriod: number) {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, tokenPeriod);
  }



  get userisAuthenticated() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return !!user?.token;
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
      map((user) => {
        if (user) {
          return user?.id;
        } else {
          return null;
        }
      })
    );
  }



  constructor(private http: HttpClient) {}

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    const user = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime
    );
    this._user.next(user);
    this.logingOutAuto(user.tokenPeriod);
    this.storingAuthenData(
      userData.localId,
      userData.idToken,
      expirationTime.toISOString(),
      userData.email
    );
  }



  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseConfig.apiKey}`,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }



  login(email: string, password: string) {
    // this._userAuthenticated = true; Uncomment for debugging and Stage
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseConfig.apiKey}`,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }



  logout() {
    // this._userAuthenticated = false; Uncomment for debugging and Stage
    this._user.next(null);
    Preferences.remove({ key: 'authData' });
  }



  ngOnDestroy() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
  }



  private storingAuthenData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string
  ) {
    const data = JSON.stringify({
      userId: userId,
      token: token,
      tokenExpirationDate: tokenExpirationDate,
      email: email,
    });
    Preferences.set({ key: 'authData', value: data });
  }


}
