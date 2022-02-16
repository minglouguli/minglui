<template>
  <div class="home">
    <div class="ms-row ms-flex--item-center">
      <el-avatar :src="userInfo.avatar"></el-avatar>
      <span>{{ userInfo.nickName }}</span>
    </div>
    <el-divider content-position="left">功能模块</el-divider>
    <ml-test />
  </div>
</template>

<script>
import mlTest from './../components/ml-test.vue';

export default {
  name: 'Home',
  components: {
    mlTest
  },
  data() {
    return {
      userInfo: {}
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      this.$go({
        url: '@getUserInfo',
        data: { id: 1 },
        success(data) {
          this.userInfo = data;
        }
      });
    }
  }
};
</script>
