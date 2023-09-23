import { NgModule } from '@angular/core';
import { ApartamentFeeRoutingModule } from './apartament-fee-routing.module';
import { ApartamentFeeComponent } from './apartament-fee.component';
import { SharedModule } from '../shared/shared.module';
import { ApartamentFeeCreateComponent } from './apartament-fee-create/apartament-fee-create.component';
import { ApartamentFeeListComponent } from './apartament-fee-list/apartament-fee-list.component';
import { ModalCreateFeeTemplateComponent } from './apartament-fee-create/modal-create-fee-template/modal-create-fee-template.component';
import { ModalUpdateFeeTemplateComponent } from './apartament-fee-create/modal-update-fee-template/modal-update-fee-template.component';
import { WidgetMoneyTransferComponent } from './apartament-fee-create/widget-money-transfer/widget-money-transfer.component';
import { WidgetsCurrancySourceComponent } from './apartament-fee-create/widgets-currancy-source/widgets-currancy-source.component';

@NgModule({
  declarations: [
    ApartamentFeeComponent,
    ApartamentFeeCreateComponent,
    ApartamentFeeListComponent,
    ModalCreateFeeTemplateComponent,
    ModalUpdateFeeTemplateComponent,

    WidgetMoneyTransferComponent,
     WidgetsCurrancySourceComponent
  ],
  imports: [
    SharedModule,
    ApartamentFeeRoutingModule,

  ]
})
export class ApartamentFeeModule { }
