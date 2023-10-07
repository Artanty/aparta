import { LOCALE_ID, ModuleWithProviders, NgModule, TRANSLATIONS } from '@angular/core';
import { NgAlibiComponent } from './ng-alibi.component';
import { TableComponent } from './components/table/table.component';
import { TemplateHeaderDirective } from './components/table/template-header.directive';
import { CommonModule, NgSwitch, NgSwitchCase } from '@angular/common';

export interface LibraryConfig {
  locale: string;
  translations: { [key: string]: string };
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
        { provide: TRANSLATIONS, useValue: config.translations }
      ],
    };
  }
 }
