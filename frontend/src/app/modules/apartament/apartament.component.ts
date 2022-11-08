import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-apartament',
  templateUrl: './apartament.component.html',
  styleUrls: ['./apartament.component.scss']
})
export class ApartamentComponent implements OnInit {
  private baseUrl = environment.baseUrl;

  name = ''
  address = ''
  //read
  items: any = []
  //update
  update_id = ''
  update_name = ''
  update_address = ''
  constructor(
    private http: HttpClient,
    private ActivatedRoute: ActivatedRoute
  ) {
    this.ActivatedRoute.paramMap.subscribe(res => console.log(res))
  }

  ngOnInit(): void {
    this.read()
  }
  setRequestOptions() {
    const token = localStorage.getItem('token')

    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Authorization': `Bearer ${token}`
    }
    const requestOptions = {
      headers: new HttpHeaders(header),
    };
    return requestOptions
  }
  create() {
    const data = {
      name: this.name,
      address: this.address,
    }
    this.http.post(`${this.baseUrl}/apartament`, data).subscribe(
      (res: any) => {
        this.items.push(res)
      }
    )
  }

  read() {
    this.http.get(`${this.baseUrl}/apartament`).subscribe({
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
  }
  update(){
    const data = {
      id: this.update_id,
      name: this.update_name,
      address: this.update_address
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
