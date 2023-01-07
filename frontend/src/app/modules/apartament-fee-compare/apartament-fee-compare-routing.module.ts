import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApartamentFeeCompareComponent } from './apartament-fee-compare.component';

const routes: Routes = [{ path: '', component: ApartamentFeeCompareComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApartamentFeeCompareRoutingModule { }
