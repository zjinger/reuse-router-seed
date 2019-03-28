import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'layout-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.less'],
})
export class ContentHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  tabChange($event) {
    // console.log('点击tab',$event);
  }
  tabClose($event) {
    // console.log('关闭tab', $event);
  }
}
