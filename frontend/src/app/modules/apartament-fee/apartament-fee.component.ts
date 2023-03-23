import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd, ActivatedRoute, ActivationEnd } from '@angular/router';
import { Location } from '@angular/common'
import { currancyCodes } from './../shared/currancyCodes';
import { FormControl } from '@angular/forms';
import { filter, Observable, tap } from 'rxjs';
import { ApartamentService } from '../shared/services/apartament/apartament.service';


@Component({
  selector: 'app-apartament-fee',
  templateUrl: './apartament-fee.component.html',
  styleUrls: ['./apartament-fee.component.scss']
})
export class ApartamentFeeComponent implements OnInit {
  Number = Number
  apartament_id: string = ''
  amount: number = 0
  dangers: any[] = []
  currancy: FormControl = new FormControl(941)
  currancyOptions: any[] = []
  apartament: FormControl = new FormControl()
  apartamentOptions$: Observable<any[]>
  year: FormControl = new FormControl(new Date().getFullYear())
  yearOptions: number[] = []
  constructor(
    private http: HttpClient,
    private ActivatedRoute: ActivatedRoute,
    private Location: Location,
    private ApartamentServ: ApartamentService,
    private Router: Router
  ) {
    for(let i = new Date().getFullYear(); i >= 2018; i--) {
      this.yearOptions.push(i)
    }
    this.ApartamentServ.getApartaments().subscribe()
    this.currancyOptions = this.getCurrancyOptions()
    this.currancy.valueChanges.subscribe((res: any) => this.saveCurrancy(res))

    this.ActivatedRoute.params.subscribe((res: any) => {
      if (res.apartament_id) {
        this.apartament_id = res.apartament_id
        this.apartament.setValue(+this.apartament_id)
      }
    })
    this.apartamentOptions$ = this.ApartamentServ.apartaments$
    this.apartament.valueChanges.subscribe((res: string | null) => {
      if (res) {
        this.Router.navigateByUrl(this.Router.url.replace(this.apartament_id, res))
      }
    })
    this.year.valueChanges.subscribe((res: any) => {
      if (res) {

      }
    })
  }

  ngOnInit(): void {
    this.loadCurrancy()

  }

  setAmount(data: any) {
    this.dangers = data.dangers
    this.amount = data.value
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
