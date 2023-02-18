import { Component, isDevMode, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthService, UserLoginApiResponse } from '../shared/services/auth/auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MessageService } from '../shared/services/message/message.service';

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
    this.http.post<UserLoginApiResponse>(`login`, data).subscribe({
      next: (res: UserLoginApiResponse) => {
        this.AuthServ.setTokenAndUser(res)
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
    this.http.post<UserLoginApiResponse>(`register`, data).subscribe({
      next: (res: UserLoginApiResponse) => {
        this.AuthServ.setTokenAndUser(res)
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
