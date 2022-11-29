import { Component, OnInit } from '@angular/core';
import { orderBy, removeDuplicatedObj } from '../shared/helpers';
import { MessageService } from '../shared/services/message/message.service';
import { OrganizationService } from '../shared/services/organization/organization.service';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  title = 'ng2-charts-demo';

  barChartLegend = true;
  barChartPlugins = [];

  barChartData: any = {
    labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
    datasets: [
      { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
      { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
    ]
  };
  myDatasets = [
    { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
    { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
  ]
  barChartOptions: any = {
    responsive: true,
  };
  organizations: any = []
  constructor(
    private HomeServ: HomeService,
    private OrganizationServ: OrganizationService,
    private MessageServ: MessageService

  ) { }

  ngOnInit(): void {
    this.go()
  }
  arr: any = []
  obj: any = {}
  ready: any = []
  go() {

    const year = new Date().getFullYear() - 3
    this.HomeServ.getFeesOfApartamentOfYear(1, year).subscribe({
      next: (res: any) => {
        Object.entries(res).forEach(([key, value]) => {
          const orgName = (value as any)?.[0]?.organization?.name || 'Нет огранизации'
          value = removeDuplicatedObj(value, 'month')

          const orderedValue = orderBy(value, 'month', 'desc')
          const months = [] as any
          const data = [] as any
          (orderedValue as any).forEach((el: any) => {
              const date = new Date()
              date.setMonth(el.month - 1)
              const month = date.toLocaleString('default', { month: 'long' })
              months.push(month)
              data.push(Math.floor(el.sum))
            })
          const dataset1 = {
            data: data,
            label: 'Оплата'
          }

          const obj = {
            name: orgName,
            value: orderedValue,
            months: months,
            data: {
              labels: months,
              datasets: [dataset1]
            }
          }
          console.log(obj.data)
          this.organizations.push(obj)
        })

        // this.barChartData: any = {
        //   labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
        //   datasets: [
        //     { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
        //     { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
        //   ]
        // };
      }
    })
  }

  // getOrganizations () {
  //   this.OrganizationServ.getOrganizations().subscribe({
  //     next: (res: any) => {
  //       this.organizations = res
  //       this.MessageServ.sendMessage('success', '', 'Организации загружены')
  //     },
  //     error: (err: any) => {
  //       this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
  //     }
  //   })
  // }
}
