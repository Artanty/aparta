import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { combineLatest, combineLatestWith, concat, finalize, map, Observable, of, startWith, Subscription, withLatestFrom } from 'rxjs';
import { ApartamentFeeService } from '../apartament-fee.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MessageService } from '../../shared/services/message/message.service';
import { orderBy, removeDuplicatedObj } from '../../shared/helpers';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-apartament-fee-list',
  templateUrl: './apartament-fee-list.component.html',
  styleUrls: ['./apartament-fee-list.component.scss']
})
export class ApartamentFeeListComponent implements OnInit {
  @ViewChild ('popoverTrigger') popoverTrigger: ElementRef | undefined
  apartament_id: string
  tableLoading$: Observable<boolean>
  items1$?: Observable<any>
  items$?: Observable<any>
  selectedItemsSet = new Set()
  name: FormControl = new FormControl(null)
  year: FormControl = new FormControl(null)
  filterFormGroup: FormGroup = new FormGroup({
    emitter: new FormControl(null),
    name: this.name,
    year: this.year
  })
  sortFormGroup: FormGroup = new FormGroup({
    sum: new FormControl(0),
    month: new FormControl(0)
  })
  nameOptions: any[] = []
  yearOptions: any[] = []
  constructor(
    private ApartamentFeeServ: ApartamentFeeService,
    private ActivatedRoute: ActivatedRoute,
    private MessageServ: MessageService
  ) {
    this.ApartamentFeeServ.setApartamentFeesLoading(true)
    this.tableLoading$ = this.ApartamentFeeServ.apartamentFeesLoading$
    this.apartament_id = this.ActivatedRoute.snapshot.paramMap.get('apartament_id') || ''
    let obs$: Observable<any>
    const mapPipe = (res: any) => {
      this.nameOptions = orderBy(removeDuplicatedObj(res, 'name'), 'name', 'desc')
      this.yearOptions = orderBy(removeDuplicatedObj(res, 'year'), 'year', 'desc').map((el: any) => ({ name: el.year, value: el.year }))
      return orderBy(res, 'paidDate', 'asc')
    }
    if (this.apartament_id) {
      obs$ = this.ApartamentFeeServ.getFeesOfApartament(+this.apartament_id)
      this.items1$ = this.ApartamentFeeServ.apartamentFees$.pipe(
        map(mapPipe),
        combineLatestWith(this.filterFormGroup.valueChanges, this.sortFormGroup.valueChanges),
        map((res: any) => {
          console.log(res)
          return res
        })
      )
    } else {
      obs$ = this.ApartamentFeeServ.getAllFees()
      this.items$ = this.ApartamentFeeServ.allFees$.pipe(
        map(mapPipe),
        combineLatestWith(this.filterFormGroup.valueChanges, this.sortFormGroup.valueChanges),
        map((res: any) => {
          console.log(res)
          let items = res[0]
          const filters = res[1]
          const sort = res[2]
          if (filters) {
            items = items.filter((el: any) => {
              let itemFiltered: boolean = false
              let result = true
              // if (filters.name) {
              //   result = el.name === filters.name
              // }
              // if (filters.year && filters.year !== null) {
              //   console.log(filters.year)
              //   result = +el.year === +filters.year
              // }
              Object.keys(filters).forEach((filter: any) => {
                if (filters[filter] && !itemFiltered) {
                  result = String(el[filter]) === String(filters[filter])
                  if (result === false) {
                    itemFiltered = true
                  }
                }
              })
              return result
            })
          }
          if (sort.sum && sort.sum !== 0) {
            items = orderBy(items, 'sum', sort.sum > 0 ? 'asc' : 'desc')
          } else if (sort.month && sort.month !== 0) {
            const format = (month: number) => {
              const date = new Date()
              return date.setMonth(month)
            }
            items = orderBy(items, 'month', sort.month > 0 ? 'asc' : 'desc', format)
          } else if (sort.year && sort.year !== 0) {
            // items = orderBy(items, 'year', sort.year > 0 ? 'asc' : 'desc')
          } else {
            items = orderBy(items, 'name', 'asc')
          }
          return items
        })
      )
      // this.items$ = combineLatest(items: this.items$, this.filterFormGroup.valueChanges)
    }

    obs$.subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', '', 'Счетa загружены')
        this.ApartamentFeeServ.setApartamentFeesLoading(false)
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        this.ApartamentFeeServ.setApartamentFeesLoading(false)
      }
    })
  }

  ngOnInit(): void {
    setTimeout(()=>{
      this.filterFormGroup.patchValue({
        name: null,
        year: null
      })
      this.sortFormGroup.patchValue({
        sum: 0,
        month: 0
      })
    },500)
  }

  tableSort(column: string){
    let value: number
    const currentValue = this.sortFormGroup.controls[column].value
    if (currentValue === 1) value = 0
    if (currentValue === 0) value = -1
    if (currentValue === -1) value = 1
    const patchObject = Object.keys(this.sortFormGroup.controls)
    .reduce((acc: any, key: string) => {
      return {
        ...acc,
        [key]: key === column ? value : 0
      }
    }, {})
    this.sortFormGroup.patchValue(patchObject)
  }

  selectItem (id: number) {
    if (this.selectedItemsSet.has(id)) {
      this.selectedItemsSet.delete(id)
    } else {
      this.selectedItemsSet.add(id)
    }
  }

  delete(id: number) {
    this.ApartamentFeeServ.setApartamentFeesLoading(true)
    this.ApartamentFeeServ.delete(id).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно!', 'Счет удален')
        this.ApartamentFeeServ.setApartamentFeesLoading(false)
        this.selectedItemsSet.delete(id)
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        this.ApartamentFeeServ.setApartamentFeesLoading(false)
      }
    })
  }

  deleteSelected () {
    concat(Array.from(this.selectedItemsSet).map((id: any) => this.delete(id))).pipe(
      finalize(() => {
        // this.MessageServ.sendMessage('success', 'Успешно!', 'Выбранные счета удалены')
      })
    ).subscribe()

  }
  filterFormGroupResetControl(controlName: string) {
    this.filterFormGroup.controls[controlName]?.reset()
  }
}
