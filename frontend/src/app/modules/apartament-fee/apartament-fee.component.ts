import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'

@Component({
  selector: 'app-apartament-fee',
  templateUrl: './apartament-fee.component.html',
  styleUrls: ['./apartament-fee.component.scss']
})
export class ApartamentFeeComponent implements OnInit {

  apartament_id: string
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
    private ActivatedRoute: ActivatedRoute,
    private Location: Location
  ) {
    this.apartament_id = this.ActivatedRoute.snapshot.paramMap.get('apartament_id') || ''
  }

  ngOnInit(): void {

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
    this.http.put(`apartamentFee/${data.id}`, data).subscribe({
      next: (res: any) => {

      }
    }
    )
  }

  back() {
    this.Location.back()
  }

}
