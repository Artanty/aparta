import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: 'apartament', loadChildren: () => import('./modules/apartament/apartament.module').then(m => m.ApartamentModule) },
  // { path: 'apartament', loadChildren: () => import('./modules/apartament/apartament.module').then(m => m.ApartamentModule) },
  { path: 'apartamentFee', loadChildren: () => import('./modules/apartament-fee/apartament-fee.module').then(m => m.ApartamentFeeModule) },
  { path: '**', redirectTo: 'auth' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
