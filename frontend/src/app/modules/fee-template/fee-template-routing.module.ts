import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { FeeTemplateCreateComponent } from './fee-template-create/fee-template-create.component';
import { FeeTemplateUpdateComponent } from './fee-template-update/fee-template-update.component';
import { FeeTemplateComponent } from './fee-template.component';

const routes: Routes = [
  { path: '', component: FeeTemplateComponent },
  {
    path: 'new',
    component: FeeTemplateCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'update/:feeTemplate_id',
    component: FeeTemplateUpdateComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeeTemplateRoutingModule { }
