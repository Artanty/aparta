import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule) },
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: 'apartament', loadChildren: () => import('./modules/apartament/apartament.module').then(m => m.ApartamentModule) },
  { path: 'apartamentFee', loadChildren: () => import('./modules/apartament-fee/apartament-fee.module').then(m => m.ApartamentFeeModule) },
  { path: 'apartamentUser', loadChildren: () => import('./modules/apartament-user/apartament-user.module').then(m => m.ApartamentUserModule) },
  { path: '**', redirectTo: 'home' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
