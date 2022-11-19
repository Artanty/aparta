import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'

@Component({
  selector: 'app-fee-template',
  templateUrl: './fee-template.component.html',
  styleUrls: ['./fee-template.component.scss']
})
export class FeeTemplateComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private ActivatedRoute: ActivatedRoute,
    private Location: Location
  ) { }

  ngOnInit(): void {
  }

  back() {
    this.Location.back()
  }
}
