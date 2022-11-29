import { Component } from '@angular/core';
import { AuthService } from './modules/shared/services/auth.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Aparta'
  isLoggedIn: boolean = false

  constructor(
    private AuthServ: AuthService,
    private Router: Router

  ) {
    this.isLoggedIn = this.AuthServ.isLoggedIn()
  }

  logout(){
    this.AuthServ.clearToken()
    this.Router.navigate(['auth'])
  }
}
