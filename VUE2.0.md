# VUE 2.0

### 一、基础用法

<img src='VUE2.0.assets/image-20211119094009931.png' align='left' style="zoom: 50%;" />

#### 1.vue cli

1.1 安装vue脚手架

<img src="VUE2.0.assets/image-20211119144114873.png" alt="image-20211119144114873" style="zoom: 25%;" align="left"/>

1.2 查看vue脚手架版本

vue -V

1.3查看vue版本

npm list vue

#### 2.单文件组件

<img src="VUE2.0.assets/image-20211119144604251.png" alt="image-20211119144604251" style="zoom:25%;" align="left"/>

#### 3.命名规则

<img src="VUE2.0.assets/image-20211119144825249.png" alt="image-20211119144825249" style="zoom:25%;" align="left"/>

------

<img src="VUE2.0.assets/image-20211119145520812.png" alt="image-20211119145520812" style="zoom:25%;" align="left"/>

3.1 产生实例的都用大驼峰命名(PascalCase)，因为我们的js类和组件都可以产生多个实例

3.2 kebab-case 烤肉串命名方式，在HTML当中是大小写不敏感的，正是因为这样，我们在模板当中约定采用烤肉串的方式命名

3.3 有人会问组件名称为大驼峰，变量名为小驼峰，怎么在模版当中可以通过烤肉串的方式使用呢，那是因为在vue当中会存在值的映射，将大小驼峰映射成烤肉串形式，我们在模板当中写的标签最终会被编译成PascalCase的js类

#### 4.模板

##### 4.1模板语法

> vue.js 使用了基于html的模板语法，所有vue.js的模板都是合法的html，所以能被遵循规范的浏览器和html解析器解析

##### 4.2 模板插值

> <img src="VUE2.0.assets/image-20211119151144989.png" alt="image-20211119151144989" style="zoom:25%;" align="left"/>

##### 4.3 指令

> 指令是带有v-前缀的特殊特性，当表达式的值发生改变时将其产生的原带影响,响应式的作用到该dom节点上
>
> v-on 事件绑定，可简写成冒号:
>
> v-bind 属性绑定，可简写成艾特符号@

##### 4.4 条件渲染

> v-if会根据响应式的参数，在切换过程中条件块的事件监听和子组件会被虚拟dom销毁和重建
>
> <img src="VUE2.0.assets/image-20211119152415770.png" alt="image-20211119152415770" style="zoom:25%;" align="left"/>

##### 4.5  列表循环

> 不推荐在同一元素上使用v-if和v-for
>
> 非得用的话，记住v-for的优先级高于v-if
>
> <img src="VUE2.0.assets/image-20211119152936378.png" alt="image-20211119152936378" style="zoom:25%;" align="left"/>

##### 4.6 ref

> ref访问子组件或者dom节点（获取dom节点的this）
>
> 通过ref可以拿到子组件或者dom节点的方法和属性
>
> ⚠️：只有在组件或者dom节点被渲染出来以后，才能通过this.$refs去访问
>
> <img src="VUE2.0.assets/image-20211119153230024.png" alt="image-20211119153230024" style="zoom:25%;" align="left"/>

##### 4.7 JSX

> 首先我们得抛弃我们template，然后声明rander()函数
>
> JSX-条件渲染
>
> <img src="VUE2.0.assets/image-20211119153844751.png" alt="image-20211119153844751" style="zoom:25%;" align="left"/>
>
> JSX-列表循环
>
> <img src="VUE2.0.assets/image-20211119153942325.png" alt="image-20211119153942325" style="zoom:28%;" align="left"/>

#### 5.数据

##### 5.1 data & prop

> ）data为什么是个函数而不是对象？
>
> 起因：js对象都是通过引用地址关联的，通过直接引用赋值的另一个变量在其修改值时会影响这个引用地址内的数据变化。即修改1处影响多处的可能。
>
> 那么如何杜绝这种影响？
>
> 结果：返回一个生产data的函数，这个组件产生的每一个实例才能维持一份被返回对象的独立拷贝，即函数作用域私有性质
>
> 
>
> ）prop 父传递子
>
> <img src="VUE2.0.assets/image-20211119155828794.png" alt="image-20211119155828794" style="zoom:25%;" align="left"/>
>
> 
>
> ）prop属性校验
>
> <img src="VUE2.0.assets/image-20211119162331045.png" alt="image-20211119162331045" style="zoom:25%;" align="left"/>

##### 5.2 单向数据流

> <img src="VUE2.0.assets/image-20211119161651444.png" alt="image-20211119161651444" style="zoom:25%;" align="left"/>
>
> vue是单向数据流的，父组件的数据更新会向下流到子组件，为什么反过来this.parentName则不行？
>
> 原因：在js中数组和对象都是通过引用传递的，对于一个对象或者数组的prop来说，去改变这个prop对象或者数组本身将会影响到父子组件状态，当子组件层级过多或子组件被引用多个地方的话，我们难以知道数据具体是在哪里修改了，会导致应用数据难以理解。
>
> 结果：所以不能这样做是防止子组件意外的去改变父组件的状态。

##### 5.3 计算属性 & 侦听器



##### 5.4 数组操作

### 二、高阶用法

<img src="VUE2.0.assets/image-20211119094646318.png" alt="" style="zoom: 50%;" align='left'/>

### 三、响应式源码分析

<img src="VUE2.0.assets/image-20211119095225509.png" alt="image-20211119095225509" style="zoom: 50%;" align="left"/>

### 四、VUE生态以及源码分析

<img src="VUE2.0.assets/image-20211119095417792.png" alt="image-20211119095417792" style="zoom: 50%;" align="left"/>

##### test



