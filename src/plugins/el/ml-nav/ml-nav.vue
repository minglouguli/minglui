<template>
  <el-tabs
    class="ms-nav-pannel"
    v-model="activeName"
    @tab-click="handleClick"
    :stretch="false"
  >
    <el-tab-pane class="ms-nav-pannel-tab" :label="navItem.name" name="first">
      <template slot="label">
        <span>
          <i class="el-icon-setting"></i>
          {{ navItem.name }}
        </span>
      </template>

      <div
        v-if="navItem.content"
        :is="navItem.content"
        :_navItem="navItem"
      ></div>
      <div v-else :_navItem="navItem">
        <slot>
          <div></div>
        </slot>
      </div>

      <!-- <el-scrollbar style="height:100%;">
         
      </el-scrollbar>-->
      <!-- </transition> -->
    </el-tab-pane>

    <el-tab-pane
      class="ms-nav-pannel-tab"
      v-for="item in navs"
      :key="item.code"
      :label="item.name"
      :name="item.code"
    >
      <template slot="label">
        <span>>{{ item.name }}</span>
      </template>
      <transition name="slide-fade" mode="out-in">
        <div
          :_navItem="item"
          v-show="item.code == activeName"
          :is="item.content"
          :key="item.code"
        ></div>
      </transition>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss">
.ms-nav-pannel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  > .el-tabs__content {
    width: 100%;
    height: 100%;
    > .ms-nav-pannel-tab {
      width: 100%;
      height: 100%;
      overflow: auto;
    }
  }
}
.ms-nav-pannel > .el-tabs__header {
  margin-bottom: 2px;
}
.ms-nav-pannel > .el-tabs__header > .el-tabs__nav-wrap::after {
  height: 0;
}
.ms-nav-pannel
  > .el-tabs__header
  > .el-tabs__nav-wrap
  > .el-tabs__nav-scroll
  > .el-tabs__nav {
  > .el-tabs__active-bar {
    display: none;
  }
  > .el-tabs__item {
    padding: 0 4px;
    color: rgb(115, 135, 155);
    transition: color 0.3s ease-out;
    &:hover {
      color: rgb(14, 130, 247) !important;
    }
  }
  > .el-tabs__item.is-active {
    color: rgb(115, 135, 155);
  }
}
</style>

<script>
export default {
  name: 'ml-nav',
  props: {
    content: {
      type: String
    },
    name: {
      type: String,
      default: '新窗口'
    },
    pointCode: {
      type: String
    },
    init: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    let _ = this;
    let navItem = this.build({
      name: _.name,
      content: _.content,
      code: '',
      params: {},
      dataSet: {
        pointCode: _.pointCode
      }
    });

    if (!navItem.content) {
      this._navItemRoot = this;
      this._navItem = navItem;
    }

    return {
      navItem: navItem,
      navs: [],
      activeName: 'first',
      showQuery: true,
      showTitle: _.init.showTitle == false // false ? false : true
    };
  },
  mounted() {},
  computed: {},
  on: {
    // query() {
    // }
  },
  methods: {
    build(navItem) {
      return Object.assign(
        {},
        {
          name: '',
          content: '',
          code: '',
          params: {},
          dataSet: {}
        },
        {
          params:
            navItem.$parent &&
            navItem.$parent.$navItem &&
            navItem.$parent.$navItem.params,
          dataSet:
            navItem.$parent &&
            navItem.$parent.$navItem &&
            navItem.$parent.$navItem.dataSet
        },
        navItem
      );
    },
    open(navItem) {
      //console.log("open", navItem);
      navItem.code = navItem.code || this.$ml.token('nav-');
      let _ = this;
      if (_.navs.findIndex(w => w.code == navItem.code) < 0) {
        var newNav = this.build({
          $parent: navItem.$parent,
          name: navItem.name,
          code: navItem.code, // navData.config.code,
          content: navItem.content,
          params: navItem.params, // $.extend({}, _.navItem.params, navItem.params),
          dataSet: navItem.dataSet
        });
        //  newNav.navData.navObj = _;
        _.navs.push(newNav);
      }
      this.activeName = navItem.code;
    },
    clickQueryHandle() {
      this.$emit('query');
    },
    handleClick(tab) {
      let _ = this;
      let tabIndex = tab.index;
      let dlength = _.navs.length - tabIndex;
      for (let i = 0; i < dlength; i++) {
        _.navs.pop();
      }
    },
    close(i) {
      let _ = this;
      i = i || 1;
      i = this.navs.length > i ? i : this.navs.length;
      for (let index = 0; index < i; index++) {
        this.navs.pop();
      }
      if (_.navs.length == 0) {
        this.activeName = 'first';
      } else {
        this.activeName = this.navs[_.navs.length - 1].code;
      }
    }
  }
};
</script>
