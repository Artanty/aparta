import { ExchangeRateService } from './exchange-rate.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'

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
    this.ExchangeRateServ.getCourses()
    // .subscribe({
    //   next: (res: any) => {
    //     console.log(res)
    //   }
    // })
  }
}
