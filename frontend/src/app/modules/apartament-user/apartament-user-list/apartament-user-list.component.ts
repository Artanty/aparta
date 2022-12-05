import { ApartamentUserService } from '../apartament-user.service';
import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MessageService } from '../../shared/services/message/message.service';

@Component({
  selector: 'app-apartament-user-list',
  templateUrl: './apartament-user-list.component.html',
  styleUrls: ['./apartament-user-list.component.scss']
})
export class ApartamentUserListComponent implements OnInit {

    tableLoading$: Observable<boolean>
    items$: Observable<any>
    apartament_id: number = 0
    constructor(
      private ApartamentUserServ: ApartamentUserService,
      private ActivatedRoute: ActivatedRoute,
      private MessageServ: MessageService
    ) {
      this.apartament_id = Number(this.ActivatedRoute.snapshot.paramMap.get('apartament_id') || 0)
      this.ApartamentUserServ.setApartamentUsersLoading(true)
      this.tableLoading$ = this.ApartamentUserServ.apartamentUsersLoading$

      let obs$: Observable<any>
      obs$ = this.ApartamentUserServ.getApartamentUsers(this.apartament_id)
      this.items$ = this.ApartamentUserServ.apartamentUsers$
      obs$.subscribe({
        next: (res: any) => {
          this.MessageServ.sendMessage('success', '', 'Пользоваетли загружены')
        },
        error: (err: any) => {
          this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        },
        complete: () => {
          this.ApartamentUserServ.setApartamentUsersLoading(false)
        }
      })
    }

    ngOnInit(): void {
      //
    }

    delete(id: number) {
      // this.ApartamentUserServ.setFeeTemplatesLoading(true)
      // this.ApartamentUserServ.delete(id).subscribe({
      //   next: (res: any) => {
      //     this.MessageServ.sendMessage('success', 'Успешно!', 'Шаблон удален')
      //   },
      //   error: (err: any) => {
      //     this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      //   },
      //   complete: () => {
      //     this.ApartamentUserServ.setFeeTemplatesLoading(false)
      //   }
      // })
    }

  }
