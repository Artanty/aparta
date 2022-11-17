import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { MessageService } from '../../shared/services/message/message.service';
import { ApartamentFeeService } from '../apartament-fee.service';
import { currancyCodes } from '../currancyCodes';

@Component({
  selector: 'app-apartament-fee-create',
  templateUrl: './apartament-fee-create.component.html',
  styleUrls: ['./apartament-fee-create.component.scss']
})
export class ApartamentFeeCreateComponent implements OnInit {

  loading: boolean = false
  apartament_id: FormControl = new FormControl(null, [Validators.required])
  name: FormControl = new FormControl(null, [Validators.required])
  description: FormControl = new FormControl(null)
  sum: FormControl = new FormControl(null)
  currancy: FormControl = new FormControl(null)
  month: FormControl = new FormControl(null)
  year: FormControl = new FormControl(null)
  paid: FormControl = new FormControl(null)

  formGroup: FormGroup = new FormGroup({
    apartament_id: this.apartament_id,
    name: this.name,
    description: this.description,
    sum: this.sum,
    currancy: this.currancy,
    month: this.month,
    year: this.year,
    paid: this.paid
  })
  yearOptions: any[] = []
  currancyOptions: any[] = []

  constructor(
    private http: HttpClient,
    private ActivatedRoute: ActivatedRoute,
    private Location: Location,
    private MessageServ: MessageService,
    private ApartamentFeeServ: ApartamentFeeService,

  ) {
    try {
      const apartament_id = this.ActivatedRoute.snapshot.paramMap.get('apartament_id')
      this.formGroup.patchValue({
        apartament_id: apartament_id
      })
    } catch (error) {
      this.Location.back()
    }
  }

  ngOnInit(): void {
    this.yearOptions = this.getYearOptions()
    this.currancyOptions = this.getCurrancyOptions()
  }

  getYearOptions() {
    const nowYear = new Date().getFullYear()
    return [
      { name: nowYear - 1, value: nowYear - 1 },
      { name: nowYear, value: nowYear },
      { name: nowYear + 1, value: nowYear + 1 }
    ]
  }

  getCurrancyOptions () {
    if (Array.isArray(currancyCodes)) {
      return currancyCodes.map((el: any) => {
        return { name: el.shortName + ' ' + el.name, value: el.code }
      })
    }
    return []
  }

  create() {
    this.loading = true
    const formGroupValue = this.formGroup.value
    let data = {
        name: formGroupValue.name,
        apartament_id: formGroupValue.apartament_id,
        description: formGroupValue.description,
        sum: formGroupValue.sum,
        currancy: formGroupValue.currancy,
        month: formGroupValue.month,
        year: formGroupValue.year,
        paid: Boolean(formGroupValue.paid)
    }
    console.log(data)
    this.ApartamentFeeServ.create(data).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Счет добавлен')
        this.Location.back()
      },
      error: (err: any) => {
        this.loading = false
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }

  back() {
    this.Location.back()
  }

}
