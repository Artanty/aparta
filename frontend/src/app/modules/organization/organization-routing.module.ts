import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { OrganizationCreateComponent } from './organization-create/organization-create.component';
import { OrganizationUpdateComponent } from './organization-update/organization-update.component';
import { OrganizationComponent } from './organization.component';

const routes: Routes = [
  { path: '', component: OrganizationComponent, canActivate: [AuthGuard] },
  { path: 'new', component: OrganizationCreateComponent, canActivate: [AuthGuard] },
  { path: 'update/:organization_id', component: OrganizationUpdateComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { }
