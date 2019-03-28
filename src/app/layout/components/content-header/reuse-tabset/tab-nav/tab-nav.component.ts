import { Component, OnInit, Input, Inject, Optional, ElementRef, ViewChild, OnDestroy, AfterContentChecked, Output, EventEmitter, Renderer2, QueryList, AfterContentInit, NgZone, ContentChildren, ContentChild } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { DOCUMENT } from '@angular/common';
import { fromEvent, merge, of as observableOf, Subscription } from 'rxjs';
import { auditTime, startWith } from 'rxjs/operators';
import { TabLabelDirective } from 'src/app/layout/directives/tab-label.directive';
export type ScrollDirection = 'after' | 'before';

const EXAGGERATED_OVERSCROLL = 64;
@Component({
  selector: 'tab-nav',
  templateUrl: './tab-nav.component.html',
  styleUrls: ['./tab-nav.component.less'],
  host: {
    '(scroll)': 'onScroll($event)'
  },
  // host: {
  // '(scroll)': 'onScroll($event)',
  // 'class': 'tabs tabs-top tabs-no-animation tabs-line'
  // },

})
export class TabNavComponent implements OnInit, AfterContentChecked, OnDestroy {
  el: HTMLElement;
  showPaginationControls = false;//滚动条样式控制
  disableScrollAfter = true;//向右滑动按钮
  disableScrollBefore = true;//想做滑动按钮

  scrollDistanceChanged: boolean;//滚动条距离发生改变

  tabLabelCount: number;//tabs 的总数目

  selectedIndexChanged = false;//当前选中的index 发生改变

  realignInkBar: Subscription | null = null;

  private _scrollDistance = 0;

  private _selectedIndex: number = null;//已选择的tab index

  @ContentChildren(TabLabelDirective)
  listTabLabelDirective: QueryList<TabLabelDirective>;

  @ViewChild('tabsContainer', { read: ElementRef })
  navContainerElement: ElementRef;

  @ViewChild('navListElement', { read: ElementRef })
  navListElement: ElementRef;

  // @Output() selectChange: EventEmitter<any> = new EventEmitter<any>(true);

  @Output() onPrevClick = new EventEmitter<void>();//触发向左滑动
  @Output() onNextClick = new EventEmitter<void>();//触发向右滑动

  // @Input() TabBarExtraContent: TemplateRef<void>;//额外操作区域模块



  @Input()
  set selectedIndex(value: number) {
    //父组件传入的index和当前的index 作比较，如果不相等说明index 发生了改变
    this.selectedIndexChanged = this._selectedIndex !== value;
    this._selectedIndex = value;
  }
  get selectedIndex(): number {
    return this._selectedIndex;
  }
  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private ngZone: NgZone,
    @Optional() @Inject(DOCUMENT) private document: any,
    @Optional() private dir: Directionality,
  ) {
    this.el = this.elementRef.nativeElement;
  }
  ngOnInit() {
    // //console.log(this.dir.value);
  }

  /**
   * 监听到ng-content 内部的变化
   */
  onContentChanges() {
    //console.log('onContentChanges');
    this.updatePagination();
  }

  /**
   * 更新滚动条状态
   */
  updatePagination(): void {
    // //console.log('更新 Pagination');
    this.checkPaginationEnabled();
    this.checkScrollingControls();
    this.updateTabScrollPosition();
  }

  /**
   * 是否需要加载滚动条
   * 如果tabs的长度大于外部的长度需要加载滚动条
   */
  checkPaginationEnabled(): void {
    this.showPaginationControls =
      this.tabListScrollWidthPix > this.elementRefOffSetWidth;
    if (!this.showPaginationControls) {
      this.scrollDistance = 0;
    }
  }

  /**
   * 滚动起来
   */
  updateTabScrollPosition(): void {
    const scrollDistance = this.scrollDistance;
    const translateX = -scrollDistance;
    this.renderer.setStyle(this.navListElement.nativeElement, 'transform', `translate3d(${translateX}px, 0, 0)`);

  }

  checkScrollingControls(): void {
    // Check if the pagination arrows should be activated.
    this.disableScrollBefore = this.scrollDistance === 0;
    this.disableScrollAfter = this.scrollDistance === this.getMaxScrollDistance();
  }


  onScroll($event: Event): void {
    console.log('scroll');
    const target: Element = $event.target as Element;
    if (target.scrollLeft > 0) {
      target.scrollLeft = 0;
      if (this.document && this.document.activeElement) {
        (this.document.activeElement as HTMLElement).blur();
      }
    }
  }

  getMaxScrollDistance(): number {
    return (this.tabListScrollWidthPix - this.viewWidthPix) || 0;
  }

  ngAfterContentChecked() {
    if (this.tabLabelCount !== this.listTabLabelDirective.length) {
      this.updatePagination();
      this.tabLabelCount = this.listTabLabelDirective.length;
    }
    if (this.selectedIndexChanged) {
      this.scrollToLabel(this._selectedIndex);
      this.checkScrollingControls();
      this.selectedIndexChanged = false;
    }
    if (this.scrollDistanceChanged) {
      this.updateTabScrollPosition();
      this.scrollDistanceChanged = false;
    }
  }

  ngAfterContentInit(): void {
    // //console.log(this.listTabLabelDirective.length);
    this.realignInkBar = this.ngZone.runOutsideAngular(() => {
      const resize = typeof window !== 'undefined' ?
        fromEvent(window, 'resize').pipe(auditTime(10)) :
        observableOf(null);
      return merge(observableOf(null), resize).pipe(startWith(null)).subscribe(() => {
        this.updatePagination();
      });
    });
  }
  scrollToLabel(labelIndex: number): void {
    const selectedLabel = this.listTabLabelDirective
      ? this.listTabLabelDirective.toArray()[labelIndex]
      : null;
    if (selectedLabel) {
      let labelBeforePos: number;
      let labelAfterPos: number;
      //计算当前tab标签页前面的tabs长度
      labelBeforePos = selectedLabel.getOffsetLeft();
      //计算当前tab标签页后面的tabs长度
      //selectedLabel.getOffsetWidth() 单个tab宽
      labelAfterPos = labelBeforePos + selectedLabel.getOffsetWidth();
      const beforeVisiblePos = this.scrollDistance;
      const afterVisiblePos = this.scrollDistance + this.viewWidthPix;
      if (labelBeforePos < beforeVisiblePos) {
        // Scroll header to move label to the before direction
        this.scrollDistance -= beforeVisiblePos - labelBeforePos + EXAGGERATED_OVERSCROLL;
      } else if (labelAfterPos > afterVisiblePos) {
        // Scroll header to move label to the after direction
        this.scrollDistance += labelAfterPos - afterVisiblePos + EXAGGERATED_OVERSCROLL;
      }
    }
  }

  /**
   * 左右滑动
   * @param scrollDir
   */
  scrollHeader(scrollDir: ScrollDirection): void {
    if (scrollDir === 'before' && !this.disableScrollBefore) {
      this.onPrevClick.emit();
    } else if (scrollDir === 'after' && !this.disableScrollAfter) {
      this.onNextClick.emit();
    }
    this.scrollDistance += (scrollDir === 'before' ? -1 : 1) * this.viewWidthPix / 3;
  }


  set scrollDistance(v: number) {
    this._scrollDistance = Math.max(0, Math.min(this.getMaxScrollDistance(), v));
    this.scrollDistanceChanged = true;
    this.checkScrollingControls();
  }

  get scrollDistance(): number {
    return this._scrollDistance;
  }

  get viewWidthPix(): number {
    let PAGINATION_PIX = 0;
    if (this.showPaginationControls) {
      PAGINATION_PIX = 64;//32+32
    }
    return this.navContainerElement.nativeElement.offsetWidth - PAGINATION_PIX;
  }

  get elementRefOffSetWidth(): number {
    // //console.log(this.el.offsetWidth);//需要在样式加上 :host{display:block},不然返回0
    return this.el.offsetWidth;
  }

  /**
   * 获取tabs-nav scrollwidth
   * 所有的 tab 所占用的宽
   */
  get tabListScrollWidthPix(): number {
    // //console.log("tabs-nav scrollwidth:" + this.navListElement.nativeElement.scrollWidth)
    return this.navListElement.nativeElement.scrollWidth;
  }

  ngOnDestroy(): void {
  }
}
