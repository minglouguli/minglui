<template>
  <el-cascader
    :clearable="clearable"
    :disabled="disabled"
    :value="value"
    @change="changeValue"
    :options="i_options"
    :show-all-levels="false"
    :props="{
      expandTrigger: 'hover',
      checkStrictly: true,
      emitPath: false,
      label: 'text',
      value: 'value',
      children: 'nodes'
    }"
  >
  </el-cascader>
</template>

<script>
export default {
  name: 'ml-cascader',
  model: {
    prop: 'value',
    event: 'vchange'
  },
  props: {
    value: {},
    enum: {},
    url: {},
    options: {
      type: Array
    },
    cache: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    },
    clearable: {
      type: Boolean
    },
    getOptionsHandler: {
      type: Function,
      default: null
    }
  },
  data() {
    let cacheFlag = this.cache;
    if (
      this.cache == false &&
      this.$ml.getPluginConfig('ml-cascader').cache == true
    ) {
      cacheFlag = true;
    }
    return {
      i_options: this.options || [],
      cacheFlag: cacheFlag,
      enumName: this.enmu || this.url
    };
  },
  async created() {
    let _ = this;
    if (this.url) {
      await this.$ml.queue('_enumOptionsQueue_' + _.enumName, async () => {
        await this.getRemoteDate();
      });
    } else {
      this.updateOptions();
    }
  },
  methods: {
    changeValue(v) {
      this.$emit('vchange', v);
      this.$emit('change', v);
    },
    updateOptions() {
      let _ = this;
      let options = null;
      if (_.url) {
        options = _.$ml.getHash('_enumOptions', _.enumName);
      } else if (_.enum) {
        options = _.options || _.$ml.getCache('_enum')[_.enum];
      }
      if (options) {
        this.i_options = options;
      }
    },
    async getRemoteDate() {
      let _ = this;

      if (this.url) {
        //使用远程请求数据
        let cacheOptions = _.$ml.getHash('_enumOptions', _.enumName);
        if (!cacheOptions) {
          //如果不存在缓存数据，则进行远程请求数据；
          let handler =
            this.getOptionsHandler ||
            _.$ml.getPluginConfig('ml-cascader').getOptionsHandler ||
            async function (v, opt) {
              return await v.$go(opt.url).success(data => {
                return data.options;
              });
            };
          cacheOptions = await handler(_, { enum: _.enum, url: _.url });

          if (this.cacheFlag) {
            _.$ml.setHash('_enumOptions', _.enumName, cacheOptions);
          } else {
            _.$ml.setHash('_enumOptions', _.enumName, cacheOptions, 3);
          }
        }
        this.updateOptions();
      }
    }
  }
};
</script>
