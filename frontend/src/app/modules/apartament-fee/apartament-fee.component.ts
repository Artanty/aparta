import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { currancyCodes } from './../shared/currancyCodes';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-apartament-fee',
  templateUrl: './apartament-fee.component.html',
  styleUrls: ['./apartament-fee.component.scss']
})
export class ApartamentFeeComponent implements OnInit {

  apartament_id: string
  amount: number = 0
  currancy: FormControl = new FormControl(941)
  currancyOptions: any[] = []

  constructor(
    private http: HttpClient,
    private ActivatedRoute: ActivatedRoute,
    private Location: Location
  ) {
    this.currancyOptions = this.getCurrancyOptions()
    this.apartament_id = this.ActivatedRoute.snapshot.paramMap.get('apartament_id') || ''
  }

  ngOnInit(): void {

  }

  setAmount(data: any) {
    this.amount = data
  }

  back() {
    this.Location.back()
  }

  private getCurrancyOptions () {
    if (Array.isArray(currancyCodes)) {
      return currancyCodes.slice(0, 4).map((el: any) => {
        return { name: el.sign || el.shortName, id: el.code }
      })
    }
    return []
  }
}
