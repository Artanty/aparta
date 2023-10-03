import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BaseUrlInterceptor } from './interceptors/base-url.interceptor';
import { ExternalApiInterceptor } from './interceptors/external-api.interceptor';
import { InputComponent } from './components/form/input/input.component';
// import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';

import { MessageListComponent } from './features/message-list/message-list.component';
import { ModalComponent } from './features/modal/modal.component';


import { IConfig, provideEnvironmentNgxMask } from 'ngx-mask';
import { HumanMonthPipe } from './pipes/human-month.pipe';
import { GetCurrancyPipe } from './pipes/get-currancy.pipe';


import { WidgetExchangeRateComponent } from './features/widget-exchange-rate/widget-exchange-rate.component';
import { CurrancyValuePipe } from './pipes/currancy-value.pipe';
import { ProportionBlockComponent } from './features/proportion-block/proportion-block.component';
import { CurrancyTableCellComponent } from './features/currancy-table-cell/currancy-table-cell.component';
import { CurrencyOnlyPipe } from './pipes/currency-only.pipe';
import { SelectComponent } from './components/form/select/select.component';
import { SwitchComponent } from './components/form/switch/switch.component';
import { NgAlibiModule } from 'ng-alibi';
import { NgAlibiIconsModule, NgAlibiIconsRegistry, dinosaurIconsArtist, dinosaurIconsBirthday, dinosaurIconsChef, dinosaurIconsSleep, dinosaurIconsSpace, left, right
} from 'ng-alibi-icons';
import { LocaleService } from './services/locale/locale.service'
import { LocaleSwitcherComponent } from './features/locale-switcher/locale-switcher.component';
import { STORAGE_SERVICE } from './constants';
import { LocalStorageService } from './services/storage/local-storage.service';
// import { }
// const maskConfig: Partial<IConfig> = {
//   validation: true,
// };
export const options: Partial<null|IConfig> | (() => Partial<IConfig>) = null;



@NgModule({
  declarations: [
    InputComponent,
    MessageListComponent,
    ModalComponent,
    HumanMonthPipe,
    GetCurrancyPipe,
    WidgetExchangeRateComponent,
    CurrancyValuePipe,
    ProportionBlockComponent,
    CurrancyTableCellComponent,
    CurrencyOnlyPipe,
    SelectComponent,
    SwitchComponent,
    LocaleSwitcherComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    NgAlibiModule,
    NgAlibiIconsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ExternalApiInterceptor, multi: true },
    provideEnvironmentNgxMask(),
    // { provide: APP_INITIALIZER,
    //   deps: [LocaleService],
    //   useFactory: (localeService: LocaleService) => () =>
    //     localeService.setCurrentLocale(),
    //   multi: true
    // },
    { provide: STORAGE_SERVICE, useClass: LocalStorageService },
  ],
  exports: [
    CommonModule,
    FormsModule,
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    HumanMonthPipe,
    ReactiveFormsModule,
    InputComponent,
    MessageListComponent,
    GetCurrancyPipe,
    CurrancyValuePipe,
    WidgetExchangeRateComponent,
    ProportionBlockComponent,
    CurrancyTableCellComponent,
    SelectComponent,
    SwitchComponent,
    NgAlibiModule,
    NgAlibiIconsModule,
    LocaleSwitcherComponent
    ]
})
export class SharedModule {
  constructor(private ngAlibiIconsRegistry: NgAlibiIconsRegistry) {
    this.ngAlibiIconsRegistry.registerIcons([
        dinosaurIconsArtist,
        left,
        right
    ]);
}
}
