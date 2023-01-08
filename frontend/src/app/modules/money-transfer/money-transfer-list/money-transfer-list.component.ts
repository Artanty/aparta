import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../shared/services/message/message.service';
import { MoneyTransferService } from '../money-transfer.service';

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
    private MessageServ: MessageService
  ) { }

  ngOnInit(): void {
    this.loadItems()
  }

  loadItems () {
    this.tableLoading = true
    this.MoneyTransferServ.load().subscribe({
      next: (res: any) => {
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
}
