import { NgModule } from '@angular/core';
import { NgAlibiComponent } from './ng-alibi.component';
import { TableComponent } from './components/table/table.component';
import { TemplateHeaderDirective } from './components/table/template-header.directive';
import { CommonModule, NgSwitch, NgSwitchCase } from '@angular/common';

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
    // NgSwitch, NgSwitchCase, ngFor
    CommonModule
  ],
  exports: [
    ...components, ...directives
  ]
})
export class NgAlibiModule { }
