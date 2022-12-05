import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { ApartamentUserCreateComponent } from './apartament-user-create/apartament-user-create.component';
import { ApartamentUserComponent } from './apartament-user.component';

// const routes: Routes = [
//   { path: '', component: ApartamentUserComponent, canActivate: [AuthGuard] }];
const routes: Routes = [
  { path: '', component: ApartamentUserComponent, canActivate: [AuthGuard] },
  {
    path: 'new',
    component: ApartamentUserCreateComponent,
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'update/:feeTemplate_id',
  //   component: FeeTemplateUpdateComponent,
  //   canActivate: [AuthGuard]
  // }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApartamentUserRoutingModule { }
