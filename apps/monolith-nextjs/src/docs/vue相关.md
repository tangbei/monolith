---
title: "vue相关"
date: "2025-11-09 18:32:20"
keyword: ["响应式原理", "组件通信"]
description: "前端面试中 Vue 相关的考察内容非常广泛"
nav: 文章
order: 6
group:
  title: 概念&原理
  order: 1
---


### Q1. vue和react的虚拟dom区别?
  1. 设计理念和更新机制不同：
       1. React中，当state或props发生变化时，组件会重新渲染（即调用render），生成新的虚拟DOM树，react遵循的是数据不可变原则，通常我们使用setState来更新状态，然后react会重新渲染整个组件；react更新是从根节点开始，递归调用组件的render方法，生成新的虚拟DOM树，然后进行DIff；
       2. 在Vue中，是通过响应式系统，在初始化时对数据对象进行递归遍历，用Object.defineProperty()或者Object.proxy()去设置getter/setter；当数据变化时，会触发setter，然后通知到对应的watcher，进而触发组件的重新渲染；vue的组件更新时更细粒度的，每个组件都有一个对应的watcher，当数据变化时，只会重新渲染依赖了该数据的组件；
  2. diff算法不同：
       1. React中，比较两棵虚拟DOM树时，react会优先比较根节点，如果根节点类型不同，react会直接拆卸旧的树，建立新的树；如果根节点类型相同，react会保留DOM节点，仅更新有变化的属性；然后递归处理子节点，对于列表，react会使用key来匹配新旧节点、如果没有key，则按照顺序比较且会导致性能存在问题；
       2. 在vue中，虽然与react算法类似，也是同层比较，但是在比较子节点时，vue会使用双端比较的策略，同时从新旧列表的头尾进行比较，知道有一端遍历完成，然后处理剩下的节点，能够最大程度的服用节点，减少移动次数；
  3. 组件更新策略不同：
      1. React的更新是自顶而下的，一旦父组件更新，默认情况下所有子组件都会更新，所以需要开发者注意性能优化；
      2. Vue的更新是组件级别的，每个组件都是独立的，当数据变化时，只有依赖了该数据的组件会重新渲染，由于vue是响应式系统，所以在初始化时就收集了依赖，所以更新更加精准；
   
### Q2: vue2和vue3的响应式原理

1. Vue2的响应式原理\
    Vue2的响应式系统基于Object.defineProperty。它通过递归遍历数据对象，将每个属性转换为getter和setter，从而在属性被访问和修改时进行依赖收集和派发更新。

    实现步骤：\
    初始化：遍历数据对象，对每个属性使用Object.defineProperty重新定义。

    依赖收集：在getter中，将当前正在计算的Watcher（即依赖）添加到Dep中。

    派发更新：在setter中，通知Dep中的所有Watcher进行更新。

2. Vue3的响应式原理\
    Vue3使用Proxy来创建响应式对象。Proxy可以拦截对象的基本操作，包括属性访问、赋值、删除等，不需要遍历属性，并且可以支持数组和动态添加的属性。

    实现步骤：\
    创建响应式对象：使用Proxy包装目标对象，在get、set、deleteProperty等操作中拦截。

    依赖收集：在get操作中，将当前活跃的effect（依赖）添加到依赖图中。

    派发更新：在set、deleteProperty等操作中，从依赖图中取出对应的effect并执行。

### Q3. 谈一谈对MVVM的理解。
* MVVM是model-view-viewModel的缩写，也就是把mvc中的controller层演变为ViewModel层；
* Model代表的是数据模型，View代表的是UI组件，ViewModel是View和Model层的桥梁
* 数据会绑定到ViewModel层并自动渲染到页面中，试图变化的时候会通知ViewModel层去更新数据。