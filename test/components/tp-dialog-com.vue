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

<script>
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
    getComponentValue() {
      return this.value1;
    }
  }
};
</script>
