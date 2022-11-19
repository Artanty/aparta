import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { MessageService } from '../../shared/services/message/message.service';
// import { FeeTemplateService } from './../fee-template.service';
import { currancyCodes } from './../../shared/currancyCodes';
import { OrganizationService } from './../../shared/services/organization/organization.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-organization-create',
  templateUrl: './organization-create.component.html',
  styleUrls: ['./organization-create.component.scss']
})
export class OrganizationCreateComponent implements OnInit {

  loading: boolean = false
  name: FormControl = new FormControl(null, [Validators.required])
  description: FormControl = new FormControl(null)
  currancy: FormControl = new FormControl('_label')
  formGroup: FormGroup = new FormGroup({
    name: this.name,
    description: this.description,
    currancy: this.currancy,
  })
  yearOptions: any[] = []
  currancyOptions: any[] = []

  constructor(
    private http: HttpClient,
    private ActivatedRoute: ActivatedRoute,
    private Location: Location,
    private MessageServ: MessageService,
    private OrganizationServ: OrganizationService,

  ) {}

  ngOnInit(): void {
    this.currancyOptions = this.getCurrancyOptions()
  }

  private getCurrancyOptions () {
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
      description: formGroupValue.description,
      currancy: formGroupValue.currancy,
    }
    console.log(data)
    this.OrganizationServ.create(data).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Организация добавлена')
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
