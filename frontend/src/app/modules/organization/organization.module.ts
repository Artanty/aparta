import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { OrganizationRoutingModule } from './organization-routing.module';
import { OrganizationComponent } from './organization.component';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { OrganizationCreateComponent } from './organization-create/organization-create.component';
import { OrganizationUpdateComponent } from './organization-update/organization-update.component';


@NgModule({
  declarations: [
    OrganizationComponent,
    OrganizationListComponent,
    OrganizationCreateComponent,
    OrganizationUpdateComponent
  ],
  imports: [
    CommonModule,
    OrganizationRoutingModule,
    SharedModule
  ]
})
export class OrganizationModule { }
