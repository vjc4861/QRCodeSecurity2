import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap, take, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private authenService: AuthService, private router: Router) {}
  
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authenService.userisAuthenticated.pipe(
      take(1),
      switchMap(authenticatedYes => {
        if(!authenticatedYes) {
          return this.authenService.logingInAuto();
        } else {
          return of(authenticatedYes);
        }
      }),
      tap((authenticatedYes) => {
        if (!authenticatedYes) {
          this.router.navigateByUrl('/tabs/login');
        }
      })
    );
  }
}
