/**
 * 后台响应实体类
 */
export class Result {
  rlt?: number; //0 返回正确数据，1：接口调用失败
  info?: string; // 提示信息
  datas?: any; // 返回实体数据
}
