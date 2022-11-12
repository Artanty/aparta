import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { ApartamentCreateComponent } from './apartament-create/apartament-create.component';
import { ApartamentComponent } from './apartament.component';

const routes: Routes = [
  { path: '', component: ApartamentComponent, canActivate: [AuthGuard] },
  { path: 'apartament/new', component: ApartamentCreateComponent, canActivate: [AuthGuard] },
  { path: 'apartamentFee/:apartament_id', loadChildren: () => import('./../../modules/apartament-fee/apartament-fee.module').then(m => m.ApartamentFeeModule) },
  { path: 'apartamentUser/:apartament_id', loadChildren: () => import('./../../modules/apartament-user/apartament-user.module').then(m => m.ApartamentUserModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApartamentRoutingModule { }
