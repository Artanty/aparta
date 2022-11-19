import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { OrganizationTariffRoutingModule } from './organization-tariff-routing.module';
import { OrganizationTariffComponent } from './organization-tariff.component';
import { OrganizationTariffListComponent } from './organization-tariff-list/organization-tariff-list.component';
import { OrganizationTariffCreateComponent } from './organization-tariff-create/organization-tariff-create.component';
import { OrganizationTariffUpdateComponent } from './organization-tariff-update/organization-tariff-update.component';


@NgModule({
  declarations: [
    OrganizationTariffComponent,
    OrganizationTariffListComponent,
    OrganizationTariffCreateComponent,
    OrganizationTariffUpdateComponent
  ],
  imports: [
    CommonModule,
    OrganizationTariffRoutingModule,
    SharedModule
  ]
})
export class OrganizationTariffModule { }
