import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-widgets-currancy-source',
  templateUrl: './widgets-currancy-source.component.html',
  styleUrls: ['./widgets-currancy-source.component.scss']
})
export class WidgetsCurrancySourceComponent implements OnInit {
  @Input() sourceCurrancy: number = 0
  @Input() sourceSum: number | string = 0
  @Input() destinationCurrancy: number = 0
  @Input() selectedCurrancySourceItem: any = null
  @Output() newCurrancySourceAway: EventEmitter<any> = new EventEmitter<any>()
  loading: boolean = false
  constructor() { }

  ngOnInit(): void {
  }

  update () {
    //
  }

}
