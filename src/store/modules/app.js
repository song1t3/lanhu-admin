import { Login } from "@/api/login";
import {
  setToken,
  removeToken,
  setUserName,
  getUserName,
  removeUserName
} from "@/utils/app";
const state = {
  isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
  to_ken: "",
  username: getUserName() || ""
};
const getters = {
  isCollapse: state => state.isCollapse
};
const mutations = {
  SET_COLLAPSE(state) {
    state.isCollapse = !state.isCollapse;
    //html5本地存储(临时存储)
    sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse));
  },
  SET_TOKEN(state, value) {
    state.to_ken = value;
  },
  SET_USERNAME(state, value) {
    state.username = value;
  }
};
const actions = {
  login({ commit }, requestData) {
    return new Promise((resolve, reject) => {
      // 登录接口
      Login(requestData)
        .then(response => {
          let data = response.data.data;
          // content.commit("SET_TOKEN", data.token);
          // content.commit("SET_USERNAME", data.username);
          // 解构
          commit("SET_TOKEN", data.token);
          commit("SET_USERNAME", data.username);
          setToken(data.token);
          setUserName(data.username);
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  exit({ commit }) {
    return new Promise(resolve => {
      removeToken();
      removeUserName();
      commit("SET_TOKEN", "");
      commit("SET_USERNAME", "");
      resolve();
    });
  }
};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
