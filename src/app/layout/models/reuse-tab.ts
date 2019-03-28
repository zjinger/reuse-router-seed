import { TabComponent } from './tab-component';
import { ActivatedRouteSnapshot } from "@angular/router";
import { ReuseTabContextComponent } from '../components/content-header/reuse-tab-context/reuse-tab-context.component';

export interface ReuseTabCached {
  title: string;
  url: string;
  /** 是否可关闭，默认：`true` */
  closable?: boolean;
  _snapshot: ActivatedRouteSnapshot;
  _handle: any;
}

export interface ReuseTabNotify {
  /** 事件类型 */
  active: string;

  [key: string]: any;
}

export type CloseType = 'close' | 'closeOther' | 'closeRight' | 'clear' | null;

export interface ReuseContextCloseEvent {
  type: CloseType;
  item: TabComponent;
  includeNonCloseable: boolean;
}

export interface ReuseContextEvent {
  event: MouseEvent;
  item: TabComponent;
  comp?: ReuseTabContextComponent;
}
