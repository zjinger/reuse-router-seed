export class TabComponent {
    index?: number;//下标
    label?: string;//
    title?: string;//标题
    active?: boolean;//是否是激活（选中）状态
    disabled?: boolean;//是否禁用
    closable?: boolean;//是否可以关闭
    url?: string;
    last?: boolean;//是否最后一个tab
    constructor() { }
}
