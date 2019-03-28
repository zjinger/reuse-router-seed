import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver, Input, ViewChild, AfterContentInit, ReflectiveInjector } from '@angular/core';
import { TabItem } from 'src/app/layout/models';
import { TabContentDirective } from 'src/app/layout/directives/tab-content.directive';

@Component({
  selector: 'app-tab-tpl',
  template: `
    <ng-template tabContent></ng-template>
  `,
})
export class TabTplComponent implements OnInit, AfterContentInit {
  currentComponent = null;//当前的组件
  @Input() tabItem: TabItem;

  @ViewChild(TabContentDirective) tabHost: TabContentDirective;

  constructor(
    public viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {

  }

  ngAfterContentInit(): void {
    // Expression has changed after it was checked
    // 动态创建的组件导致某些改动在生命周期之外，加入setTimeout以解决以上报错
    setTimeout(() => {
      this.loadComponents();
    })
  }

  loadComponents() {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.tabItem.component);
    let viewContainerRef = this.tabHost.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);
    this.currentComponent = componentRef;
    let component = componentRef.instance;
    // console.log(component);
    this.tabItem.comInstance = component;
    if (component && component.init) {
      component.init(this.tabItem);
    }
    // console.log(componentRef);

  }

  /**
   * 动态加载组件：使用ReflectiveInjector注入参数
   */
  loadComponentsWidthInjector() {
    if (!this.tabItem.params) {
      this.tabItem.params = { flag: '' };//避免没有传值页面报错
    }
    let inputProviders = Object.keys(this.tabItem.params).map(
      (inputName) => {
        return {
          provide: inputName, useValue: this.tabItem.params[inputName]
        };
      });
    let resolvedInputs = ReflectiveInjector.resolve(inputProviders);
    let dynamicComponentContainer = this.tabHost.viewContainerRef;

    let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs,
      dynamicComponentContainer.parentInjector);

    let factory = this.componentFactoryResolver.resolveComponentFactory(this.tabItem.component);

    let component = factory.create(injector);

    dynamicComponentContainer.insert(component.hostView);

    // this.destoryCurrent();

    // this.currentComponent = component;
  }

  ngOnDestroy() {
    this.destoryCurrent();
  }
  destoryCurrent() {
    if (this.currentComponent) {
      console.log("destory");
      console.log(this.currentComponent.instance);
      this.currentComponent.destroy();
    }
  }
}
