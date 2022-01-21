let active;
let effect = (fn, options = {}) => {
  let handle = (...args) => {
    try {
      active = handle;
      return fn(...args);
    } finally {
      active = null;
    }
  };
  handle.options = options
  return handle;
};
let watchEffect = (cb) => {
  let renner = effect(cb);
  renner();
};
let queue = [];
let nextTick = (cb) => {
  return Promise.resolve().then(cb);
};

let flushJobs = () => {
  let job;

  while (queue.length > 0) {
    job = queue.shift();
    job && job();
  }
};

let queueJob = (dep) => {
  if (!queue.includes(dep)) {
    queue.push(dep);
    nextTick(flushJobs);
  }
};

class Dep {
  constructor() {
    this.deps = new Set();
  }
  depend() {
    if (active) {
      this.deps.add(active);
    }
  }
  notify() {
    this.deps.forEach((dep) => queueJob(dep));
    this.deps.forEach((dep) => {
        dep.options && dep.options.scheduler && dep.options.scheduler()
    });
  }
}

let ref = (initValue) => {
  let value = initValue;
  let dep = new Dep();

  return Object.defineProperty({}, "value", {
    get() {
      dep.depend();
      return value;
    },
    set(newValue) {
      value = newValue;
      dep.notify();
    },
  });
};

let computed = (fn) => {
  let value;
  let dirty = true; // 缓存：当dirty为true时，computed才会发生计算。dirty为false，直接返回value进行缓存。
  let renner = effect(fn, {
    scheduler: () => {
      if (!dirty) {
        dirty = true;
      }
    },
  });

  return {
    get value() {
      if (dirty) {
        value = renner();
        dirty = false;
      }
      return value;
    },
  };
};

let count = ref(0);
let computedValue = computed(() => count.value + 3);
document.getElementById("add").addEventListener("click", function () {
  count.value++;
});

// Effect其实和watch一样的功能，里面的数据变化就会执行函数体
watchEffect(() => {
  str = `hello ${count.value} ${computedValue.value}`;
  document.getElementById("app").innerText = str;
});
