class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm
    this.expr = expr
    this.cb = cb
    // debugger
    Dep.target = this

    this.oldValue = this.getVMValue(vm, expr)
    // 此时已经进入了get，watcher实例已经存储到了dep.subs中，如果不清除Dep.target，那么dep.subs就会无限增加
    Dep.target = null


  }

  update() {
    console.log('diaoyongle、')
    let oldValue = this.oldValue
    let newValue = this.getVMValue(this.vm, this.expr)
    if(oldValue !== newValue) {
      this.cb(newValue, oldValue)
    }
  }

  //用于获取vm中的数据
  getVMValue(vm, expr) {
    // 获取到data中的数据
    let data = vm.$data
    expr.split(".").forEach(key => {
      data = data[key]
    })
    return data
  }
}


class Dep {
  constructor() {
    this.subs = []
  }

  // 添加订阅者
  addSub(watcher) {
    this.subs.push(watcher)
  }

  // 遍历订阅者., 调用update
  notify() {
    this.subs.forEach( sub => {
      sub.update()
    })
  }
}