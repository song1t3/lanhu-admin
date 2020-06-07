const state = {
//   传到详情页的参数
  id: "" || sessionStorage.getItem("infoId"),
  title: "" || sessionStorage.getItem("infoTitle")
};
const getters = {
  infoId: state => state.id,
  infoTitle: state => state.title
};
const mutations = {
  UPDATE_STATE_VALUE(state, params) {
    for(let key in params) {
        // 储存值
        state[key] = params[key].value;
        // 是否存储session
        if(params[key].session) {
            sessionStorage.setItem(params[key].sessionKey, params[key].value);  
        }
    }
  }
};
const actions = {
  
};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
