<template>
  <div class="mss-comdes">
    <el-divider content-position="left">{{ title }}</el-divider>
    <template v-if="doc">
      <div class="mss-comdes-label">说明：</div>
      <div class="mss-comdes-des">
        <p>{{ doc }}</p>
      </div>
    </template>

    <div class="mss-comdes-label">示例：</div>
    <div class="mss-comdes-exp">
      <slot></slot>
    </div>

    <template v-if="code">
      <div class="mss-comdes-label">代码</div>
      <ml-code-editor
        class="mss-comdes-code"
        v-model="code"
        height="100%"
        :style="{
          height: height
        }"
        style="box-shadow: 0 0 6px #e1e1e1; border-radius: 0.4rem"
      >
      </ml-code-editor>
    </template>
  </div>
</template>
<style lang="scss" scoped>
.mss-comdes {
  text-align: left;
  .mss-comdes-label {
    color: rgb(156, 156, 156);
    margin: 10px 0;
  }
  .mss-comdes-exp {
    margin: 20px;
  }
  .mss-comdes-des {
    background-color: rgb(245, 245, 245);
    border-radius: 0.2rem;
    p {
      padding: 1rem 2rem;
    }
  }
  .mss-comdes-code {
    font-size: 14px;
  }
}
</style>
<script>
import mlCodeEditor from '@/plugins/common/ml-code-editor/ml-code-editor';
export default {
  name: 'ml-comdes',
  props: {
    title: {},
    doc: {},
    code: {},
    height: {
      type: String,
      default() {
        return '100px';
      }
    }
  },
  components: {
    mlCodeEditor
  },
  data() {
    return {
      mode: 'text/x-vue'
    };
  }
};
</script>
