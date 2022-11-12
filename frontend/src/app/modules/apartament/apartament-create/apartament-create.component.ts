import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-apartament-create',
  templateUrl: './apartament-create.component.html',
  styleUrls: ['./apartament-create.component.scss']
})
export class ApartamentCreateComponent implements OnInit {
  val = ''
  result = ''
  name: FormControl = new FormControl(null)
  address: FormControl = new FormControl(null)
  country: FormControl = new FormControl(null)
  place: FormControl = new FormControl(null)
  rentType: FormControl = new FormControl(null)
  rooms: FormControl = new FormControl(null)

  apartamentCreateFormGroup: FormGroup = new FormGroup({
    name: this.name,
    address: this.address,
    country: this.country,
    place: this.place,
    rentType: this.rentType,
    rooms: this.rooms
  })

  constructor(
    private http: HttpClient,
    private ActivatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    // this.read()
  }
  showWarning: boolean = false
  create() {
    const apartamentCreateFormGroupValues = this.apartamentCreateFormGroup.value
    let data = {
      name: apartamentCreateFormGroupValues.name,
      address: apartamentCreateFormGroupValues.address,
      country: apartamentCreateFormGroupValues.country,
      place: apartamentCreateFormGroupValues.place,
      rentType: apartamentCreateFormGroupValues.rentType,
      rooms: apartamentCreateFormGroupValues.rooms
    }

    this.http.post(`apartament`, data).subscribe(
      (res: any) => {

      }
    )

  }


}
