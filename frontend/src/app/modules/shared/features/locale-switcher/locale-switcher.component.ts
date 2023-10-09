import { Component, Inject, LOCALE_ID } from '@angular/core';
import { LocaleService } from '@shared/services/locale/locale.service';


@Component({
  selector: 'app-locale-switcher',
  templateUrl: './locale-switcher.component.html',
  styleUrls: ['./locale-switcher.component.scss']
})
export class LocaleSwitcherComponent {

  public localesList = this.LocaleServ.allowedLocales

  constructor(
    @Inject(LOCALE_ID) private _locale: string,
    @Inject(LocaleService) private LocaleServ: LocaleService,
  ) {}

  switchLocale (localeCode: string) {
    this.LocaleServ.switchLocale(localeCode)
  }
}

