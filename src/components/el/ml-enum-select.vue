<template>
  <el-select
    :multiple="multiple"
    :disabled="disabled"
    placeholder="请选择"
    :value="value"
    @change="changeValue"
    clearable
  >
    <el-option
      v-for="item in i_list"
      :key="item.value"
      :label="item.text"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'ml-enum-select',
  model: {
    prop: 'value',
    event: 'vchange'
  },
  props: {
    value: {},
    enum: {},
    url: {},
    options: {},
    cache: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    },
    multiple: {
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
      this.$ml.getPluginConfig('ml-enum-select').cache == true
    ) {
      cacheFlag = true;
    }
    return {
      i_list: [],
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
        // this.$set(this, 'i_list', options);
        this.i_list = options;
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
            _.$ml.getPluginConfig('ml-enum-select').getOptionsHandler ||
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
