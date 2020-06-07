import Vue from "vue";

import SvgIcon from "./SvgIcon";
//自定义全局组件
Vue.component("svg-ico", SvgIcon);

// require.context中3个的参数说明：
// 第一个：目
// 第二个：是否遍历子级目录
// 第三个：定义遍历文件规则
const req = require.context("./svg", false, /\.svg$/);
const requireAll = requireContext => {
  return requireContext.keys().map(requireContext);
};
requireAll(req);
