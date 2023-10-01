import { Component, Inject, LOCALE_ID } from '@angular/core';
import { LocaleService } from '@shared/services/locale/locale.service';


@Component({
  selector: 'app-locale-switcher',
  templateUrl: './locale-switcher.component.html',
  styleUrls: ['./locale-switcher.component.scss']
})
export class LocaleSwitcherComponent {
  localesList = [
    { code: 'en-US', label: 'English' },
    { code: 'ru', label: 'Русский' }
  ];
  constructor(
    @Inject(LOCALE_ID) private _locale: string,
    private LocaleServ: LocaleService
  ) {}

  switchLocale (localeCode: string) {
    this.LocaleServ.switchLocale(localeCode)
  }
}
