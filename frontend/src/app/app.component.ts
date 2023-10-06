import { AfterViewInit, Component, ElementRef, Inject, isDevMode, LOCALE_ID, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from './modules/shared/services/auth/auth.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
import { isMock, setMock } from '@shared/helpers';
import { LocaleService } from '@shared/services/locale/locale.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {

  @ViewChild('navbarToggler') navbarToggler?: ElementRef<any>
  @ViewChild('fixedNavbar') fixedNavbar?: any

  isLoggedIn: boolean = false
  allListeners: (() => void)[] = [];
  isDevMode = isDevMode()
  constructor(
    private AuthServ: AuthService,
    private Router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private LocaleServ: LocaleService
  ) {
    this.Router.events.pipe(filter((res: any) => res instanceof NavigationEnd)).subscribe((val) => {
      this.isLoggedIn = this.AuthServ.isLoggedIn()
    });
    // this.LocaleServ.initLocale()
    console.log(50)
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

  toggleMock() {
    setMock(!isMock())
  }
}
