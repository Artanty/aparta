import { NgModule } from '@angular/core';
import { NgAlibiComponent } from './ng-alibi.component';
import { TableComponent } from './components/table/table.component';

const components = [
  NgAlibiComponent,
  TableComponent
]

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
  ],
  exports: [
    ...components
  ]
})
export class NgAlibiModule { }
