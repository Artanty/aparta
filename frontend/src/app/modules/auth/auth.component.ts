import { Component, isDevMode, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MessageService } from '../shared/services/message/message.service';

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
  // name = 'Артем Антошкин'
  // email = 'antoshkinartyom@gmail.com'
  // password = 'forgot'
  // password_confirmation = 'forgot'
  private baseUrl = environment.baseUrl;

  registerVisible: boolean = false

  loading: boolean = false

  // login_name: FormControl = new FormControl(null, [Validators.required])
  login_email: FormControl = new FormControl(null, [Validators.required])
  login_password: FormControl = new FormControl(null, [Validators.required])
  // login_password_confirmation: FormControl = new FormControl(null, [Validators.required])

  register_name: FormControl = new FormControl(null, [Validators.required])
  register_email: FormControl = new FormControl(null, [Validators.required])
  register_password: FormControl = new FormControl(null, [Validators.required])
  register_password_confirmation: FormControl = new FormControl(null, [Validators.required])

  loginFormGroup: FormGroup = new FormGroup({
    // name: this.login_name,
    email: this.login_email,
    password: this.login_password,
    // password_confirmation: this.login_password_confirmation
  })

  registerFormGroup: FormGroup = new FormGroup({
    name: this.register_name,
    email: this.register_email,
    password: this.register_password,
    password_confirmation: this.register_password_confirmation
  })

  isLoggedIn: boolean

  constructor(
    private http: HttpClient,
    private router: Router,
    private AuthServ: AuthService,
    private MessageServ: MessageService
    ) {
      this.isLoggedIn = this.AuthServ.isLoggedIn()
   }

  ngOnInit(): void {
    if(isDevMode()){
      console.log(33)
      this.registerFormGroup.patchValue({
        name: 'test',
        email: 'test@gmail.com',
        password: 'test',
        password_confirmation: 'test'
      })
      this.loginFormGroup.patchValue({
        email: 'antoshkinartyom@gmail.com',
        password: 'forgot'
      })
    }
  }

  setRegisterVisible (data: boolean) {
    this.registerVisible = data
  }

  login() {
    this.loading = true
    const data = this.loginFormGroup.value
    this.http.post<AuthDataApiResponse>(`login`, data).subscribe({
      next: (res: AuthDataApiResponse) => {
        this.AuthServ.setToken(res.token)
        this.router.navigate(['apartament'])
        this.MessageServ.sendMessage('success', '', 'Вход выполнен')
        this.loading = false
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        this.loading = false
      }
    })
  }

  register() {
    this.loading = true
    const data = this.registerFormGroup.value
    this.http.post<AuthDataApiResponse>(`register`, data).subscribe({
      next: (res: AuthDataApiResponse) => {
        this.AuthServ.setToken(res.token)
        this.router.navigate(['apartament'])
        this.MessageServ.sendMessage('success', '', 'Успешная регистрация')
        this.loading = false
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        this.loading = false
      }
    })
  }

  logout(){
    this.AuthServ.clearToken()
    this.router.navigate(['auth'])
  }
}
