import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangeRateRoutingModule } from './exchange-rate-routing.module';
import { ExchangeRateComponent } from './exchange-rate.component';
import { ExchangeRateCreateComponent } from './exchange-rate-create/exchange-rate-create.component';
import { ExchangeRateListComponent } from './exchange-rate-list/exchange-rate-list.component';

import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ExchangeRateComponent,
    ExchangeRateCreateComponent,
    ExchangeRateListComponent,

  ],
  imports: [
    CommonModule,
    ExchangeRateRoutingModule,
    SharedModule,
  ]
})
export class ExchangeRateModule { }
