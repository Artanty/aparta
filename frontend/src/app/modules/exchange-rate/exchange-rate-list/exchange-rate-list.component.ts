import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../shared/services/message/message.service';
import { ExchangeRateService } from '../exchange-rate.service';
import { GetExchangeRateApiResponse } from '../types';


@Component({
  selector: 'app-exchange-rate-list',
  templateUrl: './exchange-rate-list.component.html',
  styleUrls: ['./exchange-rate-list.component.scss']
})

export class ExchangeRateListComponent implements OnInit {
  tableLoading: boolean = false
  items: GetExchangeRateApiResponse[] = []
  constructor(
    private ExchangeRateServ: ExchangeRateService,
    private MessageServ: MessageService
  ) { }

  ngOnInit(): void {
    this.loadItems()
  }

  loadItems () {
    this.tableLoading = true
    this.ExchangeRateServ.load().subscribe({
      next: (res: GetExchangeRateApiResponse[]) => {
        this.tableLoading = false
        this.items = res
      },
      error: (err: any) => {
        this.tableLoading = false
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }

  deleteItem(id: number) {
    this.tableLoading = true
    this.ExchangeRateServ.delete(id).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно!', 'Перевод удален')
        this.items = this.items.filter((el: any) => el.id !== id)
        this.tableLoading = false
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        this.tableLoading = false
      }
    })
  }
}
