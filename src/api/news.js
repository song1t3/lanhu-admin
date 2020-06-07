import service from "@/utils/request";
// 获取信息列表
export function GetList(data) {
  return service.request({
    method: "post",
    url: "/news/getList/",
    data
  });
}
// 编辑信息
// 修改信息分类
export function EditInfo(data) {
  return service.request({
    method: "post",
    url: "/news/editInfo/",
    data
  });
}
// 添加信息
export function AddInfo(data) {
  return service.request({
    method: "post",
    url: "/news/add/",
    data
  });
}
// 修改信息分类
export function EditCategory(data) {
  return service.request({
    method: "post",
    url: "/news/editCategory/",
    data
  });
}
// 删除信息
export function DeleteInfo(data) {
  return service.request({
    method: "post",
    url: "/news/deleteInfo/",
    data
  });
}
// 删除分类
export function DeleteCategory(data) {
  return service.request({
    method: "post",
    url: "/news/deleteCategory/",
    data
  });
}
//一级分类添加
export function AddFirstCategory(data) {
  return service.request({
    method: "post",
    url: "/news/addFirstCategory/",
    data
  });
}
//信息分类添加子级
export function AddChildrenCategory(data) {
  return service.request({
    method: "post",
    url: "/news/addChildrenCategory/",
    data
  });
}
//获取一级分类
export function GetCategory(data) {
  return service.request({
    method: "post",
    url: "/news/getCategory/",
    data
  });
}
//获取全部分类（包含子级）
export function GetCategoryAll(data) {
  return service.request({
    method: "post",
    url: "/news/getCategoryAll/",
    data
  });
}
