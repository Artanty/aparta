import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApartamentFeeRoutingModule } from './apartament-fee-routing.module';
import { ApartamentFeeComponent } from './apartament-fee.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ApartamentFeeComponent
  ],
  imports: [
    // CommonModule,
    SharedModule,
    ApartamentFeeRoutingModule
  ]
})
export class ApartamentFeeModule { }
