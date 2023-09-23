import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @Input() label: string = ''
  @Input() control: FormControl = new FormControl()
  // @Input() value: any = null
  @Input() placeholder: string = '';
  @Input() readonly: boolean = false
  @Input() type: 'text'|'password'|'number' = 'text';
  // @Input() pattern: RegExp | string = new RegExp(/\d+(\.\d{2})?/)
  @Input() currancyFormat: boolean = false
  @Input() mask: string = ''
  @Input() noValid: boolean = false
  id: number
  active: boolean = false
  _value: any
  @Input() set value(val: any) {
    this._value = val
  }
  constructor() {
    this.id = this.getRandom()
  }

  ngOnInit(): void {

  }

  getRandom() {
    return Math.round(Math.random() * 9999)
  }

  get showError(): boolean {
    return this.control.invalid && this.control.touched;
  }
}
