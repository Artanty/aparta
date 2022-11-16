import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ControlContainer, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../shared/services/message/message.service';
import { Location } from '@angular/common'
import { GetApartamentsApiResponse } from '../apartament-list/apartament-list.component';
import { ThisReceiver } from '@angular/compiler';
import { ApartamentService } from '../apartament.service';

@Component({
  selector: 'app-apartament-update',
  templateUrl: './apartament-update.component.html',
  styleUrls: ['./apartament-update.component.scss']
})
export class ApartamentUpdateComponent implements OnInit {

  loading: boolean = true
  apartament_id?: number

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
    private ActivatedRoute: ActivatedRoute,
    private ApartamentServ: ApartamentService
  ) {
    try {
      this.apartament_id = Number(this.ActivatedRoute.snapshot.paramMap.get('apartament_id'))
      this.getApartament(this.apartament_id)
    } catch (error) {
      this.MessageServ.sendMessage('error', 'Ошибка!', String(error))
      this.Location.back()
    }
  }

  ngOnInit(): void {
  }

  getApartament(id: number) {
    this.loading = true
    this.http.get<GetApartamentsApiResponse>(`apartament/${id}`).subscribe({
      next: (apartament: any) => {
        this.formGroup.patchValue({
          name: apartament.name,
          address: apartament.address,
          country: apartament.country,
          place: apartament.place,
          rentType: apartament.rentType,
          rooms: apartament.rooms
        })
        if (apartament.place === 'Санкт-Петербург'){
          apartament.placeEng = 'saint-petersburg-city'
        } else if (apartament.place === 'Белград') {
          apartament.placeEng = 'belgrade-city'
        }
        this.getPlaceAvatar(apartament.placeEng).then((ava) => {
          apartament.avatar = ava
        })

      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      },
      complete: () =>{
        this.loading = false
      }
    })
  }

  update() {
    if (!this.formGroup.valid) {
      Object.keys(this.formGroup.controls).forEach((field: string) => {
        const control = this.formGroup.get(field)
        if (control?.invalid) {
          control?.markAsTouched({ onlySelf: true })
        }
      })
      return
    }
    const formGroupValue = this.formGroup.value
    let data = {
      name: formGroupValue.name,
      address: formGroupValue.address,
      country: formGroupValue.country,
      place: formGroupValue.place,
      rentType: formGroupValue.rentType,
      rooms: formGroupValue.rooms
    }
    this.loading = true
    this.http.put(`apartament/${this.apartament_id}`, data).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Квартира изменена')
        this.ApartamentServ.clearApartaments()
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      },
      complete: () => {
        this.loading = false
      }
    })
  }

  back() {
    this.Location.back()
  }

  async getPlaceAvatar(query: string) {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`api.unsplash.com/search/photos?page=1&query=${query}`).subscribe({
        next: (res: any) => {
          resolve(res?.results?.[0]?.urls?.thumb)
        },
        error: (err: any) => {
          reject(err.message)
        }
      })
    })
  }
}
