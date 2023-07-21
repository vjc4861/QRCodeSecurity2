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
  private inPreviousState = false;



  constructor(private authenService: AuthService, private router: Router) {}
  
  
  ngOnInit() {
    this.authenSub =  this.authenService.userisAuthenticated.subscribe(isAuthen => {
      if (!isAuthen && this.inPreviousState !== isAuthen){
        this.router.navigateByUrl('/tabs/login');
      }
      this.inPreviousState = isAuthen;
      
    });
  }

  ngOnDestroy() {
    if (this.authenSub){
      this.authenSub.unsubscribe();
    }
  }

  onLogout(){
    this.authenService.logout()
    // this.router.navigateByUrl('/tabs/login');
  }
}
