import { Component, OnInit,  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'


@Component({
  selector: 'app-apartament-user',
  templateUrl: './apartament-user.component.html',
  styleUrls: ['./apartament-user.component.scss']
})
export class ApartamentUserComponent implements OnInit {
  private baseUrl = environment.baseUrl;

  // before create
  user_email = 'pelmen@gmail.com'

  // create
  apartament_id = ''
  apartament_name = ''
  user_id = 6
  user_name = ''

  //read
  items: any = []
  //update
  update_id = ''
  update_name = ''
  update_address = ''
  constructor(
    private http: HttpClient,
    private ActivatedRoute: ActivatedRoute,
    private Location: Location
  ) {
    this.apartament_id = this.ActivatedRoute.snapshot.paramMap.get('apartament_id') || ''

  }

  ngOnInit(): void {
    this.read()
  }

  read() {
    // this.http.get(`apartament/getApartamentUsers/${this.apartament_id}`).subscribe({
    //   next: (res: any) => {
    //     this.items = res
    //   },
    //   error: (err: any) => {
    //     alert(err.message)
    //   }
    // })
  }
  placeToUpdate(item: any) {
    this.update_id = item.id
    this.update_name = item.name
    this.update_address = item.address
  }
  update(){
    const data = {
      id: this.update_id,
      name: this.update_name,
      address: this.update_address
    }
    this.http.put(`apartamentUser/${data.id}`, data).subscribe({
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
    this.http.delete(`apartamentUser/${id}`).subscribe(res=> {
      this.items = this.items.filter((el: any) => el.id !== id)
    })
  }
  back() {
    this.Location.back()
  }

}
