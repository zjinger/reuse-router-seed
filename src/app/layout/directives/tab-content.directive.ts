import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[tabContent]'
})
export class TabContentDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
