import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0,
  },
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  mutations: {
    addCount: (state,payload=1) => (state.count += payload),
  },
  actions: {
    // asyncAddCount里面的参数相当于vuex实例对象，然后通过解构拿到commit
    asyncAddCount({commit}) {
      setTimeout(()=>{
        commit("addCount");
      }, 1500)
    }
  },
  modules: {},
});
