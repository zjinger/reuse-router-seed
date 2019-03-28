import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit, OnDestroy {

  menuList: any[] = [];
  protected _menuItemsSub: Subscription;
  constructor(
    private _service: MenuService,
  ) { }

  ngOnInit() {
    this._menuItemsSub = this._service.menuItems.subscribe((items) => {
      setTimeout(() => {
        this.menuList = items;
      });
    });
  }
  ngOnDestroy(): void {
    this._menuItemsSub.unsubscribe();
  }
}
