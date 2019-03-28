import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReuseContextCloseEvent } from '../../../models/reuse-tab';
import { ReuseTabContextService } from '../../../services/reuse-tab-context.service';

@Component({
  selector: 'reuse-tab-context',
  template: ``,
  preserveWhitespaces: false,
})
export class ReuseTabContextComponent implements OnInit, OnDestroy {
  private sub$: Subscription = new Subscription();
  @Output() change = new EventEmitter<ReuseContextCloseEvent>();

  constructor(
    private tabContextService: ReuseTabContextService
  ) {
    this.sub$.add(tabContextService.show.subscribe(context => this.tabContextService.open(context)));
    this.sub$.add(tabContextService.close.subscribe(res => this.change.emit(res)));
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }
}
