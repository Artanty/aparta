import { LOCALE_ID, ModuleWithProviders, NgModule, TRANSLATIONS } from '@angular/core';
import { NgAlibiComponent } from './ng-alibi.component';
import { TableComponent } from './components/table/table.component';
import { TemplateHeaderDirective } from './components/table/template-header.directive';
import { CommonModule, NgSwitch, NgSwitchCase } from '@angular/common';

export interface LibraryConfig {
  locale: string;
  translations: { [key: string]: string };
}

function translationsFactory(config: LibraryConfig): Record<string, string> {
  if (config.translations) {
    return config.translations;
  } else {
    return {
      greeting: 'Hello, World!',
      'pagination-count': 'from23'
    };
  }
}

const components = [
  NgAlibiComponent,
  TableComponent
]
const directives = [
  TemplateHeaderDirective
]

@NgModule({
  declarations: [
    ...components, ...directives

  ],
  imports: [

    CommonModule
  ],
  exports: [
    ...components, ...directives
  ]
})
export class NgAlibiModule {
  static forRoot(config: LibraryConfig): ModuleWithProviders<NgAlibiModule> {
    return {
      ngModule: NgAlibiModule,
      providers: [
        { provide: LOCALE_ID, useValue: config.locale },
        // {
        //   provide: TRANSLATIONS,
        //   useFactory: translationsFactory,
        //   deps: [config]
        // }
        {
          provide: TRANSLATIONS,
          useValue: config.locale || {
            greeting: 'Hello, World!',
            'pagination-count': 'from'
          }
        },
      ],
    };
  }
 }
