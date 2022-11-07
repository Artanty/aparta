import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApartamentRoutingModule } from './apartament-routing.module';
import { ApartamentComponent } from './apartament.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ApartamentComponent
  ],
  imports: [
    CommonModule,
    ApartamentRoutingModule,
    HttpClientModule,
    FormsModule
  ]
})
export class ApartamentModule { }
