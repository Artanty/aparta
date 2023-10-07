import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { STORAGE_SERVICE } from '@shared/constants';
import { StorageInterface } from '@shared/interfaces/Storage';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  /**
   * ur: www.site.net
   * saved locale: null
   * 1. (server redirect to default /ru/) -> www.site.net/ru (this.router.url === "/")
   * 2. (ng router path: '**', redirectTo: ext)

   */
  constructor(
    @Inject(LOCALE_ID) private localeToken: string,
    @Inject(STORAGE_SERVICE) private Storage: StorageInterface,
    private router: Router,
  ) {
  }

  initLocale () {
    console.log('this.router.url: ' + this.router.url)
    // this.localeToken = this.getCurrentLocale()
    if (this.router.url === '/') {
      // this.router.navigate(['home'])
      setTimeout(() => {
        let newLocale: string = 'ru'
        // this.switchLocale(this.getCurrentLocale())
        const savedLocale = this.getSavedLocale()
        if (savedLocale) {
          console.log('set from storage: ' + savedLocale)
          newLocale = savedLocale
        } else {
          const localeFromUrl = this.getLocaleFromUrl()
          if (localeFromUrl) {
            console.log('set from url: ' + localeFromUrl)
            newLocale = localeFromUrl
            // const browserLocale = this.getBrowserLocale()
          }
        }
        console.log('result locale to apply: ' + newLocale)
        console.log('locale token: ' + this.localeToken)
        if (newLocale !== this.getLocaleFromUrl()) {
          // this.changeLocaleInUrlAndRedirect(newLocale)
          console.log('CURRENT PATH: ' + window.location.href)
          this.changeLocaleInUrlAndRedirect(newLocale)


        }
      }, 10)
    }
  }

  switchLocale (localeCode: string) {
    console.log(this.localeToken)
    if (this.localeToken === localeCode) {
      console.log(3, 'locale code already set')
    } else {
      console.log(3, 'locale code doesnt set')
      this.Storage.setItem('locale', localeCode)
      const locale = this._getLocaleUrl(localeCode);
      if (locale) {
        this.changeLocaleInUrlAndRedirect(localeCode)
      }
    }
  }

  private changeLocaleInUrlAndRedirect (newLocale: string) {
    const path = window.location.href.replace(
      `/${this.localeToken}/`,
      `/${newLocale}/`
    );
    if (this.Storage.getItem('loc')) {
      console.log('UPDATED PATH: ' + path)
      window.location.replace(path);
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
    return window.location.pathname.includes(`/${this.localeToken}/`)
      ? `/${locale}`
      : '';
  }

  private getLocaleFromUrl(): string | undefined {
    const locales: string[] = ['ru', 'en-US']
    const url = window.location.pathname
    return this.findIncludedString(locales, url)
  }

  private findIncludedString(arr: string[], str: string): string | undefined {
    return arr.find(item => str.includes(`/${item}/`));
  }

  private getSavedLocale (): string | null {
    return this.Storage.getItem<string>('locale')
  }
}
