import { Component, ElementRef, OnDestroy, OnInit, Output, ViewChild, EventEmitter, Input } from '@angular/core';
import { combineLatest, combineLatestWith, concat, filter, finalize, map, Observable, of, startWith, Subscription, tap, withLatestFrom } from 'rxjs';
import { ApartamentFeeService } from '../../shared/services/apartamentFee/apartament-fee.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MessageService } from '../../shared/services/message/message.service';
import { isNonNull, orderBy, removeDuplicatedObj } from '../../shared/helpers';
import { FormControl, FormGroup } from '@angular/forms';
import { GetCurrancyPipe } from '../../shared/pipes/get-currancy.pipe';
// import { GetCurrancyPipe } from ''

@Component({
  selector: 'app-apartament-fee-list',
  templateUrl: './apartament-fee-list.component.html',
  styleUrls: ['./apartament-fee-list.component.scss']
})
export class ApartamentFeeListComponent implements OnInit, OnDestroy {

  currancy: number = 941
  @Input() set _currancy(value: number) {
    this.currancy = value;
    setTimeout(() => {
      this.filterFormGroup.updateValueAndValidity()
    }, 0)
  }
  @Output() amountOut: EventEmitter<number> = new EventEmitter<number>()
  @ViewChild ('popoverTrigger') popoverTrigger: ElementRef | undefined
  apartament_id: string = ''
  tableLoading$: Observable<boolean>
  items$?: Observable<any>
  selectedItemsSet = new Set()
  name: FormControl = new FormControl(null)
  month: FormControl = new FormControl(null)
  year: FormControl = new FormControl(null)
  filterFormGroup: FormGroup = new FormGroup({
    name: this.name,
    month: this.month,
    year: this.year
  })
  sortFormGroup: FormGroup = new FormGroup({
    sum: new FormControl(0),
    month: new FormControl(0),
    paidDate: new FormControl(1),
    created_at: new FormControl(0)
  })
  nameOptions: any[] = []
  yearOptions: any[] = []
  subs$?: Subscription

  constructor(
    private ApartamentFeeServ: ApartamentFeeService,
    private ActivatedRoute: ActivatedRoute,
    private MessageServ: MessageService
  ) {
    this.ApartamentFeeServ.setLoading(true)
    this.tableLoading$ = this.ApartamentFeeServ.loading$

    // console.log(this.apartament_id)
    let obs$: Observable<any>
    const mapPipeSetSelectOptions = (res: any) => {
      this.nameOptions = orderBy(removeDuplicatedObj(res, 'name'), 'name', 'desc')
      this.yearOptions = orderBy(removeDuplicatedObj(res, 'year'), 'year', 'desc').map((el: any) => ({ name: el.year, value: el.year }))
      return orderBy(res, 'paidDate', 'asc', (el: any)=> new Date(el.paidDate).getTime())
    }
    const mapPipeFilterAndSort = (res: any) => {
      this.saveTableState()
      let items = res[0]
      const filters = res[1]
      const sort = res[2]
      if (filters) {
        items = items.filter((el: any) => {
          let itemFiltered: boolean = false
          let result = true
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
        const format = (obj: any) => {
          if (obj.currancy !== this.currancy) {
            return new GetCurrancyPipe().transform(obj, 'currancy', 'sum', this.currancy)
          }
          return obj.sum
        }
        items = orderBy(items, 'sum', sort.sum > 0 ? 'asc' : 'desc', format)
      } else if (sort.month && sort.month !== 0) {
        const format = (obj: any) => {
          const date = new Date()
          return date.setMonth(obj.month)
        }
        items = orderBy(items, 'month', sort.month > 0 ? 'asc' : 'desc', format)
      } else if (sort.paidDate && sort.paidDate !== 0) {
        items = orderBy(items, 'paidDate', sort.paidDate > 0 ? 'asc' : 'desc', (el: any)=> new Date(el.paidDate).getTime())
      } else if (sort.created_at && sort.created_at !== 0){
        items = orderBy(items, 'paidDate', sort.created_at > 0 ? 'asc' : 'desc', (el: any)=> new Date(el.created_at).getTime())
      } else {
        items = orderBy(items, 'name', 'asc')
      }
      return items
    }
    const mapPipeCountAmount = (res: any) => {
      let amount = res.reduce((accumulator: any, current: any) => {
        let currentValue = current.sum
        if (current.currancy !== this.currancy) {
          currentValue = new GetCurrancyPipe().transform(current, 'currancy', 'sum', this.currancy)
        }
        return accumulator + +currentValue
      }, 0)
      this.amountOut.emit(amount)
      return res
    }
    this.ActivatedRoute.params.subscribe((res: any) => {
      if (res.apartament_id && res.apartament_id !== 'all') {
        this.apartament_id = res.apartament_id
        this.ApartamentFeeServ.getFees(+this.apartament_id, true).subscribe()
      }
      if (res.apartament_id && res.apartament_id === 'all') {
        this.apartament_id = ''
        this.ApartamentFeeServ.getFees('all', true).subscribe()
      }
    })
    obs$ = this.ApartamentFeeServ.fees$
    this.items$ = this.ApartamentFeeServ.fees$.pipe(
      filter(isNonNull),
      map(mapPipeSetSelectOptions),
      combineLatestWith(this.filterFormGroup.valueChanges, this.sortFormGroup.valueChanges),
      map(mapPipeFilterAndSort),
      map(mapPipeCountAmount)
    )

    this.subs$ = obs$.subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', '', 'Счетa загружены')
        this.ApartamentFeeServ.setLoading(false)
        setTimeout(()=>{
          this.loadTableState()
        }, 0)
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        this.ApartamentFeeServ.setLoading(false)
      }
    })
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy (): void {
    // console.log('destroyed')
    this.subs$?.unsubscribe()
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
    this.ApartamentFeeServ.setLoading(true)
    this.ApartamentFeeServ.delete(id).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно!', 'Счет удален')
        this.ApartamentFeeServ.setLoading(false)
        this.selectedItemsSet.delete(id)
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        this.ApartamentFeeServ.setLoading(false)
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
  saveTableState() {
    const data = {
      sort: this.sortFormGroup.value,
      filter: this.filterFormGroup.value
    }
    localStorage.setItem('apartamentFeeList', JSON.stringify(data))
  }
  loadTableState(){
    const state = localStorage.getItem('apartamentFeeList')
    if (state) {
      // console.log(JSON.parse(state).filter)
      this.sortFormGroup.patchValue(JSON.parse(state).sort)
      this.filterFormGroup.patchValue(JSON.parse(state).filter)
    } else {
      this.filterFormGroup.updateValueAndValidity()
      this.sortFormGroup.updateValueAndValidity()
    }
  }
}
