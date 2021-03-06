let active;
let watch = function(cb) {
  active = cb;
  active();
  active = null;
};
let queue = [];
let nextTick = cb => {
  return Promise.resolve().then(cb);
};

let flushJobs = () => {
  let job;

  while (queue.length > 0) {
    job = queue.shift();
    job && job();
  }
};

let queueJob = dep => {
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
    this.deps.forEach(dep => queueJob(dep));
  }
}

let ref = initValue => {
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
    }
  });
};

let x = ref(1);
let y = ref(2);
let z = ref(3);

let str;
watch(() => {
  str = `hello ${x.value} ${y.value} ${z.value}`;
  console.log(1, str);
  document.write(str);
});

x.value = 4;
y.value = 5;
z.value = 6;