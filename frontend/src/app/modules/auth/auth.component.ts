import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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


  constructor(private http: HttpClient) {

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
    this.http.post(`${this.baseUrl}/login`, data).subscribe()
  }
  register() {
    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation
    }
    console.log(data)
    this.http.post(`${this.baseUrl}/register`, data).subscribe()
  }

}
