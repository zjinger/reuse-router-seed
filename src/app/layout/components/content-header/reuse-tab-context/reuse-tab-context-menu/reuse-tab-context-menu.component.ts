import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { TabComponent } from '../../../../models';
import { ReuseContextCloseEvent, CloseType } from '../../../../models/reuse-tab';

@Component({
  selector: 'reuse-tab-context-menu',
  templateUrl: './reuse-tab-context-menu.component.html',
  styleUrls: ['./reuse-tab-context-menu.component.less'],
  preserveWhitespaces: false
})
export class ReuseTabContextMenuComponent implements OnInit {

  @Input() item: TabComponent;

  @Input() event: MouseEvent;

  @Output() close = new EventEmitter<ReuseContextCloseEvent>();
  constructor() { }

  get includeNonCloseable() {
    return this.event.ctrlKey;
  }

  private notify(type: CloseType, item: TabComponent) {
    this.close.next({
      type,
      item: this.item,
      includeNonCloseable: this.includeNonCloseable,
    });
  }

  ngOnInit(): void {
    if (this.includeNonCloseable) this.item.closable = true;
  }

  click(e: MouseEvent, type: CloseType) {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'close' && !this.item.closable) return; // 如果关闭时，当前tab 不可关闭
    if (type === 'closeRight' && this.item.last) return; // 如果关闭右边tab，当前tab 为最后一个
    this.notify(type, this.item);
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:contextmenu', ['$event'])
  closeMenu(event: MouseEvent): void {
    if (event.type === 'click' && event.button === 2) return;
    this.notify(null, null);
  }

}
