class Compile {
  constructor(el, vm) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el
    this.vm = vm
    if(this.el) {
      //1, 把el中所有的子节点放入到内存中
      let fragment = this.node2Fragment(this.el)
      // 2,在内存中编译fragment
      this.compile(fragment)
      // 3，把fragment一次性添加到页面
      this.el.appendChild(fragment)
    }
  }

  // 核心方法
  node2Fragment(node) {
    let fragment = document.createDocumentFragment()
    let childNodes = node.childNodes
    this.toArray(childNodes).forEach(node => {
      fragment.appendChild(node)
    });
    return fragment
  }

  // 编译文档碎片fragment
  compile(fragment) {
    console.log('编译了？')
    let childNodes = fragment.childNodes
    this.toArray(childNodes).forEach( node => {
      if(this.isElementNode(node)) {
        this.compileElement(node)
      }
      if(this.isTextNode(node)) {
        this.compileText(node)
      }
      if(node.childNodes && node.childNodes.length > 0) {
        this.compile(node)
      }
    })
  }

  // 解析标签
  compileElement(node) {
    let attributes = node.attributes
    this.toArray(attributes).forEach(attr => {
      let attrName = attr.name
      if(this.isDirective(attrName)) {
        let type = attrName.slice(2)
        let expr = attr.value
        CompileUtil[type](node, this.vm, expr)
      }
    })
  }
  // 解析文本节点
  compileText(node) {
    CompileUtil.mustache(node, this.vm)
  }



  // 工具方法
  toArray(likeArray) {
    return [].slice.call(likeArray)
  }

  isElementNode(node) {
    return node.nodeType === 1
  }
  isTextNode(node) {
    return node.nodeType === 3
  }
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
}

let CompileUtil = {
  mustache(node, vm) {
    let txt = node.textContent
    let reg = /\{\{(.+)\}\}/
    if (reg.test(txt)) {
      console.log(txt)
      let expr = RegExp.$1
      // debugger
      node.textContent = txt.replace(reg, this.getVMValue(vm, expr))

    }
  },
  // 处理v-text指令
  text(node, vm, expr) {
    node.textContent = this.getVMValue(vm, expr)
    new Watcher(vm, expr, (newValue, oldValue) => {
      node.textContent = newValue
    })
  },
  // 处理v-html
  html(node, vm, expr) {
    node.innerHTML = this.getVMValue(vm, expr)
    new Watcher(vm, expr, (newValue, oldValue) => {
      node.innerHTML = newValue
    })
  },
  // v-model 双向数据绑定
  model(node, vm, expr) {
    // let self = this
    // node.value = this.getVMValue(vm, expr)
    // // 实现双向的数据绑定， 给node注册input事件，当当前元素的value值发生改变，修改对应的数据
    // node.addEventListener("input", function() {
    //   self.setVMValue(vm, expr, this.value)
    // })


    let self = this

    node.value = this.getVMValue(vm, expr)

    node.addEventListener('input', function() {
      self.setVMValue(vm, expr, this.value)
    })
  },
  getVMValue(vm, expr) {
    let data = vm.$data
    expr.split(".").forEach(key => {
      data = data[key]
    })
    return data
  },
  setVMValue(vm, expr, value) {
    let data = vm.$data
    let arr = expr.split('.')
    arr.forEach((key, index) => {
      if(index < arr.length-1) {
        data = data[key]
      } else {
        data[key] = value
      }
    })
  }
}