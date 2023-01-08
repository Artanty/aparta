import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { MoneyTransferCreateComponent } from './money-transfer-create/money-transfer-create.component';
import { MoneyTransferUpdateComponent } from './money-transfer-update/money-transfer-update.component';
import { MoneyTransferComponent } from './money-transfer.component';

const routes: Routes = [
  { path: '', component: MoneyTransferComponent, canActivate: [AuthGuard] },
  { path: 'new', component: MoneyTransferCreateComponent, canActivate: [AuthGuard] },
  { path: 'update/:moneyTransfer_id', component: MoneyTransferUpdateComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoneyTransferRoutingModule { }
