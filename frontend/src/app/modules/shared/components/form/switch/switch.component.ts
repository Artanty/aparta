import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {
  @Input() control: UntypedFormControl = new UntypedFormControl()
  @Input() label: string = ''
  id: string = Date.now() + '_' + Math.floor(Math.random() * 1000)
  constructor() { }

  ngOnInit(): void {
  }

}
