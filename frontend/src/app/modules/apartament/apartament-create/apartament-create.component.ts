import { ApartamentService } from '../../shared/services/apartament/apartament.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ControlContainer, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../shared/services/message/message.service';
import { Location } from '@angular/common'


@Component({
  selector: 'app-apartament-create',
  templateUrl: './apartament-create.component.html',
  styleUrls: ['./apartament-create.component.scss'],

})
export class ApartamentCreateComponent implements OnInit {

  loading: boolean = false
  name: FormControl = new FormControl(null, [Validators.required])
  address: FormControl = new FormControl(null, [Validators.required])
  country: FormControl = new FormControl(null)
  place: FormControl = new FormControl(null)
  rentType: FormControl = new FormControl(null)
  rooms: FormControl = new FormControl(null)

  formGroup: FormGroup = new FormGroup({
    name: this.name,
    address: this.address,
    country: this.country,
    place: this.place,
    rentType: this.rentType,
    rooms: this.rooms
  })

  constructor(
    private http: HttpClient,
    private Location: Location,
    private MessageServ: MessageService,
    private ApartamentServ: ApartamentService
  ) {
  }

  ngOnInit(): void {
  }

  create() {
    if (!this.formGroup.valid) {
      Object.keys(this.formGroup.controls).forEach((field: string) => {
        const control = this.formGroup.get(field)
        if (control?.invalid) {
          control?.markAsTouched({ onlySelf: true })
        }
      })
      return
    }
    this.loading = true
    const formGroupValue = this.formGroup.value
    let data = {
      name: formGroupValue.name,
      address: formGroupValue.address,
      country: formGroupValue.country,
      place: formGroupValue.place,
      rentType: formGroupValue.rentType,
      rooms: formGroupValue.rooms
    }

    this.http.post(`apartament`, data).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', '?????????????? ??????????????????!', '???????????????? ??????????????????')
        this.ApartamentServ.clearApartaments().then(()=> {
          this.Location.back()
        })
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', '????????????!', err.error.message)
      },
      complete: () => {
        this.loading = false
      }
    })
  }

  back() {
    this.Location.back()
  }
}
