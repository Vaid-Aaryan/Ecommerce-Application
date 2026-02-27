import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(public auth: AuthService) {}

  login(){
    this.auth.loginWithRedirect();
  }

  logout(){
    this.auth.logout({ logoutParams: {returnTo: window.location.origin} });
  }

}
