import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';


@Component({
  selector: 'app-apartament',
  templateUrl: './apartament.component.html',
  styleUrls: ['./apartament.component.scss']
})
export class ApartamentComponent implements OnInit {
  private baseUrl = environment.baseUrl;
  // create
  name = 'Квартира Пушкин'
  address = 'Хазова, д. 3, кв. 104'
  country = 'Россия'
  place = 'Санкт-Петербург'
  rentType = 0
  rooms = 2
  //read
  items: any = []
  //update
  update_id = ''
  update_name = ''
  update_address = ''
  update_country = ''
  update_place = ''
  update_rentType = ''
  update_rooms = ''
  constructor(
    private http: HttpClient,
    private ActivatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    // this.read()
  }

  create() {
    let data = {
      name: this.name,
      address: this.address,
      country: this.country,
      place: this.place,
      rentType: this.rentType,
      rooms: this.rooms
    }
    data = {
      address: "Хазова, д. 3, кв. 104",
      country: "Россия",
      name: "Квартира Пушкин",
      place: "Санкт-Петербург",
      rentType: 0,
      rooms: 2
    }
    data = {
      address: "Проспект Славы, д. 23, кв. 186",
      country: "Россия",
      name: "Квартира Слава",
      place: "Санкт-Петербург",
      rentType: 0,
      rooms: 1
    }
    data = {
      address: "Tošin bunar, 270",
      country: "Сербия",
      name: "Квартира Белград",
      place: "Белград",
      rentType: 1,
      rooms: 1
    }

    this.http.post(`apartament`, data).subscribe(
      (res: any) => {
        this.items.push(res)
      }
    )
    // console.log(data)
  }

  read() {
    this.http.get(`${this.baseUrl}/apartament`).pipe(
      map((res: any) => {
        return res
      })
    ).subscribe({
      next: (res: any) => {
        this.items = res

      },
      error: (err: any) => {
        alert(err.message)
      }
    })
  }


  placeToUpdate(item: any) {
    this.update_id = item.id
    this.update_name = item.name
    this.update_address = item.address
    this.country = item.country
    this.place = item.place
    this.rentType = item.rentType
    this.rooms = item.rooms
  }
  update(){
    const data = {
      id: this.update_id,
      name: this.update_name,
      address: this.update_address,
      country: this.country,
      place: this.place,
      rentType: this.rentType,
      rooms: this.rooms
    }
    this.http.put(`${this.baseUrl}/apartament/${data.id}`, data).subscribe({
      next: (res: any) => {
        this.items = this.items.map((el: any) => {
          if (el.id === res.id) {
            el = { ...el, ...res }
          }
          return el
        })
      }
    }
    )
  }
  delete(id: number) {
    this.http.delete(`${this.baseUrl}/apartament/${id}`).subscribe(res=> this.items = this.items.filter((el: any) => el.id !== id))
  }

}
