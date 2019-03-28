import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  CkeditorComponent,
  TreeviewComponent,
  InputSelect2Component,
} from './index';
const routes: Routes = [
  {
    path: 'ckeditor',
    component: CkeditorComponent,
    data: { title: 'CKEditor', reuseTitle: 'CKEditor' }
  },
  {
    path: 'treeview',
    component: TreeviewComponent,
    data: { title: 'Treeviwe', reuseTitle: 'Treeviwe' }
  },
  {
    path: 'select2',
    component: InputSelect2Component,
    data: { title: 'Select2', reuseTitle: 'Select2' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThirdPluginRoutingModule { }
