import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoneyTransferRoutingModule } from './money-transfer-routing.module';
import { MoneyTransferComponent } from './money-transfer.component';
import { MoneyTransferListComponent } from './money-transfer-list/money-transfer-list.component';
import { MoneyTransferUpdateComponent } from './money-transfer-update/money-transfer-update.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    MoneyTransferComponent,

    MoneyTransferListComponent,
    MoneyTransferUpdateComponent
  ],
  imports: [
    SharedModule,
    MoneyTransferRoutingModule
  ]
})
export class MoneyTransferModule { }
