import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Routes } from '@angular/router';
import * as _ from 'lodash';
@Injectable()
export class MenuService {
  menuItems = new BehaviorSubject<any[]>([]);
  constructor() { }
  public updateMenuByRoutes(routes: Routes) {
    let items = _.cloneDeep(routes);
    this.menuItems.next(items);
  }
}
