import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { STORAGE_SERVICE } from '@shared/constants';
import { StorageInterface } from '@shared/interfaces/Storage';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  constructor(
    @Inject(LOCALE_ID) private localeToken: string,
    @Inject(STORAGE_SERVICE) private Storage: StorageInterface
  ) {
  }

  initLocale () {
    let newLocale: string = 'ru'
    const savedLocale = this.getSavedLocale()
    if (savedLocale) {
      newLocale = savedLocale
    } else {
      const localeFromUrl = this.getLocaleFromUrl()
      if (localeFromUrl) {
        newLocale = localeFromUrl
      }
    }
    if (newLocale !== this.getLocaleFromUrl()) {
      if (this.getLocaleFromUrl()) {
        this.changeLocaleInUrlAndRedirect(newLocale)
      } else {
        const newUrl = this.addLocaleInUrl(window.location.href, newLocale)
        window.location.replace(newUrl);
      }
    }
  }

  private changeLocaleInUrlAndRedirect (newLocale: string) {
    const path = window.location.href.replace(
      `/${this.localeToken}/`,
      `/${newLocale}/`
    );
    window.location.replace(path);
  }

  addLocaleInUrl (fullUrl: string, newLocale: string) {
    const [domain, path] = this.getUrlSegments(fullUrl)
    return [domain, newLocale, path].join('/')
  }

  private getUrlSegments(fullUrl: string) {
    const segments = fullUrl.split('/');
    return [
      segments.slice(0, 3).join('/'),
      segments.slice(3).join('/')
    ]
  }

  switchLocale (localeCode: string) {
    if (this.localeToken !== localeCode) {
      this.Storage.setItem('locale', localeCode)
      const locale = this._getLocaleUrl(localeCode);
      if (locale) {
        this.changeLocaleInUrlAndRedirect(localeCode)
      }
    }
  }

  public setCurrentLocale () {
    const currentLocale = this.getCurrentLocale()
    this.switchLocale(currentLocale)
  }

  public getCurrentLocale (): string {
    const selectedLocale = this.Storage.getItem<string>('locale')
    if (selectedLocale) {
      return selectedLocale
    } else {
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
