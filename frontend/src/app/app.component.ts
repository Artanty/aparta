import { AfterViewInit, Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from './modules/shared/services/auth/auth.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('navbarToggler') navbarToggler?: ElementRef<any>
  @ViewChild('fixedNavbar') fixedNavbar?: any
  title = 'Aparta'
  isLoggedIn: boolean = false
  allListeners: (() => void)[] = [];

  constructor(
    private AuthServ: AuthService,
    private Router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.Router.events.pipe(filter((res: any) => res instanceof NavigationEnd)).subscribe((val) => {
      this.isLoggedIn = this.AuthServ.isLoggedIn()
    });
  }

  ngAfterViewInit() {
    const myComponent = this.elementRef.nativeElement as HTMLElement
    const clickableElements = myComponent.querySelectorAll("ul li a")
    clickableElements.forEach(eachElem => {
      const listener = this.renderer.listen(eachElem, "click", () => {
        if (!this.fixedNavbar._collapsed) {
          this.navbarToggler?.nativeElement.click()
        }
      })
      this.allListeners.push(listener)
    })
  }

  ngOnDestroy() {
    //Remove click listeners
    this.allListeners.forEach(listener => listener())
  }

  logout(){
    this.AuthServ.clearToken()
    this.Router.navigate(['auth'])
  }
}
