import { Component } from '@angular/core';
import { AuthService } from './modules/shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Aparta'
  isLoggedIn: boolean = false

  constructor(
    private AuthServ: AuthService
  ) {
    this.isLoggedIn = this.AuthServ.isLoggedIn()
  }

}
