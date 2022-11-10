import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApartamentUserRoutingModule } from './apartament-user-routing.module';
import { ApartamentUserComponent } from './apartament-user.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ApartamentUserComponent
  ],
  imports: [
    // CommonModule,
    SharedModule,
    ApartamentUserRoutingModule
  ]
})
export class ApartamentUserModule { }
