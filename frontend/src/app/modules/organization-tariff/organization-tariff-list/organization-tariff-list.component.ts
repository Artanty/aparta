import { Component, OnInit } from '@angular/core';
import { OrganizationTariffService } from '../../shared/services/organizationTariff/organization-tariff.service';

import { Observable, Subscription } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MessageService } from '../../shared/services/message/message.service';


@Component({
  selector: 'app-organization-tariff-list',
  templateUrl: './organization-tariff-list.component.html',
  styleUrls: ['./organization-tariff-list.component.scss']
})
export class OrganizationTariffListComponent implements OnInit {
  tableLoading$: Observable<boolean>
  items$: Observable<any>

  constructor(
    private OrganizationTariffServ: OrganizationTariffService,
    private ActivatedRoute: ActivatedRoute,
    private MessageServ: MessageService
  ) {
    this.OrganizationTariffServ.setOrganizationTariffsLoading(true)
    this.tableLoading$ = this.OrganizationTariffServ.organizationTariffsLoading$

    let obs$: Observable<any>
    obs$ = this.OrganizationTariffServ.getOrganizationTariffs()
    this.items$ = this.OrganizationTariffServ.organizationTariffs$
    obs$.subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', '', 'Услуги загружены')
        this.OrganizationTariffServ.setOrganizationTariffsLoading(false)
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        this.OrganizationTariffServ.setOrganizationTariffsLoading(false)
      }
    })
  }

  ngOnInit(): void {
  }

  delete(id: number) {
    this.OrganizationTariffServ.setOrganizationTariffsLoading(true)
    this.OrganizationTariffServ.delete(id).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно!', 'Услуга удалена')
        this.OrganizationTariffServ.setOrganizationTariffsLoading(false)
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        this.OrganizationTariffServ.setOrganizationTariffsLoading(false)
      }
    })
  }

}
