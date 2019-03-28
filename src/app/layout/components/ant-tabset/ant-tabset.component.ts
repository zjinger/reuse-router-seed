import { Component, OnInit, HostListener, AfterContentInit } from '@angular/core';
@Component({
  selector: 'app-ant-tabset',
  template: `
  <nz-tabset [nzType]="'card'" [nzSelectedIndex]="index">
  <nz-tab *ngFor="let tab of tabs" [nzTitle]="titleTemplate">
    <ng-template #titleTemplate>
      <div>{{ tab }}<i nz-icon type="close" class="ant-tabs-close-x" (click)="closeTab(tab)"></i></div>
    </ng-template>
    <ng-template nz-tab>
      <div class="tab-conent" appSlimScroll [slimScrollOptions]="{height:contentHeight}">
        <app-tab-tpl [tabItem]="tab"></app-tab-tpl>
      </div>
    </ng-template>
  </nz-tab>
</nz-tabset>
  `,
  styleUrls: ['./ant-tabset.component.less']
})
export class AntTabsetComponent implements OnInit, AfterContentInit {
  contentHeight: number;
  constructor() { }

  ngOnInit() {
  }
  index = 0;
  tabs = ['Tab 1', 'Tab 2', 'Tab 1', 'Tab 2', 'Tab 1', 'Tab 2', 'Tab 1', 'Tab 2', 'Tab 1', 'Tab 2', 'Tab 1', 'Tab 2', 'Tab 1', 'Tab 2', 'Tab 1', 'Tab 2', 'Tab 1', 'Tab 2', 'Tab 1', 'Tab 2'];

  closeTab(tab: string): void {
    this.tabs.splice(this.tabs.indexOf(tab), 1);
  }

  newTab() {
    this.tabs.push('New Tab');
    this.index = this.tabs.length - 1;
  }
  ngAfterContentInit() {
    this.windowResize();
  }
  @HostListener('window:resize')
  windowResize() {
    this.contentHeight = document.body.clientHeight - 64 - 40;//header 64+tabset 40
  }
}
