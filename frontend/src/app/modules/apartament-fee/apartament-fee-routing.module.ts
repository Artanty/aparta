import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { ApartamentFeeCreateComponent } from './apartament-fee-create/apartament-fee-create.component';
import { ApartamentFeeUpdateComponent } from './apartament-fee-update/apartament-fee-update.component';
import { ApartamentFeeComponent } from './apartament-fee.component';

const routes: Routes = [
  { path: '', component: ApartamentFeeComponent },
  { path: 'new/:apartament_id', component: ApartamentFeeCreateComponent, canActivate: [AuthGuard] },
  { path: 'update/:apartamentFee_id', component: ApartamentFeeUpdateComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApartamentFeeRoutingModule { }
