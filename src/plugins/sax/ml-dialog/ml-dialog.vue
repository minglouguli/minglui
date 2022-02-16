<template>
  <vs-dialog
    class="ms-dialog"
    ref="dialog"
    :width="setting.width"
    not-center
    prevent-close
    :blur="setting.blur"
    v-model="active"
    v-on:close="close"
  >
    <template #header v-if="setting.title">
      <h4 class="not-margin">{{ setting.title }}</h4>
    </template>

    <div class="con-content">
      <p style="text-align: left" v-if="setting.description">
        {{ setting.description }}
      </p>
      <vs-input
        v-if="setting.showValue"
        v-model="value"
        :placeholder="setting.placeholder"
      ></vs-input>
      <component
        v-if="setting.component"
        ref="component"
        @close="close"
        @ok="ok"
        @cancle="cancle"
        :is="setting.component"
      ></component>
    </div>

    <template #footer>
      <div class="con-footer">
        <vs-button v-if="setting.showOk" @click="ok(null)" transparent>
          {{ setting.okText || '确定' }}
        </vs-button>
        <vs-button
          v-if="setting.showCancle"
          @click="cancle(null)"
          dark
          transparent
        >
          {{ setting.cancleText || '取消' }}
        </vs-button>
      </div>
    </template>
  </vs-dialog>
</template>
<style lang="scss" scoped>
.ms-dialog {
  ::v-deep {
    .con-content {
      .vs-input {
        width: 100%;
        font-size: 0.9rem;
      }
    }
    .con-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .vs-button {
        font-size: 0.9rem;
      }
    }
  }
}
</style>
<script>
export default {
  name: 'ml-dialog',
  props: {
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      setting: {
        ...{
          title: '',
          description: '',
          placeholder: '',
          blur: false,
          showValue: false,
          showOk: false,
          showCancle: false,
          width: '300px',
          component: null
        },
        ...this.options
      },
      active: false,
      value: this.options.value || ''
    };
  },
  mounted() {
    this.timer = setTimeout(() => {
      this.open();
    }, 100);
  },
  methods: {
    open() {
      this.active = true;
    },
    close() {
      this.active = false;
      this.destroyed();
    },
    ok(v) {
      let value = v || undefined;

      if (this.setting.showValue) {
        value = this.value;
      } else if (
        !value &&
        this.setting.component &&
        this.$refs.component &&
        this.$refs.component.getComponentValue
      ) {
        value = this.$refs.component.getComponentValue();
      }
      this.setting.ok && this.setting.ok(this.setting, value);
      this.close();
    },
    cancle() {
      this.setting.cancle && this.setting.cancle(this.setting);
      this.close();
    },
    destroyed() {
      this.$destroy();
    }
  },
  destroyed() {
    // if (this.$el) {
    //   this.$el.remove();
    // }
  }
};
</script>
