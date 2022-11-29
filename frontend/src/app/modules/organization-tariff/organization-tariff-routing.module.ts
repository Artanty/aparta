import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { OrganizationTariffCreateComponent } from './organization-tariff-create/organization-tariff-create.component';
import { OrganizationTariffUpdateComponent } from './organization-tariff-update/organization-tariff-update.component';
import { OrganizationTariffComponent } from './organization-tariff.component';

const routes: Routes = [
  { path: '', component: OrganizationTariffComponent, canActivate: [AuthGuard] },
  { path: 'new', component: OrganizationTariffCreateComponent, canActivate: [AuthGuard] },
  { path: 'update/:organizationTariff_id', component: OrganizationTariffUpdateComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationTariffRoutingModule { }
