import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApartamentFeeCompareRoutingModule } from './apartament-fee-compare-routing.module';
import { ApartamentFeeCompareComponent } from './apartament-fee-compare.component';


@NgModule({
  declarations: [
    ApartamentFeeCompareComponent
  ],
  imports: [
    CommonModule,
    ApartamentFeeCompareRoutingModule
  ]
})
export class ApartamentFeeCompareModule { }
