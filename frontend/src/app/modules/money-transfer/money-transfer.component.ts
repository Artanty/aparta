import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
@Component({
  selector: 'app-money-transfer',
  templateUrl: './money-transfer.component.html',
  styleUrls: ['./money-transfer.component.scss']
})
export class MoneyTransferComponent implements OnInit {

  constructor(
    private Location: Location
  ) { }

  ngOnInit(): void {
  }

  back() {
    this.Location.back()
  }
}
