import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

type messageType = 'success' | 'error' | 'warning'
type messageLength = {
  [key in messageType]: number
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messageLength: messageLength = {
    success: 3,
    error: 5,
    warning: 4
  }

  constructor() { }

  private messagesSubj: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  messages$: Observable<any[]> = this.messagesSubj.asObservable();

  setMessages(val: any){
    this.messagesSubj.next(val);
  }

  sendMessage(type: messageType, header: string, body: string, length?: number){
    length = length ? length : this.messageLength[type]
    const message = {
      date: new Date(),
      type: type,
      header: header,
      body: body,
      length: length
    }
    const messages = this.messagesSubj.getValue()
    messages.push(message)
    this.setMessages(messages)
  }

  closeMessage(dateId: string) {
    let messages = this.messagesSubj.getValue()
    messages = messages.filter((el: any) => el.date !== dateId)
    this.setMessages(messages)
  }

  clear () {
    this.setMessages([])
  }
}
