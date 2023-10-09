import { BehaviorSubject, Observable } from 'rxjs';
import { Inject, Injectable, LOCALE_ID, Renderer2 } from '@angular/core';
import { STORAGE_SERVICE } from '@shared/constants';
import { StorageInterface } from '@shared/interfaces/Storage';
import { Router, ActivatedRoute } from '@angular/router';
import { loadTranslations } from '@angular/localize';
import { HttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';

export type LocaleSettings = {
  "locale": string,
  "translations": Record<string, string>
}
@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  public allowedLocales = ['en-US', 'ru-RU']
  /**
   * ng extract-i18n dynamic ids generation temp solution
   */
  protected localizedLocales = [
    $localize`:@@en-US:English`,
    $localize`:@@ru-RU:Russian`
  ]
  private translations$: BehaviorSubject<any> = new BehaviorSubject(null)
  public translationsObs$: Observable<LocaleSettings['translations'] | null> = this.translations$.asObservable()

  constructor(
    @Inject(STORAGE_SERVICE) private Storage: StorageInterface,
    private http: HttpClient
  ) {
  }

  initLocale () {
    const locale = this.getCurrentLocale()
    import(
      /* webpackInclude: /(en|ru)\.mjs$/ */
      `/node_modules/@angular/common/locales/${locale.slice(0,2)}`
      ).then(module => {
      registerLocaleData(module.default);
    });
    this.http.get<LocaleSettings>(`assets/i18n/messages.${locale}.json`).subscribe({
      next: (localSettings) => {
        this.translations$.next(localSettings.translations)
        loadTranslations(localSettings.translations)
      },
      error: (err) => {
        console.error(`Failed to load translations for ${locale}.`, err);
      }
    });

  }

  switchLocale (newLocale: string) {
    if (newLocale !== this.getCurrentLocale()) {
      this.Storage.setItem('locale', newLocale)
      location.reload()
    }
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
    if (navigator.languages !== undefined) {
      return navigator.languages[0]
    }
    return navigator.language
  }

}
