import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SharedModule } from '../shared/shared.module';

import {
  HeaderComponent,
  MenuComponent,
  TabTplComponent,
  AntTabsetComponent,
  ReuseTabContextComponent,
  ReuseTabContextMenuComponent,
  ContentHeaderComponent,
  ReuseTabComponent,
  ReuseTabsetComponent,
  TabNavComponent
} from './components';

import {
  ReuseTabContextService,
  ReuseTabService,
  TabService,
  MenuService,
} from './services';
import { ReuseTabContextDirective } from './directives/reuse-tab-context.directive';
import { TabLabelDirective } from './directives/tab-label.directive';
import { TabContentDirective } from './directives/tab-content.directive';
import { CustomeRouteReuseStrategy } from './route-reuse-strategy';
import { LayoutRoutingModule } from './layout-routing.module';
@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    LayoutComponent,
    AntTabsetComponent,
    TabTplComponent,
    ReuseTabContextMenuComponent,
    ReuseTabContextComponent,
    ContentHeaderComponent,
    ReuseTabComponent,
    ReuseTabsetComponent,
    ReuseTabContextDirective,
    TabLabelDirective,
    TabContentDirective,
    TabNavComponent
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    SharedModule,
    RouterModule,
    LayoutRoutingModule,
  ],
  providers: [
    ReuseTabContextService,
    ReuseTabService,
    TabService,
    MenuService,
    {
      provide: RouteReuseStrategy,
      useClass: CustomeRouteReuseStrategy,
      deps: [ReuseTabService]
    }

  ],
  exports: [
    LayoutComponent
  ],
  entryComponents: [
    ReuseTabContextMenuComponent
  ],
})
export class LayoutModule { }
