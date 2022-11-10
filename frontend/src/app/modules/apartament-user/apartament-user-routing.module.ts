import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApartamentUserComponent } from './apartament-user.component';

const routes: Routes = [{ path: '', component: ApartamentUserComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApartamentUserRoutingModule { }
