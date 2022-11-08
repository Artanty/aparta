import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

export type User = {
  created_at: string
  email: string
  email_verified_at: string
  id: number
  name: string
  updated_at: string
}
export type AuthDataApiResponse = {
  token: string
  user: User

}
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})

export class AuthComponent implements OnInit {
  name = 'Артем Антошкин'
  email = 'antoshkinartyom@gmail.com'
  password = 'forgot'
  password_confirmation = 'forgot'
  private baseUrl = environment.baseUrl;


  constructor(
    private http: HttpClient,
    private router: Router,
    private AuthServ: AuthService
    ) {

   }

  ngOnInit(): void {
  }

  login() {
    const data = {
      // name: this.name,
      email: this.email,
      password: this.password
    }
    console.log(data)
    this.http.post<AuthDataApiResponse>(`${this.baseUrl}/login`, data).subscribe({
      next: (res: AuthDataApiResponse) => {
        this.AuthServ.setToken(res.token)
        this.router.navigate(['/apartament'])
      },
      error: (err: any) => {

      }
    })
  }
  register() {
    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation
    }
    this.http.post<AuthDataApiResponse>(`${this.baseUrl}/register`, data).subscribe({
      next: (res: AuthDataApiResponse) => {
        this.AuthServ.setToken(res.token)
        this.router.navigate(['/apartament'])
      },
      error: (err: any) => {
        //
      }
    })
  }
}
