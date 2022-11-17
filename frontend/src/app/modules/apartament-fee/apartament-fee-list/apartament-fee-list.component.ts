import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ApartamentFeeService } from '../apartament-fee.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MessageService } from '../../shared/services/message/message.service';

@Component({
  selector: 'app-apartament-fee-list',
  templateUrl: './apartament-fee-list.component.html',
  styleUrls: ['./apartament-fee-list.component.scss']
})
export class ApartamentFeeListComponent implements OnInit {

  apartament_id: string
  tableLoading$: Observable<boolean>
  items$: Observable<any>

  constructor(
    private ApartamentFeeServ: ApartamentFeeService,
    private ActivatedRoute: ActivatedRoute,
    private MessageServ: MessageService
  ) {
    this.ApartamentFeeServ.setApartamentFeesLoading(true)
    this.tableLoading$ = this.ApartamentFeeServ.apartamentFeesLoading$
    this.apartament_id = this.ActivatedRoute.snapshot.paramMap.get('apartament_id') || ''
    let obs$: Observable<any>
    if (this.apartament_id) {
      obs$ = this.ApartamentFeeServ.getFeesOfApartament(+this.apartament_id)
      this.items$ = this.ApartamentFeeServ.apartamentFees$
    } else {
      obs$ = this.ApartamentFeeServ.getAllFees()
      this.items$ = this.ApartamentFeeServ.allFees$
    }
    obs$.subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', '', 'Счетa загружены')
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      },
      complete: () => {
        this.ApartamentFeeServ.setApartamentFeesLoading(false)
      }
    })
  }

  ngOnInit(): void {
  }

  delete(id: number) {
    this.ApartamentFeeServ.setApartamentFeesLoading(true)
    this.ApartamentFeeServ.delete(id).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно!', 'Счет удален')
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      },
      complete: () => {
        this.ApartamentFeeServ.setApartamentFeesLoading(false)
      }
    })
  }

}
