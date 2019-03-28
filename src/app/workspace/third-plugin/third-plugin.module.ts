// import { InMemoryDataService } from './leafjs/in-memory-data.service';
import { NgModule } from '@angular/core';
import { ThirdPluginRoutingModule } from './third-plugin-routing.module';
import {
  CkeditorComponent,
  TreeviewComponent,
  InputSelect2Component,
} from './index';
import { HttpClientModule } from '@angular/common/http';
// import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

const COMPONENTS = [
  CkeditorComponent,
  TreeviewComponent,
  InputSelect2Component,
]
@NgModule({
  imports: [
    ThirdPluginRoutingModule,
    HttpClientModule,
  ],
  declarations: [
    ...COMPONENTS,
  ]
})
export class ThirdPluginModule { }
