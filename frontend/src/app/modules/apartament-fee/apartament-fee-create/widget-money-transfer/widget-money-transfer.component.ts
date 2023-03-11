import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { currancyCodes } from 'src/app/modules/shared/currancyCodes';
import { Currancy } from 'src/app/modules/shared/features/widget-exchange-rate/widget-exchange-rate.component';
import { MessageService } from '../../../shared/services/message/message.service';
import { LoadMoneyTransferApiResponse, MoneyTransferService } from '../../../shared/services/moneyTransfer/money-transfer.service';

@Component({
  selector: 'app-widget-money-transfer',
  templateUrl: './widget-money-transfer.component.html',
  styleUrls: ['./widget-money-transfer.component.scss']
})
export class WidgetMoneyTransferComponent implements OnInit, OnChanges {
  @Input() date: string = new Date().toString()
  @Input() destinationCurrancy: number = 0
  @Output() selectTransferAway: EventEmitter<LoadMoneyTransferApiResponse> = new EventEmitter<LoadMoneyTransferApiResponse>()
    tableLoading: boolean = false
    items: any[] = []
    itemsBeforeFilter: any[] = []
    currancyOptions: any[] = []
    innerSourceCurrancy: number = 643

    selectedTransfer?: any

    constructor(
      private MoneyTransferServ: MoneyTransferService,
      private MessageServ: MessageService
    ) { }

    ngOnInit(): void {
      this.loadItems()
      this.currancyOptions = this.getCurrancyOptions()
    }

    ngOnChanges(changes: SimpleChanges) {
      if ((changes['date']?.previousValue !== changes['date']?.currentValue) && changes['date']?.currentValue) {
        if (this.items) {
          this.searchClosestDate()
        }
      }
      if ((changes['destinationCurrancy']?.previousValue !== changes['destinationCurrancy']?.currentValue) && changes['destinationCurrancy']?.currentValue) {
        if (this.items) {
          this.searchClosestDate()
        }
      }

    }

    searchClosestDate () {
      this.items = this.itemsBeforeFilter.filter((el: any) => {
        return (el.date < this.date) &&
        (+el.destinationCurrancy === +this.destinationCurrancy) &&
        (+el.sourceCurrancy === +this.innerSourceCurrancy)
      })
      this.selectedTransfer = this.items[0]
      if (this.selectedTransfer) {
        this.selectTransferAway.emit(this.selectedTransfer)
      }
    }

    selectTransfer (item: any) {
      this.selectedTransfer = item
      this.selectTransferAway.emit(item)
    }

    loadItems () {
      this.tableLoading = true
      this.MoneyTransferServ.load().subscribe({
        next: (res: LoadMoneyTransferApiResponse[]) => {
          this.tableLoading = false
          this.itemsBeforeFilter = this.items = res.sort((a: any, b: any) => {
            if (a.date > b.date) {
              return -1
            }
            if (a.date < b.date) {
              return 1
            }
            return 0
          })
          this.searchClosestDate()
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

    getCurrancyShortName (currancyCode: number | string | undefined): string | undefined {
      if (currancyCode) {
        return currancyCodes.find((el: Currancy) => {
          return Number(currancyCode) === el.code
        })?.shortName
      } else {
        return undefined
      }
    }

    private getCurrancyOptions () {
      if (Array.isArray(currancyCodes)) {
        return currancyCodes.slice(0, 4).map((el: {
          shortName: string
          code: number
          name: string
          sign?: string
        }) => {
          return { name: el.sign || el.shortName, id: el.code }
        })
      }
      return []
    }
  }
