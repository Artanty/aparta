import { Pipe, PipeTransform } from '@angular/core';
import { LocaleService, LocaleSettings } from '@shared/services/locale/locale.service';
import { Observable, map, take, tap, skipWhile } from 'rxjs';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  constructor(private LocaleServ: LocaleService) {}

  transform(value: string): Observable<string> {
    return this.LocaleServ.translationsObs$.pipe(
        skipWhile((res: LocaleSettings['translations'] | null) => res === null),
        take(1),
        map((res: LocaleSettings['translations'] | null) => res?.[value] || value)
      )
  }
}
