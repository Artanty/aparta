import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApartamentFeeComponent } from './apartament-fee.component';

const routes: Routes = [{ path: '', component: ApartamentFeeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApartamentFeeRoutingModule { }
