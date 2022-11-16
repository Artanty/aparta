import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import { MessageService } from '../../services/message/message.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ top: '30px', opacity: 0 }),
            animate('1s ease-out',
                    style({ top: 0, opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ top: 0, opacity: 1 }),
            animate('1s ease-in',
                    style({ top: '30px', opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class MessageListComponent {

  messages$: Observable<any>

  constructor(
    private messageService: MessageService
    ) {
      this.messages$ = this.messageService.messages$.pipe(
        tap((res: any) => {
          console.log(res)
          res.forEach((el: any) => {
            console.log(el)
            setTimeout(() => {
              console.log('res')
              this.messageService.closeMessage(el.date)
            }, el.length * 1000)
          })
        })
      )
  }

}
