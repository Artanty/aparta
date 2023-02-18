import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangeRateRoutingModule } from './exchange-rate-routing.module';
import { ExchangeRateComponent } from './exchange-rate.component';
import { ExchangeRateCreateComponent } from './exchange-rate-create/exchange-rate-create.component';
import { ExchangeRateListComponent } from './exchange-rate-list/exchange-rate-list.component';

import { SharedModule } from '../shared/shared.module';
import { ReadyDatesCalendarComponent } from './features/ready-dates-calendar/ready-dates-calendar.component';


@NgModule({
  declarations: [
    ExchangeRateComponent,
    ExchangeRateCreateComponent,
    ExchangeRateListComponent,
    ReadyDatesCalendarComponent,

  ],
  imports: [
    CommonModule,
    ExchangeRateRoutingModule,
    SharedModule,
  ]
})
export class ExchangeRateModule { }
