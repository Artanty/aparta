import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ChartData, ChartDataset } from 'chart.js';
import { Observable } from 'rxjs';
import { ApartamentService } from '../shared/services/apartament/apartament.service';
import { MessageService } from '../shared/services/message/message.service';
import { OrganizationService } from '../shared/services/organization/organization.service';
import { HomeService } from './home.service';
export type Organization = {
  name: string,
  barChartData: ChartData<'bar'>
}
export type ApartamentFeeWithOrganization =
  {
    "id": number
    "name": string
    "description":string | null,
    "currancy": number
    "sum": number
    "commission": number | null,
    "month": number
    "year":number
    "paid": number
    "paidDate": string
    "organization_id": number
    "organizationTariff_id":number
    "template_id": number
    "apartament_id": number
    "payVariant":number
    "creator_id": number
    "created_at": string
    "updated_at": string
    "organization": {
        "id": number
        "name": string
        "description": string
        "currancy": number | null,
        "creator_id": number
        "created_at": string
        "updated_at": string
    }
}

export interface ApartamentFeesByYear {
  [year: number]: ApartamentFeeWithOrganization[]
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  yearsBefore: FormControl = new FormControl(3)
  yearsBeforeOptions = [
    { id: 0, name: 'Только текущий год' },
    { id: 1, name: 'Предыдущий год' },
    { id: 3, name: 'Последние 3 года' },
    { id: 5, name: 'Последние 5 лет' },
    { id: 50, name: 'Все время' }
  ]
  organizations: Organization[] | any[] = []
  hiddenOrganizations: Set<number> = new Set()
  loading: boolean = true
  apartament_id: FormControl = new FormControl()
  apartamentOptions$: Observable<any[]>
  mainFilterFormGroup: FormGroup = new FormGroup({
    apartament_id: this.apartament_id,
    yearsBefore: this.yearsBefore
  })
  constructor(
    private HomeServ: HomeService,
    private OrganizationServ: OrganizationService,
    private MessageServ: MessageService,
    private ApartamentServ: ApartamentService,

  ) {

    this.mainFilterFormGroup.valueChanges.subscribe((res: any) => {
      const apartament_id = res.apartament_id
      const startDate = new Date()
      startDate.setFullYear(new Date().getFullYear() - res.yearsBefore)
      const yearFrom = startDate.getFullYear()
      const yearTo = new Date().getFullYear()
      this.getFeesOfApartamentGrouped(apartament_id, yearFrom, yearTo)
    })

    this.ApartamentServ.getApartaments().subscribe((res: any) => {
      this.mainFilterFormGroup.patchValue({
        apartament_id: res?.[0]?.id
      }, {
        emitEvent: true
      })
    })
    this.apartamentOptions$ = this.ApartamentServ.apartaments$

  }

  ngOnInit(): void {
    // this.yearsBefore.updateValueAndValidity()
  }
  arr: any = []
  obj: any = {}
  ready: any = []

  getFeesOfApartamentGrouped(apartament_id: number, yearForm: number, yearTo: number) {
    this.loading = true
    this.organizations = []
    this.HomeServ.getFeesOfApartamentGroupedBy(apartament_id, yearForm, yearTo).subscribe({
      next: (res: any) => {
        Object.entries(res).forEach(([organizationId, apartamentFeesByYear], i: number) => { // value - 2018: [{…}]
          let orgName: string = ''
          let orgId: number = 0
          const datasets: ChartDataset<'bar'>[] | any[] = []
          Object.entries(apartamentFeesByYear as ApartamentFeesByYear).forEach(([year, apartamentFeeWithOrganization], i: number) => {
            orgName = apartamentFeeWithOrganization[0].organization?.name
            orgId = apartamentFeeWithOrganization[0].organization?.id
            const dataset: ChartDataset<'bar'> = {
              data: this.buildValuesByMonths(apartamentFeeWithOrganization),
              label: year
            }
            datasets.push(dataset)
          })
          const organization = {
            name: orgName,
            id: orgId,
            barChartData: {
              labels: this.mapMonths(),
              datasets: datasets
            } as ChartData<'bar'>
          }
          this.organizations.push(organization)
        })
        this.loading = false
      }
    })
  }
  getHiddenOrganizationValue(data: number) {
    if (this.hiddenOrganizations.has(data)){
      return false
    } else {
      return true
    }
  }
  hideOrganization (id: number) {
    if (this.hiddenOrganizations.has(id)) {
      this.hiddenOrganizations.delete(id)
    } else {
      this.hiddenOrganizations.add(id)
    }
    console.log(this.hiddenOrganizations)
  }

private buildValuesByMonths (data: ApartamentFeeWithOrganization[] | any[]): number[] {
    const year = [] as any
    const months = [1,2,3,4,5,6,7,8,9,10,11,12]
    months.forEach((month: number) => {
      const feesOfMonth = data.filter((fee: ApartamentFeeWithOrganization) => fee.month === month)
      const value = feesOfMonth?.reduce((prev: any, curr: any) => {
        return prev += Math.floor(curr.sum)
      }, 0)
      year.push(value)
    })
    return year
  }

  private mapMonths (): string[] {
    let months = []
    for(let i = 0; i < 12; i++){
      const date = new Date()
      date.setMonth(i)
      const month = date.toLocaleString('default', { month: 'long' })
      months.push(month)
    }
    return months
  }
}


