import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApartamentUserRoutingModule } from './apartament-user-routing.module';
import { ApartamentUserComponent } from './apartament-user.component';
import { SharedModule } from '../shared/shared.module';
import { ApartamentUserListComponent } from './apartament-user-list/apartament-user-list.component';
import { ApartamentUserCreateComponent } from './apartament-user-create/apartament-user-create.component';
// import { ApartamentModule } from './../apartament/apartament.module'

@NgModule({
  declarations: [
    ApartamentUserComponent,
    ApartamentUserListComponent,
    ApartamentUserCreateComponent
  ],
  imports: [
    // ApartamentModule,
    SharedModule,
    ApartamentUserRoutingModule
  ]
})
export class ApartamentUserModule { }
