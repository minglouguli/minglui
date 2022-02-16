<template>
  <span :class="i_class" :xxxx="value">{{ i_value }}</span>
</template>

<script>
export default {
  name: 'ml-cascader-text',
  model: {
    prop: 'value',
    event: 'vcahngge'
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
      i_value: '',
      cacheFlag: cacheFlag,
      enumName: this.enmu || this.url,
      enumToListName: (this.enmu || this.url) + '_toList'
    };
  },
  computed: {
    i_class() {
      return this.enum + ' enum-cascader-' + this.value;
    }
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
    changeValue(v) {
      this.$emit('vchange', v);
      this.$emit('change', v);
    },
    fresh(v) {
      let _ = this;
      let arr = null;
      if (_.url) {
        arr = _.$ml.getHash('_enumOptions', _.enumToListName, true);
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
        let cacheOptionsToList = _.$ml.getHash(
          '_enumOptions',
          _.enumToListName
        );
        if (!cacheOptionsToList) {
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
              _.$ml.setHash('_enumOptions', _.enumName, cacheOptions, 3, true);
            }
          }
          if (this.cacheFlag) {
            _.$ml.setHash(
              '_enumOptions',
              _.enumToListName,
              this.treeToList(cacheOptions)
            );
          } else {
            _.$ml.setHash(
              '_enumOptions',
              _.enumToListName,
              this.treeToList(cacheOptions),
              3,
              true
            );
          }
        }
        this.fresh(this.value);
      }
    },
    treeToList(tree) {
      let list = [];
      if (tree && tree.length > 0) {
        for (let i = 0; i < tree.length; i++) {
          const element = tree[i];
          list.push({
            text: element.text,
            value: element.value
          });
          let arr = this.treeToList(element.nodes);
          for (let j = 0; j < arr.length; j++) {
            const item = arr[j];
            list.push({
              text: item.text,
              value: item.value
            });
          }
        }
      }
      return list;
    }
  }
};
</script>
