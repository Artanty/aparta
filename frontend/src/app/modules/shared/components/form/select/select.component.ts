import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  @Input() control: FormControl = new FormControl()
  @Input() options: any = []
  @Input() optionsValueLabelProps: [string, string] = ['id', 'name']
  @Input() label: string = ''
  @Input() resetable: boolean = false
  @Output() resetAway: EventEmitter<void> = new EventEmitter<void>()
  constructor() { }

  ngOnInit(): void {
  }
  reset () {
    this.control.reset()
    this.resetAway.emit()
  }

}
