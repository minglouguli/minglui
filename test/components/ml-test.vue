<template>
  <div class="mss-test">
    <el-tabs tab-position="left">
      <el-tab-pane label="扩展组件" lazy>
        <tp-base></tp-base>
      </el-tab-pane>
      <el-tab-pane label="对话框" lazy><tpDialog></tpDialog></el-tab-pane>
      <el-tab-pane label="请求" lazy>角色管理</el-tab-pane>
      <el-tab-pane label="消息" lazy>定时任务补偿</el-tab-pane>
      <el-tab-pane label="身份认证" lazy>定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tpBase from './tp-base.vue';
import tpDialog from './tp-dialog.vue';
export default {
  name: 'ml-test',
  components: {
    tpBase,
    tpDialog
  },
  data() {
    return {};
  },
  mounted() {}
};
</script>
