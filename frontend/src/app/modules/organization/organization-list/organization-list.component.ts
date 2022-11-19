import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MessageService } from '../../shared/services/message/message.service';
import { OrganizationService } from '../../shared/services/organization/organization.service';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss']
})
export class OrganizationListComponent implements OnInit {
  tableLoading$: Observable<boolean>
  items$: Observable<any>

  constructor(
    private OrganizationServ: OrganizationService,
    private ActivatedRoute: ActivatedRoute,
    private MessageServ: MessageService
  ) {
    this.OrganizationServ.setOrganizationsLoading(true)
    this.tableLoading$ = this.OrganizationServ.organizationsLoading$

    let obs$: Observable<any>
    obs$ = this.OrganizationServ.getOrganizations()
    this.items$ = this.OrganizationServ.organizations$
    obs$.subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', '', 'Организации загружены')
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      },
      complete: () => {
        this.OrganizationServ.setOrganizationsLoading(false)
      }
    })
  }

  ngOnInit(): void {
  }

  delete(id: number) {
    this.OrganizationServ.setOrganizationsLoading(true)
    this.OrganizationServ.delete(id).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно!', 'Организация удалена')
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      },
      complete: () => {
        this.OrganizationServ.setOrganizationsLoading(false)
      }
    })
  }

}
