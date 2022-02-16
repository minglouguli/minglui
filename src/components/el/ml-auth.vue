<template>
  <div v-if="showFlag" :style="{ display: display }">
    <slot></slot>
  </div>
  <!-- <ml-auth-button operate="/api/*/user/getuserlist"></ml-auth-button> -->
</template>

<script>
export default {
  name: 'ml-auth',
  props: {
    // controller: {
    //   type: String,
    //   required: true
    // },
    // action: {
    //   type: String,
    //   required: true
    // },
    display: {
      type: String,
      default: 'inline-block'
    },
    path: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    title: {
      type: String
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
      this.$ml.getPluginConfig('ml-auth').cache == true
    ) {
      cacheFlag = true;
    }
    let url = this.$ml.getPluginConfig('ml-auth').url;

    let i_path =
      this.path ||
      `${this.$route.name}:${(this.$navItem && this.$navItem.content) || ''}`;
    return {
      showFlag: false,
      cacheFlag,
      i_path,
      url
    };
  },
  async created() {
    let _ = this;
    if (this.url) {
      await this.$ml.queue('_mlComponentsAuthQueue_' + _.i_path, async () => {
        await this.getRemoteDate();
      });
    } else {
      this.fresh();
    }
  },
  methods: {
    fresh() {
      let _ = this;
      if (this.url) {
        let authObj = _.$ml.getHash('_mlComponentsAuth', _.i_path, true);
        if (authObj) {
          if (authObj.isAllAuth) {
            this.showFlag = true;
            let item = authObj.all[this.name];
            if (!item) {
              //表示未记录设置，记录到缓存中，然后到天津操作授权处添加缓存记录，或直接添加
              let pathDes = _.$navItem && _.$navItem.name;
              _.$ml.setHash(
                '_mlComponentsUnSettingAuthTemp',
                `${_.i_path}|${_.name}`,
                {
                  path: _.i_path,
                  name: _.name,
                  pathDes: pathDes,
                  title: _.title
                }
              );
            }
          } else {
            let item = authObj.all[this.name];
            if (item && item.isAuth) {
              this.showFlag = true;
            }
          }
        }
      } else {
        this.showFlag = true;
      }
    },
    async getRemoteDate() {
      let _ = this;

      if (this.url) {
        //使用远程请求数据

        let cacheOptions = _.$ml.getHash('_mlComponentsAuth', _.i_path);
        if (!cacheOptions) {
          //如果不存在缓存数据，则进行远程请求数据；
          let handler =
            this.getOptionsHandler ||
            _.$ml.getPluginConfig('ml-auth').getOptionsHandler ||
            async function (v, opt) {
              return await v
                .$go(opt.url, { path: opt.path })
                .success(data => {
                  return data;
                })
                .error(msg => {
                  _.$errorMsg(msg);
                });
            };
          cacheOptions = await handler(_, { path: _.i_path, url: _.url });
          if (cacheOptions && !cacheOptions.all) {
            this.$errorMsg(
              "响应数据格式有误，要求{isAllAuth:false,all:{'test':{isAuth:true}}}"
            );
          }
          if (this.cacheFlag) {
            _.$ml.setHash('_mlComponentsAuth', _.i_path, cacheOptions);
          } else {
            _.$ml.setHash('_mlComponentsAuth', _.i_path, cacheOptions, 3, true);
          }
        }
        this.fresh();
      }
    }
  }
};
</script>
