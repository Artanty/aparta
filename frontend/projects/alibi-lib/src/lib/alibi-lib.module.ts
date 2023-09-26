import { NgModule } from '@angular/core';
import { AlibiLibComponent } from './alibi-lib.component';
import { TableComponent } from './table/table.component';



@NgModule({
  declarations: [
    AlibiLibComponent,
    TableComponent
  ],
  imports: [
  ],
  exports: [
    AlibiLibComponent
  ]
})
export class AlibiLibModule { }
