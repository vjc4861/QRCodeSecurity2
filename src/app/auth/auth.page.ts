import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLoading = false;
  isLogin = true;

  constructor(private authService: AuthService, private alertCtrl: AlertController ,private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onLogin(email: string, password: string) {
    this.isLoading = true;
    // this.authService.login();
    this.loadingCtrl.create({keyboardClose: true, message: 'Logging in....'}).then(loadingEl => {
      loadingEl.present();
      let authObserve: Observable<AuthResponseData>;
      if (this.isLogin) {
        authObserve = this.authService.login(email, password);
      } else {
        authObserve = this.authService.signup(email, password);
      }
      // send a request to signup servers
      authObserve.subscribe(
        (responseData) => {
        console.log(responseData);
        console.log('User ID:', responseData.localId);
        this.isLoading = false;
        loadingEl.dismiss();
        this.router.navigateByUrl('/profile')
      }, respondedError => {
            this.isLoading = false;
            loadingEl.dismiss();
            const code = respondedError.error.error.message;
            let message = 'Unsuccessful registration, please try again!';
            if (code === 'EMAIL_EXISTS'){
              message = 'This email address already exists!';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'Invalid email address / password. Please try again!';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'Invalid email address / password. Please try again!';
            }
            this.displayAlert(message);
      });
    });


  }

  onChangeAuthMode(){
    this.isLogin = !this.isLogin
  }

  onSubmit(form: NgForm){
    console.log('Form submitted');
    if (!form.valid){
      return
    }
    const email = form.value.email;
    const password = form.value.password;
    // console.log(email, pwd);
    this.onLogin(email, password);
  }

  private displayAlert(message: string){
    console.log('Displaying alert with message:', message);
    this.alertCtrl.create({ header: 'Login Failed', message: message, buttons: ['Okay']}).then(alertElement => alertElement.present());


  }


}
