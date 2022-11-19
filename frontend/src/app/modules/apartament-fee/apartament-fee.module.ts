import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApartamentFeeRoutingModule } from './apartament-fee-routing.module';
import { ApartamentFeeComponent } from './apartament-fee.component';
import { SharedModule } from '../shared/shared.module';
import { ApartamentFeeCreateComponent } from './apartament-fee-create/apartament-fee-create.component';
import { ApartamentFeeUpdateComponent } from './apartament-fee-update/apartament-fee-update.component';
import { ApartamentFeeListComponent } from './apartament-fee-list/apartament-fee-list.component';
import { ModalCreateFeeTemplateComponent } from './apartament-fee-create/modal-create-fee-template/modal-create-fee-template.component';


@NgModule({
  declarations: [
    ApartamentFeeComponent,
    ApartamentFeeCreateComponent,
    ApartamentFeeUpdateComponent,
    ApartamentFeeListComponent,
    ModalCreateFeeTemplateComponent
  ],
  imports: [
    // CommonModule,
    SharedModule,
    ApartamentFeeRoutingModule,

  ]
})
export class ApartamentFeeModule { }
