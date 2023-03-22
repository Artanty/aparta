import { Component, Input, OnInit } from '@angular/core';
import { EExchangeRateSource } from '@app/modules/apartament-fee/apartament-fee-create/apartament-fee-create.component';
import { ECurrencyPipeResultSource, ECurrencyPipeStatus } from '@pipes/currency-value/enums';
import { TCurrencyPipe } from '@pipes/currency-value/types';

@Component({
  selector: 'app-currancy-table-cell',
  templateUrl: './currancy-table-cell.component.html',
  styleUrls: ['./currancy-table-cell.component.scss']
})
export class CurrancyTableCellComponent implements OnInit {
  @Input() data: TCurrencyPipe | null = null

  ECurrencyPipeStatus = ECurrencyPipeStatus
  EExchangeRateSource = EExchangeRateSource
  ECurrencyPipeResultSource = ECurrencyPipeResultSource
  statusIconHoverBlockVisible: boolean = false
  constructor() { }

  ngOnInit(): void {
  }

}
