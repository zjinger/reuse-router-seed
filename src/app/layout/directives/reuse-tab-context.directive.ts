import { Directive, Input, HostListener } from '@angular/core';
import { TabComponent } from '../models';
import { ReuseTabContextService } from '../services/reuse-tab-context.service';

@Directive({
  selector: '[context-menu]'
})
export class ReuseTabContextDirective {
  @Input('context-menu') item: TabComponent;
  constructor(private reuseTabService: ReuseTabContextService) { }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    this.reuseTabService.show.next({
      event,
      item: this.item,
    });
    event.preventDefault();
    event.stopPropagation();
  }
}
