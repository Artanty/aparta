import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

  constructor(
    private Location: Location
  ) { }

  ngOnInit(): void {
  }

  back() {
    this.Location.back()
  }

}
