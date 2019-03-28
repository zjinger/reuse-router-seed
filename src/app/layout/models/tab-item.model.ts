import { Type } from '@angular/core';

export class TabItem {
  label?: string;//tab 的标题
  key?: string;//
  title?: string;//左侧导航栏的标题
  unremovable?: boolean;//是否可以移除
  active?: boolean;
  component?: Type<any>;//需要加载的实例
  comInstance?: any;//加载后的instance
  icon?: string;//图标
  selected?: boolean;//是否选中
  params?: any;//组件跳转传递的参数
  componentsName?: string;//组件的名称
  authority?: string | string[];//权限
}

export class TabItemParams {
  pid?: string;
  id?: string;
  data?: any;
  flag?: any;
}
