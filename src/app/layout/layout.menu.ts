export const SYSTEM_MENU: any[] = [
  {
    title: '管理控制',
    icon: '',
    link: 'admin',
    children: [
      {
        title: '实时监控',
        icon: 'fa fa-align-justify',
        link: '/admin/dashboard',
        selected: true,
        open: true
      },
      {
        title: '检测站点管理',
        icon: 'fa fa-weixin',
        link: '/admin/third/ckeditor'
      }
    ]
  },
  {
    title: '实时监控2',
    icon: 'fa fa-align-justify',
    link: '/admin/third/select2'
  }
  ,
  {
    title: '管理控制3',
    icon: '',
    link: 'admin/third',
    children: [
      {
        title: '实时监控3',
        icon: 'fa fa-align-justify',
        link: '/admin/third/treeview'
      }
    ]
  }
]

