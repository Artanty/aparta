import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[alibiTemplateHeader]'
})
export class TemplateHeaderDirective {

  // name of our ng-template reference (header, body)
  @Input('template') templateName: string | undefined
  constructor(
    // actual template ref
    public readonly template: TemplateRef<any>
  ) { }

}
