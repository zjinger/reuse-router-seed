import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TabComponent } from '../../../models';

export class TabChangeEvent {
  index: number;
  tab: any;
}

@Component({
  selector: 'reuse-header-tabset',
  templateUrl: './reuse-tabset.component.html',
  styleUrls: ['./reuse-tabset.component.less'],
})
export class ReuseTabsetComponent implements OnInit {
  @Input() tabList: Array<TabComponent>;//tab list
  @Input() selectedIndex: number = 0;//当前选中的tab 下标
  //订阅下标变化
  @Output()
  get selectedIndexChange(): Observable<number> {
    return this.selectChange.pipe(map(event => event.index));
  }
  //tab 切换回调
  @Output() selectChange: EventEmitter<any> = new EventEmitter<any>(true);
  //tab 点击回调
  @Output() tabClick: EventEmitter<any> = new EventEmitter<any>();
  //tab 关闭回调
  @Output() tabClose: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }
  ngOnInit() {
  }

  clickLabel($event, index: number, disabled: boolean): void {
    // console.log('点击当前tab事件')
    if (!disabled) {
      this.selectedIndex = index;
      this.tabClick.emit({ e: $event, index: index });
    }
  }
  /**
   * 右滑回调事件
   */
  nextClick() {
    console.log('tab 右滑动');
  }
  /**
   * 左滑回调事件
   */
  prevClick() {
    console.log('tab 左滑动');
  }

  /**
   * 移除 tab
   * @param value
   */
  removeTab($event, index, includeNonCloseable) {
    this.tabClose.emit({ e: $event, index, includeNonCloseable });
  }


}
