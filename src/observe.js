/**
 * observer 用于给data中所有的数据添加getter和setter
 * 方便我们在获取或者设置data中数据的时候
 */
class Observer {
  constructor(data) {
    this.data = data
    this.walk(data)
  }

  // 核心方法
  // 遍历data中所有的数据，都添加上getter和setter
  walk(data) {
    if(!data || typeof data !== 'object') {
      return
    }
    Object.keys(data).forEach(key => {
      // 给data中的每一项加上getter和setter
      this.defineReactive(data, key, data[key])
    })
  }

  // 数据劫持
  defineReactive(obj, key, value) {
    let that = this
    let dep = new Dep()
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get () {
        console.log(dep)
        // 如果Dep.target中有watcher对象，储存到订阅者数组中
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set (newValue) {
        console.log('set?')
        // console.log(newValue)
        if (value === newValue) {
          return
        }
        value = newValue
        that.walk(newValue)
        dep.notify()
      }
    }) 

  }
}