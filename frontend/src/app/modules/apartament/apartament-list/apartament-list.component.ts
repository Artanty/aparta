import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map, Observable, of, shareReplay, tap } from 'rxjs';
import { MessageService } from '../../shared/services/message/message.service';
import { ApartamentService } from '../apartament.service';

/**
 * Из списка квартир должно быть понятно
 * когда следующий платеж
 * как давно был предыдущий платеж (где давно не платили)
 * сортировка по стране, городу
 * сколько из скольки оплачено счетов за позапрошлый
 * и за прошлый месяц и суммы
 * сколько плюс или минус по сравнению с предыдущим периодом,
 * если предыдущий период не оплачен полностью, то восклицательный знак
 */
export type GetApartamentsApiResponse = {
  "id": number,
  "name": string,
  "address": string,
  "country": string,
  "last_paid": string,
  "next_pay": string,
  "creator_id": number,
  "created_at": string,
  "updated_at": string
}


@Component({
  selector: 'app-apartament-list',
  templateUrl: './apartament-list.component.html',
  styleUrls: ['./apartament-list.component.scss']
})
export class ApartamentListComponent implements OnInit {

  tableLoading$: Observable<boolean>
  items: any = []

  constructor(
    private http: HttpClient,
    private MessageServ: MessageService,
    private ApartamentServ: ApartamentService
    // private ActivatedRoute: ActivatedRoute
  ) {
    this.tableLoading$ = this.ApartamentServ.apartamentsLoading$
  }

  ngOnInit(): void {
    this.getApartaments()
    // this.getPlacePhoto()
  }


  getApartaments() {
    this.ApartamentServ.setApartamentsLoading(true)
    this.ApartamentServ.getApartaments().subscribe({
      next: (res: any) => {
        this.items = res
        this.items = this.items.map((el: any) => {
          if (el.place === 'Санкт-Петербург'){
            el.placeEng = 'saint-petersburg-city'
          } else if (el.place === 'Белград') {
            el.placeEng = 'belgrade-city'
          }
          return el
        })
        this.assingPlacesAvatars(this.items)
        this.MessageServ.sendMessage('success', '', 'Квартиры загружены')
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      },
      complete: () =>{
        this.ApartamentServ.setApartamentsLoading(false)
      }
    })
  }

  async assingPlacesAvatars (arr: any) {
    this.items = await Promise.all(arr.map(async (item: any): Promise<number> => {
        if (item.placeEng){
          item.avatar = await this.getPlaceAvatar(item.placeEng)
        }
        return item
    }));
  }

  async getPlaceAvatar(query: string) {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`api.unsplash.com/search/photos?page=1&query=${query}`).subscribe({
        next: (res: any) => {
          // this.items = res
          resolve(res?.results?.[0]?.urls?.thumb)
        },
        error: (err: any) => {
          reject(err.message)
        }
      })
    })
  }

  delete(id: number) {
    this.ApartamentServ.setApartamentsLoading(true)
    this.ApartamentServ.delete(id).subscribe({
      next: (res: any) => {
        this.items = this.items.filter((el: any) => el.id !== id)
        this.ApartamentServ.removeItemFromStore(id)
        this.MessageServ.sendMessage('success', 'Успешно!', 'Квартира удалена')
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      },
      complete: () => {
        this.ApartamentServ.setApartamentsLoading(false)
      }
    })
  }
}
