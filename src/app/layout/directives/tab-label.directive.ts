import { Directive, Input, HostBinding, ElementRef } from '@angular/core';
import { toBoolean } from '../../shared/util/convert';

@Directive({
  selector: '[nav-tab-label]',
  host: {
    '[class.tabs-tab]': 'true'
  }
})
export class TabLabelDirective {
  private _disabled = false;
  @Input()
  @HostBinding('class.tabs-tab-disabled')
  set disabled(value: boolean) {
    this._disabled = toBoolean(value);
  }
  get disabled(): boolean {
    return this._disabled;
  }
  constructor(public elementRef: ElementRef) {
  }

  getOffsetLeft(): number {
    return this.elementRef.nativeElement.offsetLeft;
  }

  getOffsetWidth(): number {
    return this.elementRef.nativeElement.offsetWidth;
  }

  getOffsetTop(): number {
    return this.elementRef.nativeElement.offsetTop;
  }

  getOffsetHeight(): number {
    return this.elementRef.nativeElement.offsetHeight;
  }
}
