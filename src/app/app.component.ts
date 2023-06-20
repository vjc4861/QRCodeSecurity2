import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})


export class AppComponent implements OnInit, OnDestroy {

  private authenSub: Subscription | undefined;
  private previousState = false;



  constructor(private authService: AuthService, private router: Router) {}
  
  
  ngOnInit() {
    this.authenSub =  this.authService.userisAuthenticated.subscribe(isAuthen => {
      if (!isAuthen && this.previousState !== isAuthen){
        this.router.navigateByUrl('/tabs/login');
      }
      this.previousState = isAuthen;
      
    });
  }

  ngOnDestroy() {
    if (this.authenSub){
      this.authenSub.unsubscribe();
    }
  }

  onLogout(){
    this.authService.logout()
    // this.router.navigateByUrl('/tabs/login');
  }
}
