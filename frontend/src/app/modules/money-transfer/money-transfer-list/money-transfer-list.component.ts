import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../shared/services/message/message.service';
import { LoadMoneyTransferApiResponse, MoneyTransferService } from '../../shared/services/moneyTransfer/money-transfer.service';
import { CreateMoneyTransferApiRequest, CreateMoneyTransferApiResponse } from '../../shared/services/moneyTransfer/types';
import { Router } from '@angular/router'

@Component({
  selector: 'app-money-transfer-list',
  templateUrl: './money-transfer-list.component.html',
  styleUrls: ['./money-transfer-list.component.scss']
})
export class MoneyTransferListComponent implements OnInit {
  tableLoading: boolean = false
  items: any[] = []
  constructor(
    private MoneyTransferServ: MoneyTransferService,
    private MessageServ: MessageService,
    private Router: Router
  ) { }

  ngOnInit(): void {
    this.loadItems()
  }

  loadItems () {
    this.tableLoading = true
    this.MoneyTransferServ.load().subscribe({
      next: (res: LoadMoneyTransferApiResponse[]) => {
        this.tableLoading = false
        this.items = res.sort((a: any, b: any) => {
          if (a.date > b.date) {
            return -1
          }
          if (a.date < b.date) {
            return 1
          }
          return 0
        })
      },
      error: (err: any) => {
        this.tableLoading = false
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }

  deleteItem(id: number) {
    this.tableLoading = true
    this.MoneyTransferServ.delete(id).subscribe({
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

  createCopy(formGroupValue: any) {
    this.tableLoading = true
    const data: CreateMoneyTransferApiRequest = {
      name: formGroupValue.name,
      description: formGroupValue.description,
      sourceSum: formGroupValue.sourceSum,
      sourceCurrancy: formGroupValue.sourceCurrancy,
      middleTransfers: formGroupValue.middleTransfers,
      destinationSum: formGroupValue.destinationSum,
      destinationCurrancy: formGroupValue.destinationCurrancy,
      rate: formGroupValue.rate,
      date: formGroupValue.date,
      apartament_id: formGroupValue.apartament_id,
    }
    this.MoneyTransferServ.create(data).subscribe({
      next: (res: CreateMoneyTransferApiResponse) => {
        this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Перевод добавлен')
        this.tableLoading = false
        this.loadItems()
        this.Router.navigate(['moneyTransfer/update', res.id])
      },
      error: (err: any) => {
        this.tableLoading = false
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }
}
