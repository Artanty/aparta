import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-apartament-fee',
  templateUrl: './apartament-fee.component.html',
  styleUrls: ['./apartament-fee.component.scss']
})
export class ApartamentFeeComponent implements OnInit {

  private baseUrl = environment.baseUrl;
  // create
  apartament_id = ''
  name = 'газ'
  description = ''
  sum = 500
  currancy = 1
  month = 10
  year = 2022
  paid = false
  //read
  items: any = []
  //update
  update_id = ''
  update_name = ''
  update_apartament_id = ''
  update_description = ''
  update_sum = null
  update_currancy = null
  update_month = null
  update_year = null
  update_paid = false

  constructor(
    private http: HttpClient,
    private ActivatedRoute: ActivatedRoute
  ) {
    this.apartament_id = this.ActivatedRoute.snapshot.paramMap.get('apartament_id') || ''
  }

  ngOnInit(): void {
    this.read()
  }

  create() {
    const data = {
        name: this.name,
        apartament_id: this.apartament_id,
        description: this.description,
        sum: this.sum,
        currancy: this.currancy,
        month: this.month,
        year: this.year,
        paid: this.paid
    }
    this.http.post(`${this.baseUrl}/apartamentFee`, data).subscribe(
      (res: any) => {
        this.items.push(res)
      }
    )
  }

  read() {
    const url = this.apartament_id ?
    `${this.baseUrl}/apartament/getApartamentFees/${this.apartament_id}` :
    `${this.baseUrl}/apartamentFee`
    this.http.get(url).subscribe({
      next: (res: any) => {
        if (Array.isArray(res)){
          this.items = res
        }
      },
      error: (err: any) => {
        alert(err.message)
      }
    })
  }
  placeToUpdate(item: any) {
    this.update_id = item.id
    this.update_name = item.name
    this.update_apartament_id = item.apartament_id
    this.update_description = item.description
    this.update_sum = item.sum
    this.update_currancy = item.currancy
    this.update_month = item.month
    this.update_year = item.year
    this.update_paid = item.paid
  }
  update(){
    const data = {
      id: this.update_id,
      name: this.update_name,
      apartament_id: this.update_apartament_id,
      description: this.update_description,
      sum: this.update_sum,
      currancy: this.update_currancy,
      month: this.update_month,
      year: this.update_year,
      paid: this.update_paid
  }
    this.http.put(`${this.baseUrl}/apartamentFee/${data.id}`, data).subscribe({
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
    this.http.delete(`${this.baseUrl}/apartamentFee/${id}`).subscribe(res=> this.items = this.items.filter((el: any) => el.id !== id))
  }

}
