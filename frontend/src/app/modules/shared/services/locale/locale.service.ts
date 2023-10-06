import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { STORAGE_SERVICE } from '@shared/constants';
import { StorageInterface } from '@shared/interfaces/Storage';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  constructor(
    @Inject(LOCALE_ID) private _locale: string,
    @Inject(STORAGE_SERVICE) private Storage: StorageInterface,
    private router: Router,
    private ActivatedRoute: ActivatedRoute
  ) {
    this.ActivatedRoute.params.subscribe((res: any) => {
      console.log(res)
    })
  }

  initLocale () {
    if (this.router.url === '/') {
      this.router.navigate(['home'])
      setTimeout(() => {
        this.switchLocale(this.getCurrentLocale())
      }, 0)
    }
  }

  switchLocale (localeCode: string) {
    if (this._locale === localeCode) {
      console.log(3, 'locale code already set')
    } else {
      this.Storage.setItem('locale', localeCode)
      const locale = this._getLocaleUrl(localeCode);
      if (locale) {
        const path = window.location.href.replace(
          `/${this._locale}/`,
          `/${localeCode}/`
        );
        if (this.Storage.getItem('loc')) {
          window.location.replace(path);
        }
      }
    }
  }

  public setCurrentLocale () {
    const currentLocale = this.getCurrentLocale()
    this.switchLocale(currentLocale)
  }

  public getCurrentLocale (): string {
    const selectedLocale = this.Storage.getItem<string>('locale')
    console.log('loc from stirage: ' + selectedLocale)
    if (selectedLocale) {
      return selectedLocale
    } else {
      console.log('loc from browser: ' + this.getBrowserLocale())
      return this.getBrowserLocale()
    }
  }

  private getBrowserLocale (): string {
    const fixRu = (result: string) => result === 'ru-RU' ? 'ru' : result
    if (navigator.languages !== undefined) {
      return fixRu(navigator.languages[0])
    }
    return fixRu(navigator.language)
  }

  // если в урле есть текущая локаль, то меняем
  private _getLocaleUrl(locale: string): string {
    return window.location.pathname.includes(`/${this._locale}/`)
      ? `/${locale}`
      : '';
  }
}
