import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationTariffCreateComponent } from './organization-tariff-create/organization-tariff-create.component';
import { OrganizationTariffUpdateComponent } from './organization-tariff-update/organization-tariff-update.component';
import { OrganizationTariffComponent } from './organization-tariff.component';

const routes: Routes = [
  { path: '', component: OrganizationTariffComponent },
  { path: 'new', component: OrganizationTariffCreateComponent },
  { path: 'update/:organizationTariff_id', component: OrganizationTariffUpdateComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationTariffRoutingModule { }
