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
    this.currancy.valueChanges.subscribe((res: any) => this.saveCurrancy(res))
    this.apartament_id = this.ActivatedRoute.snapshot.paramMap.get('apartament_id') || ''
  }

  ngOnInit(): void {
    this.loadCurrancy()
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

  private saveCurrancy(data: any) {
    localStorage.setItem('apartamentFee_currancy', String(data))
  }

  private loadCurrancy() {
    const currancy = localStorage.getItem('apartamentFee_currancy')
    if (currancy){
      this.currancy.setValue(Number(currancy))
    }
  }
}
