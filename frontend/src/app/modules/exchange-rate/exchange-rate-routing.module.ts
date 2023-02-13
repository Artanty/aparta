import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { ExchangeRateCreateComponent } from './exchange-rate-create/exchange-rate-create.component';

import { ExchangeRateComponent } from './exchange-rate.component';

const routes: Routes = [
  { path: '', component: ExchangeRateComponent, canActivate: [AuthGuard] },
  { path: 'new', component: ExchangeRateCreateComponent, canActivate: [AuthGuard] },
  { path: 'update/:exchangeRate_id', component: ExchangeRateCreateComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeRateRoutingModule { }
