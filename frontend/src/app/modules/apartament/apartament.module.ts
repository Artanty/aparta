import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApartamentRoutingModule } from './apartament-routing.module';
import { ApartamentComponent } from './apartament.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AuthInterceptor } from '../shared/interceptors/auth.interceptor';
import { ApartamentListComponent } from './apartament-list/apartament-list.component';
import { ApartamentCreateComponent } from './apartament-create/apartament-create.component';
import { ApartamentUpdateComponent } from './apartament-update/apartament-update.component';

import { ApartamentService } from '../shared/services/apartament/apartament.service'

@NgModule({
  declarations: [
    ApartamentComponent,
    ApartamentListComponent,
    ApartamentCreateComponent,
    ApartamentUpdateComponent
  ],
  imports: [
    ApartamentRoutingModule,
    SharedModule,
    // CommonModule
  ],
  providers: [
    ApartamentService
  ]
})
export class ApartamentModule { }
