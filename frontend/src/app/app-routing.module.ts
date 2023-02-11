import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: '', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule) },
  { path: '', redirectTo: 'apartamentFee', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: 'apartament', loadChildren: () => import('./modules/apartament/apartament.module').then(m => m.ApartamentModule) },
  { path: 'apartamentFee', loadChildren: () => import('./modules/apartament-fee/apartament-fee.module').then(m => m.ApartamentFeeModule) },
  { path: 'apartamentUser', loadChildren: () => import('./modules/apartament-user/apartament-user.module').then(m => m.ApartamentUserModule) },
  { path: 'organization', loadChildren: () => import('./modules/organization/organization.module').then(m => m.OrganizationModule) },
  { path: 'feeTemplate', loadChildren: () => import('./modules/fee-template/fee-template.module').then(m => m.FeeTemplateModule) },
  { path: 'organizationTariff', loadChildren: () => import('./modules/organization-tariff/organization-tariff.module').then(m => m.OrganizationTariffModule) },
  { path: 'moneyTransfer', loadChildren: () => import('./modules/money-transfer/money-transfer.module').then(m => m.MoneyTransferModule) },
  { path: '**', redirectTo: 'apartamentFee' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
