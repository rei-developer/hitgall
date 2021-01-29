import Vue from 'vue'

const eventBus = {}

eventBus.install = function (Vue) {
  Vue.prototype.$eventBus = new Vue()
}

Vue.use(eventBus)
