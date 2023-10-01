import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { STORAGE_SERVICE } from '@shared/constants';
import { StorageInterface } from '@shared/interfaces/Storage';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  constructor(
    @Inject(LOCALE_ID) private _locale: string,
    @Inject(STORAGE_SERVICE) private Storage: StorageInterface
  ) { }

  switchLocale (localeCode: string) {
    if (this._locale === localeCode) {
      console.log(3, 'locale code already set')
    } else {
      this.Storage.setItem('locale', localeCode)
      const path = window.location.href.replace(
        `/${this._locale}/`,
        `/${localeCode}/`
      );
      if (this.Storage.getItem('loc')) {
        window.location.replace(path);
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
}