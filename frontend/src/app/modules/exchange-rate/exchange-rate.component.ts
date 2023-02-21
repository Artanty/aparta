import { ExchangeRateService } from './../shared/services/exchangeRate/exchange-rate.service';

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { ApilayerApiResponse } from './exchange-rate-list/mock';

@Component({
  selector: 'app-exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.scss']
})
export class ExchangeRateComponent implements OnInit {

  constructor(
    private Location: Location,
    private ExchangeRateServ: ExchangeRateService
  ) { }

  ngOnInit(): void {
  }

  back() {
    this.Location.back()
  }

  getCourses() {
    // this.ExchangeRateServ.getCourses().subscribe({
    //   next: (res: ApilayerApiResponse) => {
    //     console.log(res)
    //   }
    // })
  }
}
