import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeeTemplateRoutingModule } from './fee-template-routing.module';
import { FeeTemplateComponent } from './fee-template.component';
import { FeeTemplateListComponent } from './fee-template-list/fee-template-list.component';
import { FeeTemplateCreateComponent } from './fee-template-create/fee-template-create.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    FeeTemplateComponent,
    FeeTemplateListComponent,
    FeeTemplateCreateComponent
  ],
  imports: [
    CommonModule,
    FeeTemplateRoutingModule,
    SharedModule,
  ]
})
export class FeeTemplateModule { }
