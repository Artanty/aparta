import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'

@Component({
  selector: 'app-organization-tariff',
  templateUrl: './organization-tariff.component.html',
  styleUrls: ['./organization-tariff.component.scss']
})
export class OrganizationTariffComponent implements OnInit {

  constructor(
    private Location: Location
  ) { }

  ngOnInit(): void {
  }

  back() {
    this.Location.back()
  }
}
