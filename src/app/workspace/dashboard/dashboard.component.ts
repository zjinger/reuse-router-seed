import { BaseService } from './../../shared/services/base.service';
import { DashboardService } from './dashboard.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(private service: DashboardService) {

  }

  ngOnInit() {
    console.log('dashboard init');
    this.service.baseService.getList({ currentPage: 1, pageRecord: 10 }).then(res => {
      console.log(res)
    })
  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log('dashboard destroyed');
  }
}
