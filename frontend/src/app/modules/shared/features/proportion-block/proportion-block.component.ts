import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-proportion-block',
  templateUrl: './proportion-block.component.html',
  styleUrls: ['./proportion-block.component.scss']
})
export class ProportionBlockComponent {
  @Input() labels: string[] = ['A', 'B', 'C', 'D']
  @Output() valueAway: EventEmitter<number> = new EventEmitter<number>()
  formGroup: UntypedFormGroup = new UntypedFormGroup({
    a: new UntypedFormControl(null, [Validators.required, Validators.pattern(/^[\d ]*$/)]),
    b: new UntypedFormControl(null, [Validators.required, Validators.pattern(/^[\d ]*$/)]),
    c: new UntypedFormControl(null, [Validators.required, Validators.pattern(/^[\d ]*$/)]),
    d: new UntypedFormControl(null)
  })
  constructor() { }

  calculate () {
    const getControl = (input: string): UntypedFormControl => this.getControl(this.formGroup, input)
    const getControlValue = (input: string): string => getControl(input).value || ''
    const removeSpaces = (val: string): string => val.replace(/\s/g, '')
    const num = (inputName: string): number => +removeSpaces(getControlValue(inputName))
    getControl('d').setValue(Number(parseFloat(String(num('b') * num('c') / num('a'))).toFixed(2)))
  }

  math(method: 'floor' | 'ceil' | 'round') {
    const d = this.formGroup.get('d')
    if (d) {
      const previousValue: number = d.value
      let result: number = Math[method](d.value)
      if (previousValue === result && result.toString().length > 3) {
        result = Number(result.toString().slice(0, -3) + '000')
      }
      d.setValue(result)
    }
  }

  getControl(formGroup: UntypedFormGroup, formControlId: string): UntypedFormControl {
    return (formGroup.get(formControlId) as UntypedFormControl) || new UntypedFormControl(null)
  }

  sendValueAway () {
    this.valueAway.emit(this.formGroup.get('d')?.value)
  }
}
