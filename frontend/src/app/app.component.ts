import { AfterViewInit, Component, ElementRef, HostListener, Inject, isDevMode, LOCALE_ID, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from './modules/shared/services/auth/auth.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
import { isMock, setMock } from '@shared/helpers';
import { environment } from 'src/environments/environment';
// import { version } from 'path/to/package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('navbarToggler') navbarToggler?: ElementRef<any>
  @ViewChild('fixedNavbar') fixedNavbar?: any

  isLoggedIn: boolean = false
  allListeners: (() => void)[] = [];
  isDevMode = isDevMode()
  version: string = ''

  constructor(
    private AuthServ: AuthService,
    private Router: Router,
    private elementRef: ElementRef,
    private Renderer: Renderer2,
    @Inject(LOCALE_ID) private locale: string
  ) {
    if (this.isDevMode) {
      import( '../../package.json').then((pkg: any) => this.version = pkg.version)
    } else {
      this.version = environment.version
    }
    this.Renderer.setAttribute(document.documentElement, 'lang', this.locale);
    this.Router.events.pipe(filter((res: any) => res instanceof NavigationEnd)).subscribe((val) => {
      this.isLoggedIn = this.AuthServ.isLoggedIn()
    });
  }
  ngOnInit (): void {

  }

  reloadPage() {

  }

  ngAfterViewInit() {
    const myComponent = this.elementRef.nativeElement as HTMLElement
    const clickableElements = myComponent.querySelectorAll("ul li a")
    clickableElements.forEach(eachElem => {
      const listener = this.Renderer.listen(eachElem, "click", () => {
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
