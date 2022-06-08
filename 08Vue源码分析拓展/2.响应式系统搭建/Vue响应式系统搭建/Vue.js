(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
		(global.Vue = factory());
})(this, function() {
	//Vue.options.components
	//Vue.component..  Vue.directive..
	var ASSET_TYPES = [
		'component',
		'directive',
		'filter'
	];

	var LIFECYCLE_HOOKS = [
		'beforeCreate',
		'created',
		'beforeMount',
		'mounted',
		'beforeUpdate',
		'updated',
		'beforeDestroy',
		'destroyed',
		'activated',
		'deactivated',
		'errorCaptured'
	];

	//全局配置对象
	var config = {
		optionMergeStrategies: Object.create(null),
	}

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	function hasOwn(obj, key) {
		return hasOwnProperty.call(obj, key)
	}

	function isPlainObject(obj) {
		return toString.call(obj) === "[object Object]"
	}

	function isReserved(str) {
		var c = (str + '').charCodeAt(0);   //获取Unicode 编码  0-65535
		return c === 0x24 || c === 0x5F     // 十六进制的Unicode 编码  $ === 0x24  _ === 0x5F
	}

	var strats = config.optionMergeStrategies; // var strats = {}
	//自定义策略处理
	strats.data = function(parentVal, childVal, vm) {
		if (!vm) {
			if (childVal && typeof childVal !== "function") {
				console.error("data选项应该为函数 返回组件中每个实例的值")
			}
			//处理子组件data的选项
			return mergeDataOrFn(parentVal, childVal)
		}
		//处理根实例data的选项
		return mergeDataOrFn(parentVal, childVal, vm)
	}

	function mergeDataOrFn(parentVal, childVal, vm) {
		if (!vm) {
			//1: 子组件中的parentVal childVal 都应该是函数
			/*
			会遇到的情况:
			1: parentVal === undefined   return childVal
			2: childVal === undefined   return parentVal
			3: parentVal ===  function(){}  childVal ===  function(){}  mergeData  把两者的返回值对象合并成一个
			*/
		} else {
			return function mergedInstanceDataFn() {
				return typeof childVal === 'function' ? childVal.call(vm, vm) : childVal;
			}
		}
	}

	//所有钩子函数的自定义策略  parentVal === undefined   childVal === function(){}   [function(){}]
	function mergeHook(parentVal, childVal) {
		//parentVal 数组
		return childVal ?
			parentVal ?
			parentVal.concat(childVal) :
			Array.isArray(childVal) ?
			childVal : [childVal] :
			parentVal
	}
	LIFECYCLE_HOOKS.forEach(function(hook) {
		strats[hook] = mergeHook;
	})
	// "所有" 选择的默认策略
	var defaultStrat = function(parentVal, childVal) {
		return childVal === undefined ?
			parentVal :
			childVal
	};


	function mergeOptions(parent, child, vm) {
		/*选项规范检测  Components  Props  Inject  Directives */
		var options = {};
		var key;
		for (key in parent) { //components
			mergeField(key);
		}
		for (key in child) { //components
			if (!hasOwn(parent, key)) {
				mergeField(key);
			}
		}
		//选项的策略处理 el data  生命周期的钩子函数  ....
		//自定义策略（strats对象）  默认策略
		function mergeField(key) {
			var strat = strats[key] || defaultStrat;
			options[key] = strat(parent[key], child[key], vm, key); //options.data
		}
		return options;
	}

	function callHook(vm, hook) {
		var handlers = vm.$options[hook];
		if (handlers) {
			for (var i = 0, j = handlers.length; i < j; i++) {
				handlers[i].call(vm);
			}
		}
	}
	var sharedPropertyDefinition = {
		enumerable: true,
		configurable: true,
		get: noop,
		set: noop
	};

	// target === vm, sourceKey === "_data", key === key 属性名称
	function proxy(target, sourceKey, key) {
		sharedPropertyDefinition.get = function proxyGetter() {
			return this[sourceKey][key] // 实质获取属性值，this === vm, vm._data[key]
		};
		sharedPropertyDefinition.set = function proxySetter(val) {
			this[sourceKey][key] = val; // 实质修改属性值vm._data[key] = "xxx"
		};
		// 这里给vm添加了[key]属性的监听，所以我们能通过vm[key]获取到值，但是如果该key是不合法的将不会触发proxy方法。
		Object.defineProperty(target, key, sharedPropertyDefinition);
	}

	function initState(vm) {
		// 初始化数据状态内容有很多，比如data，methods，computed，这里拿data来举例。
		var opts = vm.$options;
		if (opts.data) { //data == mergedInstanceDataFn
			initData(vm);
		} else {
			observe(vm._data = {}, true /* asRootData */ );
		}
	}

	function initData(vm) {
		//校验数据对象data是否是一个纯对象
		var data = vm.$options.data; //  函数  mergedInstanceDataFn
		console.log("data策略处理返回的方法：", data)
		// 我们都知道data在经过合并策略处理之后返回的是一个有名函数，
		// 那么data有必要还进行类型校验吗？当然是要的，因为可以其它地方更改data的类型，比如在生命周期中。
		data = vm._data = typeof data === 'function' ?
			data(vm, vm) :
			data || {};
		if (!isPlainObject(data)) {
			data = {};
			console.error(
				'data functions should return an object:\n' +
				'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
				vm
			);
		}

		// proxy data on instance
		var keys = Object.keys(data); //数据对象上的属性  root
		var props = vm.$options.props;
		var methods = vm.$options.methods;
		var i = keys.length;
		while (i--) {
			var key = keys[i]; {
				if (methods && hasOwn(methods, key)) {
					//methods 对象上的 key 属性 已经被定义为data数据对象属性。
					console.error(
						("Method \"" + key + "\" has already been defined as a data property."),
						vm
					);
				}
			}
			if (props && hasOwn(props, key)) {
				// data的数据属性 key 因为成为props 的prop  prop 是该属性的默认值。
				console.error(
					"The data property \"" + key + "\" is already declared as a prop. " +
					"Use prop default value instead.",
					vm
				);
			} else if (!isReserved(key)) {   //$  _
				//数据代理的时候 是否有不合法的属性
				proxy(vm, "_data", key);
			}
		}
		// observe data  开启响应式之路
		//observe(data, true /* asRootData */ );
	}


	function initMixin(Vue) {
		Vue.prototype._init = function(options) {
			var vm = this;
			//选项合并
			vm.$options = mergeOptions(Vue.options, options || {}, vm);
			callHook(vm, 'beforeCreate');
			initState(vm); //数据初始化  data
		}
	}



	//config
	function initGlobalAPI(Vue) {
		var configDef = {};
		configDef.get = function() {
			return config;
		}
		configDef.set = function(newval) {
			console.error("不要尝试修改Vue.config的引用")
		}
		Object.defineProperty(Vue, 'config', configDef); //监听你对Vue.config
	}

	function initExtend(Vue) {
		/*用于原型继承  缓存构造函数*/
		Vue.cid = 0;
		var cid = 1;
		Vue.extend = function(extendOptions) {
			extendOptions = extendOptions || {};
			var Super = this; //Super  === Vue
			var SuperId = Super.cid;
			//缓存检测 cachedCtors
			var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
			//缓存处理  cachedCtors[0] = 子类的引用
			if (cachedCtors[SuperId]) {
				return cachedCtors[SuperId]
			}
			var name = extendOptions.name || Super.options.name;
			if (name) {
				//validateComponentName(name);   //规范检测
			}

			//子类 构造函数
			var Sub = function VueComponent(options) {
				this._init(options);
			};
			//{}.__proto__ = Super.prototype = Vue.prototype
			Sub.prototype = Object.create(Super.prototype);
			Sub.prototype.constructor = Sub;
			Sub.cid = cid++;
			//Super == Vue  Vue.component  注册全局组件   Vue.options.components  内置的抽象组件
			ASSET_TYPES.forEach(function(type) {
				Sub[type] = Super[type];
			});
			//组件在初始化 mergeOptions  选项的合并 => 规范的检测  => 策略的处理
			Sub.options = mergeOptions(
				Super.options, //Vue.options
				extendOptions //组件的选项对象
			);
			console.log(Sub.options)
			cachedCtors[SuperId] = Sub;
			return Sub;
		}
	}

	function Vue(options) {
		if (!(this instanceof Vue)) {
			console.error('Vue is a constructor and should be called with the `new` keyword');
		}
		this._init(options);
	}

	Vue.options = Object.create(null); //Vue.options = {}
	ASSET_TYPES.forEach(function(type) {
		Vue.options[type + 's'] = Object.create(null); //Vue.options.components
	});

	initMixin(Vue);
	initGlobalAPI(Vue);
	initExtend(Vue);
	return Vue;
});
