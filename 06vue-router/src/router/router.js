import Vue from "vue";
import RouterView from "./components/RouterView";
import RouterLink from "./components/RouterLink";

Vue.component("RouterView", RouterView);
Vue.component("RouterLink", RouterLink);

// 2.1.Router与组件关联关系
class RouterTable {
  constructor(routes) {
    // 2.2._pathMap管理与组件的关系
    this._pathMap = new Map();
    // 2.3.init函数初始化route
    this.init(routes);
  }
  init(routes) {
    // 2.4.将routes添加到_pathMap进行管理
    const addRoute = route => {
      this._pathMap.set(route.path, route);
    // 如果有嵌套的子路由那么需要if判断一下对子路由进行递归添加到_pathMap。
    // if (route.children) {
    // 添加到上一级路由（父）
    // }
    };
    // 2.5.遍历所有routes并添加，
    routes.forEach(route => addRoute(route));
  }
  // 2.6.路由路径匹配
  match(path) {
    let find;
    for (const key of this._pathMap.keys()) {
      // 实际这里会有正则规则进行校验
      if (path === key) {
        find = key;
        break;
      }
    }
    // 返回匹配到的path
    return this._pathMap.get(find);
  }
}
import Html5Mode from "./history/html5";

// 注册路由守卫
function registerHook(list, fn) {
  list.push(fn);
  return () => {
    const i = list.indexOf(fn);
    if (i > -1) list.splice(i, 1);
  };
}

export default class Router {
  // 1.路由信息传递进来
  constructor({ routes = [] }) {
    // 2.路由表实例化，构建路由与组件关联管理
    this.routerTable = new RouterTable(routes);
    // 3.监听路由变化，
    this.history = new Html5Mode(this);
    this.beforeHooks = [];
    this.resolveHooks = [];
    this.afterHooks = [];
  }
  init(app) {
    const { history } = this;
    history.listen(route => {
      app._route = route;
    });
    history.transitionTo(history.getCurrentLocation());
  }
  push(to) {
    this.history.push(to);
  }
  beforeEach(fn) {
    return registerHook(this.beforeHooks, fn);
  }
  beforeResolve(fn) {
    return registerHook(this.resolveHooks, fn);
  }
  afterEach(fn) {
    return registerHook(this.afterHooks, fn);
  }
}

Router.install = function() {
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router !== undefined) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, "_route", this._router.history.current);
      } else {
        this._routerRoot = this.$parent && this.$parent._routerRoot;
      }
    }
  });
};
