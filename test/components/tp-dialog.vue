<template>
  <div ref="dialog">
    <ml-comdes title="ml-dialog" :doc="doc" :code="code" height="500px">
      <el-button @click="alert">提示框</el-button>
      <el-button @click="confir">确认框</el-button>
      <el-button @click="prompt">输入框</el-button>
      <el-button @click="dialog">对话框</el-button>
    </ml-comdes>
  </div>
</template>

<script>
export default {
  name: 'tp-dialog',
  data() {
    return {
      doc: '依赖vuesax 的vs-dialog,封装之后，可以通过js调用对话框，方便及时使用；',
      code: `methods: {
    alert() {
      this.$mlalert(
        '这个是vuesax扩展的dialog',
        {
          description: '通过函数调用，而不是控制组件。'
        },
        this.$refs.dialog
      );
    },
    confir() {
      let _ = this;
      this.$mlconfir('这个是vuesax扩展的dialog', {
        ok(v) {
          _.$mlalert('已确认！');
        },
        cancle() {
          _.$mlalert('已取消！');
        }
      });
    },
    prompt() {
      let _ = this;
      this.$mlprompt('这个是vuesax扩展的dialog', {
        placeholder: '请输入',
        blur: true,
        ok(setting, value) {
          _.$mlalert('已确认输入：' + value);
        },
        cancle() {
          _.$mlalert('已取消！');
        }
      });
    },
    dialog() {
      let _ = this;
      this.$mldialog('这个是vuesax扩展的dialog', {
        blur: true,
        width: '600px',
        showOk: true,
        showCancle: true,
        component: 'tp-dialog-com',  //子组件，用于自定义对话框内容
        ok(setting, value) {
          _.$mlalert('已确认输入：' + value);
        },
        cancle() {
          _.$mlalert('已取消！');
        }
      });
    }
  }
  // 子组件：
  <template>
  <div style="text-align: left">
    <p>这个是自定义的嵌入组件</p>
    <p>
      需要定义一个getComponentValue方法，用于被外部组件获取值：getComponentValue()
      { return this.value1; }
    </p>
    <p>或使用事件$emit触发事件ok、cancle，自定义确认和取消返回值</p>
    <el-input v-model="value1"></el-input>
    <el-input v-model="value2"></el-input>
    <el-button @click="click"
      >自定义确认（this.$emit('ok', this.value2)）</el-button
    >
  </div>
</template>

// script
export default {
  name: 'tp-dialog-com',
  data() {
    return {
      value1: 'value1',
      value2: 'value2'
    };
  },
  methods: {
    click() {
      this.$emit('ok', this.value2);
    },
    // 用于被外部组件获取值
    getComponentValue() {  
      return this.value1;
    }
  }
};
  `
    };
  },
  methods: {
    alert() {
      this.$mlalert(
        '这个是vuesax扩展的dialog',
        {
          description: '通过函数调用，而不是控制组件。'
        },
        this.$refs.dialog
      );
    },
    confir() {
      let _ = this;
      let aa = this.$mlconfir('这个是vuesax扩展的dialog', {
        ok(v) {
          _.$mlalert('已确认！');
        },
        cancle() {
          _.$mlalert('已取消！');
        }
      });
    },
    prompt() {
      let _ = this;
      this.$mlprompt('这个是vuesax扩展的dialog', {
        placeholder: '请输入',
        blur: true,
        ok(setting, value) {
          _.$mlalert('已确认输入：' + value);
        },
        cancle() {
          _.$mlalert('已取消！');
        }
      });
    },
    dialog() {
      let _ = this;
      this.$mldialog('这个是vuesax扩展的dialog', {
        blur: true,
        width: '600px',
        showOk: true,
        showCancle: true,
        component: 'tp-dialog-com',
        ok(setting, value) {
          _.$mlalert('已确认输入：' + value);
        },
        cancle() {
          _.$mlalert('已取消！');
        }
      });
    }
  }
};
</script>
