import { ApartamentUserService } from '../apartament-user.service';
import { Component, OnInit } from '@angular/core';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MessageService } from '../../shared/services/message/message.service';
import { UntypedFormControl } from '@angular/forms';
import { ApartamentService } from '../../shared/services/apartament/apartament.service';

@Component({
  selector: 'app-apartament-user-list',
  templateUrl: './apartament-user-list.component.html',
  styleUrls: ['./apartament-user-list.component.scss']
})
export class ApartamentUserListComponent implements OnInit {
    obs$: Observable<any> = EMPTY
    tableLoading$: Observable<boolean>
    items$: Observable<any> = EMPTY
    // apartament_id: number = 0
    apartament_id: UntypedFormControl = new UntypedFormControl()
    apartamentOptions$: Observable<any[]>

    constructor(
      private ApartamentUserServ: ApartamentUserService,
      private ActivatedRoute: ActivatedRoute,
      private MessageServ: MessageService,
      private ApartamentServ: ApartamentService,
      private router: Router,

    ) {
      this.ActivatedRoute.params.subscribe(params => {
        this.getApartamentUsers(Number(params['apartament_id']))
        this.apartament_id.setValue(Number(params['apartament_id']), { emitEvent: false })
      });

      this.tableLoading$ = this.ApartamentUserServ.apartamentUsersLoading$
      this.apartament_id.valueChanges.subscribe((res: any) => {
        this.router.navigate(['/apartament/apartamentUser/', res]);
      })


      this.ApartamentServ.getApartaments().subscribe()
      this.apartamentOptions$ = this.ApartamentServ.apartaments$
    }

    ngOnInit(): void {
      //
    }

    getUsers(apartament_id?: number) {

    }

    getApartamentUsers(apartament_id: number) {
      this.ApartamentUserServ.setApartamentUsersLoading(true)
      this.obs$ = this.ApartamentUserServ.getApartamentUsers(apartament_id, true)
      this.items$ = this.ApartamentUserServ.apartamentUsers$
      this.obs$.subscribe({
        next: (res: any) => {
          this.MessageServ.sendMessage('success', '', 'Пользователи загружены')
        },
        error: (err: any) => {
          this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        },
        complete: () => {
          this.ApartamentUserServ.setApartamentUsersLoading(false)
        }
      })
    }

    changeStatus(item: any, prop: string) {
      this.ApartamentUserServ.setApartamentUsersLoading(true)
      let newItem
      if (prop === 'status') {
        newItem = { ...item, status: Number(!Boolean(item.status)) }
      } else if (prop === 'role') {
        newItem = { ...item, role: item.role === 1 ? 2 : 1 }
      }
      this.ApartamentUserServ.update(newItem).subscribe({
        next: (res: any) => {
          this.MessageServ.sendMessage('success', '', 'Параметры пользователя сохранены')
        },
        error: (err: any) => {
          this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        },
        complete: () => {
          this.ApartamentUserServ.setApartamentUsersLoading(false)
        }
      })
    }

    deleteItem(id: number) {
      this.ApartamentUserServ.setApartamentUsersLoading(true)
      this.ApartamentUserServ.delete(id).subscribe({
        next: (res: any) => {
          this.MessageServ.sendMessage('success', 'Успешно!', 'Пользователь удален')
        },
        error: (err: any) => {
          this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        },
        complete: () => {
          this.ApartamentUserServ.setApartamentUsersLoading(false)
        }
      })
    }

  }
