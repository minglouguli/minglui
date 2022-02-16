<template>
  <div class="ms-tab">
    <el-tabs
      :id="tabId"
      class="ms-el-tabs"
      v-model="vm.ActiveTab"
      type="card"
      @tab-remove="removeTab"
    >
      <el-tab-pane
        class="ms-tab-panne"
        v-for="item in vm.Tabs"
        :key="item.code"
        :label="item.title"
        :name="item.code"
        :closable="item.code == 'Main' ? false : true"
      >
        <div
          :is="item.content"
          :pointCode="item.code"
          :name="item.title"
          :content="item.slot"
          :init="item.init"
        >
          {{ item.content }}
        </div>
        <!-- <el-scrollbar class="ms-tab-panne-scroll">
         
        </el-scrollbar>-->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss" scoped>
.ms-tab {
  border: 1px solid #ebeef5;
  background-color: rgb(253, 255, 253);
  color: #303133;
  transition: 0.3s;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  width: 100%;
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  box-sizing: border-box;
}
.ms-tab > .ms-el-tabs {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.ms-tab-panne {
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss">
.ms-el-tabs {
  > .el-tabs__content {
    flex: 1;
    overflow: auto;
  }
}
</style>

<script>
export default {
  name: 'ml-tab',
  props: {
    main: {
      default: 'main-page'
    }
  },
  data() {
    let tabId = 'mltab-' + Math.random() * 1000; // this.ml.token();
    return {
      tabId: tabId,
      vm: {
        ActiveTab: 'Main',
        Tabs: [
          {
            code: 'Main',
            title: '主页',
            content: 'main-page'
          }
        ]
      }
    };
  },
  mlon(_) {
    return {
      addTab(tab) {
        _.addTab(tab);
      }
    };
  },
  mounted() {
    this.addEvent();
    //let _ = this;
    if (this.$route.query.pointCode) {
      // $('.ms-tab').css({ 'box-shadow': 'none', border: 'none', margin: '0' });
      //  $('.el-main').css({ padding: '0' });
      this.addTab({
        code: this.$route.query.pointCode,
        title: this.$route.query.title || this.$route.query.pointCode,
        icon: '',
        content: this.$route.query.pointCode,
        slot: this.$route.query.slot || ''
      });
      //   $(_.$el)
      //     .find('#' + _.tabId)
      //     .children('.el-tabs__header')
      //     .hide();
    }
  },
  methods: {
    addEvent() {
      this.$ml.on('addTab', tab => {
        this.addTab(tab);
      });
    },
    removeTab(targetCode) {
      let tabs = this.vm.Tabs;
      let activeCode = this.vm.ActiveTab;
      if (activeCode === targetCode) {
        tabs.forEach((tab, index) => {
          if (tab.code === targetCode) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeCode = nextTab.code;
            }
          }
        });
      }
      this.vm.ActiveTab = activeCode;
      this.vm.Tabs = tabs.filter(tab => tab.code !== targetCode);
    },
    addTab(tab) {
      if (this.vm.Tabs.findIndex(w => w.code == tab.code) < 0) {
        this.vm.Tabs.push(tab);
      }
      this.vm.ActiveTab = tab.code;
    }
  }
};
</script>
