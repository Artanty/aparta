import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationCreateComponent } from './organization-create/organization-create.component';
import { OrganizationUpdateComponent } from './organization-update/organization-update.component';
import { OrganizationComponent } from './organization.component';

const routes: Routes = [
  { path: '', component: OrganizationComponent },
  { path: 'new', component: OrganizationCreateComponent },
  { path: 'update/:organization_id', component: OrganizationUpdateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { }
