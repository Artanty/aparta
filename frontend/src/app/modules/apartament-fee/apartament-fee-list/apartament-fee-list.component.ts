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
  name: FormControl = new FormControl('электро пушкин')
  filterFormGroup: FormGroup = new FormGroup({
    emitter: new FormControl(null),
    name: this.name
  })
  sortFormGroup: FormGroup = new FormGroup({
    sum: new FormControl(0)
  })
  names: any[] = []
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
      this.names = orderBy(removeDuplicatedObj(res, 'name'), 'name', 'desc')
      this.names.unshift({ name: 'Все' })
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
          if (filters.name) {
            items = items.filter((el: any) => {
              if (filters.name && filters.name !== 'Все') {
                return el.name === filters.name
              }
              return true
            })
          }
          if (sort.sum && sort.sum !== 0) {
            console.log(sort)
            items = orderBy(items, Object.keys(sort)[0], sort.sum > 0 ? 'asc' : 'desc')
          } else {
            console.log(888)
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
        name: null
      })
      this.sortFormGroup.patchValue({
        sum: 0
      })
    },500)
  }

  tableSort(column: string){
    let value
    const currentValue = this.sortFormGroup.controls['sum'].value
    if (currentValue === 1) value = 0
    if (currentValue === 0) value = -1
    if (currentValue === -1) value = 1
    this.sortFormGroup.patchValue({
      [column]: value
    })
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

}
