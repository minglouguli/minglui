<template>
  <span :class="i_class" :xxxx="value">{{ i_value }}</span>
</template>

<script>
export default {
  name: 'ml-enum',
  props: {
    value: {},
    enum: {},
    url: {},
    options: {},
    cache: {
      type: Boolean
    },
    getOptionsHandler: {
      type: Function,
      default: null
    }
  },
  //props: ['value', 'conf'],
  data() {
    let cacheFlag = this.cache;
    if (
      this.cache == false &&
      this.$ml.getPluginConfig('ml-enum').cache == true
    ) {
      cacheFlag = true;
    }
    return {
      i_value: '',
      cacheFlag: cacheFlag,
      enumName: this.enmu || this.url
    };
  },

  computed: {
    i_class() {
      return this.enum + ' enum-' + this.value;
    }
    // i_value() {
    //   let _ = this;
    //   let arr = _.options || _.$ml.getCache('_enum')[_.conf];
    //   if (arr) {
    //     for (let i = 0; i < arr.length; i++) {
    //       const element = arr[i];
    //       if (element.value == _.value) {
    //         return element.text;
    //       }
    //     }
    //   }
    //   return _.value;
    // }
  },
  watch: {
    value(v) {
      this.fresh(v, 123);
    }
  },
  async created() {
    let _ = this;
    if (this.url) {
      await this.$ml.queue('_enumOptionsQueue_' + _.enumName, async () => {
        await this.getRemoteDate();
      });
    } else {
      this.fresh(this.value);
    }
  },
  methods: {
    fresh(v) {
      let _ = this;
      let arr = null;
      if (_.url) {
        arr = _.$ml.getHash('_enumOptions', _.enumName, true);
      } else if (_.enum) {
        arr = _.options || _.$ml.getCache('_enum')[_.enum];
      }
      if (arr) {
        for (let i = 0; i < arr.length; i++) {
          const element = arr[i];
          if (element.value == _.value) {
            _.i_value = element.text;
            return;
          }
        }
      }
      _.i_value = v;
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
            _.$ml.getPluginConfig('ml-enum').getOptionsHandler ||
            async function (v, opt) {
              return await v.$go(opt.url).success(data => {
                return data.options;
              });
            };

          cacheOptions = await handler(_, { enum: _.enum, url: _.url });
          if (this.cacheFlag) {
            _.$ml.setHash('_enumOptions', _.enumName, cacheOptions);
          } else {
            _.$ml.setHash('_enumOptions', _.enumName, cacheOptions, 3, true);
          }
        }
        this.fresh(this.value);
      }
    }
  }
};
</script>
