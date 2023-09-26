import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'alibi-alibi-lib',
  template: `
    <div>
      <alibi-table></alibi-table>
    </div>
  `,
  styles: [
  ]
})
export class AlibiLibComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
