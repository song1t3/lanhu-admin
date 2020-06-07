import axios from "axios";
import { Message } from "element-ui";
import { getToken, getUserName } from "./app";
//创建axios赋给变量service
//API地址，http://www.web-jshtml.cn/productApi
const BASEURL = process.env.NODE_ENV === "production" ? "" : "devApi";
const service = axios.create({
  baseURL: BASEURL,
  timeout: 15000 //超时时间
});
//请求前做一些数据处理(请求拦截器)
service.interceptors.request.use(
  function(config) {
    //在发送请求之前做一些事情
    config.headers["Tokey"] = getToken();
    config.headers["UserName"] =getUserName();
    return config;
  },
  function(error) {
    //做一些有请求错误的事情
    return Promise.reject(error);
  }
);

//添加响应拦截器
service.interceptors.response.use(
  function(response) {
    //使用响应数据返回响应·；
    // console.log(response);
    let data = response.data;
    if (data.resCode !== 0) {
      Message.error(data.message);
      return Promise.reject(data);
    } else {
      return response;
      // return Promise.resolve(data);
    }
  },
  function(error) {
    //使用响应错误返回
    return Promise.reject(error);
  }
);

export default service;

//使用export default时，但不能同时存在多个default，文件import不需要花括号
