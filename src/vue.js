// Vue的构造函数
class Vue {
  constructor(options = {}) {
    this.$el = options.el
    this.$data = options.data

    new Observer(this.$data)
    // debugger
    if(this.$el) {
      new Compile(this.$el, this)
    }
  }

  proxy(data) {
    Object.keys.forEach(key => {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          if(data[key] === newValue) {
            return
          }
          data[key] = newValue
        }
      })
    });
  }
}