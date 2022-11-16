import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ApartamentService } from './apartament.service';


@Component({
  selector: 'app-apartament',
  templateUrl: './apartament.component.html',
  styleUrls: ['./apartament.component.scss']
})
export class ApartamentComponent implements OnInit {

  constructor(
    private ApartamentServ: ApartamentService,
    private ActivatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
  }

  refreshList() {
    this.ApartamentServ.getApartaments(true).subscribe({
      next: (res: any) => {
        // this.items = res

      },
      error: (err: any) => {
        alert(err.message)
      }
    })
  }

}
