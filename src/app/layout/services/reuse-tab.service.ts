import { Injectable, OnDestroy, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { ReuseTabCached, ReuseTabNotify } from '../models/reuse-tab';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class ReuseTabService implements OnDestroy {
  private _cachedChange: BehaviorSubject<ReuseTabNotify> = new BehaviorSubject<ReuseTabNotify>(null);
  /**缓存路由列表 */
  private _reuseTabCachedList: ReuseTabCached[] = [];
  private _titleCached: { [url: string]: string } = {};
  private _closableCached: { [url: string]: boolean } = {};

  private removeUrlBuffer: string;
  /** 当前路由地址 */
  get curUrl() {
    return this.getUrl(this.injector.get(ActivatedRoute).snapshot);
  }
  /** 获取已缓存的路由 */
  get reuseTabList(): ReuseTabCached[] {
    return this._reuseTabCachedList;
  }
  /** 获取当前缓存的路由总数 */
  get count() {
    return this._reuseTabCachedList.length;
  }
  /** 订阅缓存变更通知 */
  get change(): Observable<ReuseTabNotify> {
    return this._cachedChange.asObservable()
      .pipe(filter(w => w !== null));
  }
  constructor(private injector: Injector) { }


  /**
   * 关闭tab
   * @param url 路由url
   * @param includeNonCloseable 是否包含强制不可关闭
   */
  close(url: string, includeNonCloseable = false): any {
    this.removeUrlBuffer = url;
    this.remove(url, includeNonCloseable);
    this._cachedChange.next({ active: 'close', url, list: this._reuseTabCachedList });
    this.di('close tag', url);
    return true;
  }

  /**
   * 决定是否允许路由复用，若 `true` 会触发 `store`
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    if (this.hasInValidRoute(route)) return false;
    this.di('#shouldDetach', this.can(route), this.getUrl(route));
    return this.can(route);
  }
  /**
   * 存储快照
   */
  store(_snapshot: ActivatedRouteSnapshot, _handle: any) {
    // 超出最大存储范围之后
    // if (this.count >= this._max) this._reuseTabCachedList.shift();
    const url = this.getUrl(_snapshot);
    const index = this.index(url);
    const title = this.getTitle(url, _snapshot);
    const closable = this.getClosable(url, _snapshot);
    const item: ReuseTabCached = { title, closable, url, _snapshot, _handle, };
    if (index === -1) {
      this._reuseTabCachedList.push(item);
    } else {
      this._reuseTabCachedList[index] = item;
    }
    this.removeUrlBuffer = null;
    this.di('#store', index === -1 ? '[new]' : '[override]', url);
    if (_handle && _handle.componentRef) {
      this.runHook('_onReuseDestroy', url, _handle.componentRef);
    }
    this._cachedChange.next({ active: 'add', item, list: this._reuseTabCachedList });
  }
  /**
   * 决定是否允许应用缓存数据
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (this.hasInValidRoute(route)) return false;
    const url = this.getUrl(route);
    const data = this.getReuseTabCached(url);
    const ret = !!(data && data._handle);
    this.di('#shouldAttach', ret, url);
    if (ret && data._handle.componentRef) {
      this.runHook('_onReuseInit', url, data._handle.componentRef);
    }
    return ret;
  }
  /**
   * 提取复用数据
   */
  retrieve(route: ActivatedRouteSnapshot): {} {
    let hasInValidRoute = this.hasInValidRoute(route);
    if (hasInValidRoute) return null;
    const url = this.getUrl(route);
    const data = this.getReuseTabCached(url);
    const ret = (data && data._handle) || null;
    this.di('#retrieve', url, ret);
    return ret;
  }
  /**
   * 决定是否应该进行复用路由处理
   */
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot,
  ): boolean {
    let ret = future.routeConfig === curr.routeConfig;
    if (!ret) return false;
    const path = ((future.routeConfig && future.routeConfig.path) ||
      '') as string;
    if (path.length > 0 && ~path.indexOf(':')) {
      const futureUrl = this.getUrl(future);
      const currUrl = this.getUrl(curr);
      ret = futureUrl === currUrl;
    }
    this.di('=====================');
    this.di('#shouldReuseRoute', ret, `${this.getUrl(curr)}=>${this.getUrl(future)}`, future, curr);
    return ret;
  }

  /** 获取指定路径缓存所在位置，`-1` 表示无缓存 */
  index(url: string): number {
    return this._reuseTabCachedList.findIndex(w => w.url === url);
  }
  /** 获取指定路径缓存是否存在 */
  exists(url: string): boolean {
    return this.index(url) !== -1;
  }
  /** 获取指定路径缓存 */
  getReuseTabCached(url: string): ReuseTabCached {
    return url ? this._reuseTabCachedList.find(w => w.url === url) || null : null;
  }
  /**
   * 获取标题（title）
   * @param url 指定URL
   * @param route 指定路由快照
   */
  getTitle(url: string, route?: ActivatedRouteSnapshot): string {
    if (this._titleCached[url]) return this._titleCached[url];
    if (route && route.data && route.data.title)
      return route.data.title;
  }

  /**
   * 获取 closable 状态
   * @param url
   * @param route
   */
  getClosable(url: string, route?: ActivatedRouteSnapshot): boolean {
    if (typeof this._closableCached[url] !== 'undefined')
      return this._closableCached[url];

    if (route && route.data && typeof route.data.reuseClosable === 'boolean')
      return route.data.reuseClosable;
    return true;
  }

  /**
   * 清除标题缓存
   */
  clearTitleCached() {
    this._titleCached = {};
  }
  getTruthRoute(route: ActivatedRouteSnapshot) {
    let next = route;
    while (next.firstChild) next = next.firstChild;
    return next;
  }
  /**
   * 根据快照获取URL地址
   */
  getUrl(route: ActivatedRouteSnapshot): string {
    let next = this.getTruthRoute(route);
    const segments = [];
    while (next) {
      segments.push(next.url.join('/'));
      next = next.parent;
    }
    const url =
      '/' +
      segments
        .filter(i => i)
        .reverse()
        .join('/');
    return url;
  }


  /**
   * 运行生命周期钩子
   * @param method
   * @param url
   * @param comp
   */
  private runHook(method: string, url: string, comp: any) {
    if (comp.instance && typeof comp.instance[method] === 'function')
      comp.instance[method]();
  }

  /**
   * 组件销毁
   * @param _handle
   */
  private destroy(_handle: any) {
    if (_handle && _handle.componentRef && _handle.componentRef.destroy)
      _handle.componentRef.destroy();
  }
  /**
   * 移除url
   * @param url
   * @param includeNonCloseable
   */
  private remove(url: string | number, includeNonCloseable: boolean): boolean {
    const idx = typeof url === 'string' ? this.index(url) : url;
    const item = idx !== -1 ? this._reuseTabCachedList[idx] : null;
    if (!item || (!includeNonCloseable && !item.closable)) return false;

    this.destroy(item._handle);

    this._reuseTabCachedList.splice(idx, 1);
    delete this._titleCached[url];
    return true;
  }

  /**
   * 去掉loadChildren，以及children
   * 得到纯路由
   * @param route
   */
  private hasInValidRoute(route: ActivatedRouteSnapshot) {
    return (
      !route.routeConfig ||
      route.routeConfig.loadChildren ||
      route.routeConfig.children
    );
  }
  /**
   * 检查快照是否允许被复用
   */
  private can(route: ActivatedRouteSnapshot): boolean {
    const url = this.getUrl(route);
    if (url === this.removeUrlBuffer) return false;
    if (route.data && typeof route.data.reuse === 'boolean')
      return route.data.reuse;
    return true;
  }

  /** 自定义当前 `closable` 状态 */
  set closable(value: boolean) {
    const url = this.curUrl;
    this._closableCached[url] = value;
    this.di('update current tag closable: ', value);
    this._cachedChange.next({
      active: 'closable',
      closable: value,
      list: this._reuseTabCachedList,
    });
  }
  /**
 * 清除右边tab 标签页
 *
 * @param [includeNonCloseable=false] 是否强制包含不可关闭
 */
  closeRight(url: string, includeNonCloseable = false) {
    const start = this.index(url);
    for (let i = this.count - 1; i > start; i--) {
      this.remove(i, includeNonCloseable);
    }

    this.removeUrlBuffer = null;

    this._cachedChange.next({ active: 'closeRight', url, list: this._reuseTabCachedList });

    this.di('close right tages', url);
    return true;
  }
  /**
 * 清除所有缓存（清除所有tab）
 *
 * @param [includeNonCloseable=false] 是否强制包含不可关闭
 */
  clear(includeNonCloseable = false) {
    this._reuseTabCachedList.forEach(w => {
      if (!includeNonCloseable && w.closable) this.destroy(w._handle);
    });
    this._reuseTabCachedList = this._reuseTabCachedList.filter(
      w => !includeNonCloseable && !w.closable,
    );

    this.removeUrlBuffer = null;

    this._cachedChange.next({ active: 'clear', list: this._reuseTabCachedList });

    this.di('clear all catch');
  }
  private di(...args) {
    // console.warn(...args);
  }
  ngOnDestroy(): void {
    this._reuseTabCachedList = [];
    this._cachedChange.unsubscribe();
  }
}
