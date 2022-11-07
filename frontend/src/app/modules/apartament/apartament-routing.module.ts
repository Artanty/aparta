import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApartamentComponent } from './apartament.component';

const routes: Routes = [{ path: '', component: ApartamentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApartamentRoutingModule { }
