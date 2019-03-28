import { Component, OnInit } from '@angular/core';
import { MenuService } from './services/menu.service';
import { Routes } from '@angular/router';
import { SYSTEM_MENU } from './layout.menu';

@Component({
  selector: 'app-layout',
  template: `
  <nz-layout class="app-layout">
  <app-header></app-header>
  <nz-layout class="layout-content">
    <!-- 使用动态组件加载 -->
    <!-- <app-ant-tabset></app-ant-tabset>-->
    <!-- 使用路由复用 -->
    <layout-content-header></layout-content-header>
    <nz-content >
    <router-outlet></router-outlet>
    </nz-content>
  </nz-layout>
</nz-layout>
  `,
  styles: [
    `.app-layout {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .layout-content {
      margin-top: 64px;
        position: fixed;
      width: 100%;
      height: 100%;
      padding: 0 2px;
    }
    `
  ]
})
export class LayoutComponent implements OnInit {

  constructor(
    private menuService: MenuService,
  ) { }

  ngOnInit() {
    this.menuService.updateMenuByRoutes(<Routes>SYSTEM_MENU);
  }

}
