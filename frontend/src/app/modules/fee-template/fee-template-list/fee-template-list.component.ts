import { FeeTemplateService } from '../../shared/services/feeTemplate/fee-template.service';
import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MessageService } from '../../shared/services/message/message.service';


@Component({
  selector: 'app-fee-template-list',
  templateUrl: './fee-template-list.component.html',
  styleUrls: ['./fee-template-list.component.scss']
})
export class FeeTemplateListComponent implements OnInit {

  tableLoading$: Observable<boolean>
  items$: Observable<any>

  constructor(
    private FeeTemplateServ: FeeTemplateService,
    private ActivatedRoute: ActivatedRoute,
    private MessageServ: MessageService
  ) {
    this.FeeTemplateServ.setFeeTemplatesLoading(true)
    this.tableLoading$ = this.FeeTemplateServ.feeTemplatesLoading$

    let obs$: Observable<any>
    obs$ = this.FeeTemplateServ.getFeeTemplates()
    this.items$ = this.FeeTemplateServ.feeTemplates$
    obs$.subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', '', 'Шаблоны загружены')
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      },
      complete: () => {
        this.FeeTemplateServ.setFeeTemplatesLoading(false)
      }
    })
  }

  ngOnInit(): void {
  }

  delete(id: number) {
    this.FeeTemplateServ.setFeeTemplatesLoading(true)
    this.FeeTemplateServ.delete(id).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно!', 'Шаблон удален')
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      },
      complete: () => {
        this.FeeTemplateServ.setFeeTemplatesLoading(false)
      }
    })
  }

}
