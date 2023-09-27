import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalRoutingModule } from './external-routing.module';
import { ExternalComponent } from './external.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    ExternalComponent
  ],
  imports: [
    CommonModule,
    ExternalRoutingModule,
    SharedModule,
  ]
})
export class ExternalModule { }
