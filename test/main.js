import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

//script
import ElementUI from 'element-ui';
import Vuesax from 'vuesax';
import { MlCore, BackendPackage } from './../src/packages/backendPackage';
//style
import 'element-ui/lib/theme-chalk/index.css';
import 'vuesax/dist/vuesax.css';
// import './../src/packages/style/index.scss';

//data
import testRequestData from './data/testRequestData';
import enumData from './data/enumData';

import mlComdes from './components/ml-comdes.vue';
import tpDialogCom from './components/tp-dialog-com.vue';

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(Vuesax);
Vue.use(BackendPackage);
Vue.component(mlComdes.name, mlComdes);
Vue.component(tpDialogCom.name, tpDialogCom);
Vue.use(
  MlCore,
  mlapp => {
    mlapp.updateData('_enum', enumData);
    mlapp.setPluginConfig('ml-go', {
      installers: [Vue, mlapp],
      configHandler: conf => {
        conf.options.timeout = 10000;

        // 添加预请求
        conf
          .setUrl(
            [
              { key: '@test', value: '/api/test/test' },
              ['@getUserInfo', '/api/test/getUserInfo'],
              ['@getEnumData', '/api/test/getEnumData']
            ],
            'test'
          )
          .setUrl('test4', '/api/test/getDate', 'test')
          .setUrl('test5', '/api/test/getDate');

        conf.event.default = {
          // 发送前
          before(config) {
            let accessToken = this.$identity.accessToken || '';
            if (accessToken) {
              config.headers['Authorization'] = accessToken;
            }
          },
          //请求成功
          success(data) {},
          //请求失败
          error(msg, code) {
            if (code == 401) {
              // 未登录
            } else if (code == 403) {
              ///权限不足
            }
            // this.$router.push({ name: 'Login' });
          }
        };

        conf.event.test = {
          before(config) {
            let data = testRequestData[config.urlObj.key];
            if (data) {
              if (data.isSuccess === true || data.isSuccess === false) {
                return data;
              } else {
                return {
                  isSuccess: true,
                  data: data,
                  code: 1,
                  message: 'success'
                };
              }
            }
          },
          //请求成功
          success(data) {},
          //请求失败
          error(msg, code) {
            if (code == 401) {
              // 未登录
              // this.$router.push({ name: 'Login' });
              return false;
            } else if (code == 403) {
              ///权限不足
            }
          }
        };

        //添加拦截器
        conf.setInterceptors(interceptors => {
          interceptors.response.use(
            response => {
              return response;
            },
            error => {
              return Promise.reject(error);
            }
          );
        });
      }
    });

    mlapp.setPluginConfig('ml-identity', {
      installers: [Vue, mlapp],
      configHandler: conf => {
        let timer = null;
        conf.onStart(identity => {
          let accessToken = mlapp.getStore('mlaccessToken');
          if (accessToken) {
            identity.signIn(accessToken);
          }
        });
        conf.onSignIn((identity, accessToken) => {
          if (timer) {
            clearInterval(timer);
          }
          timer = setInterval(() => {
            identity.refresh();
          }, 600000);
          identity.setAccessToken(accessToken);
          mlapp.setStore('mlaccessToken', accessToken);
        });
        conf.onSignOut(identity => {
          if (timer) {
            clearInterval(timer);
          }
          mlapp.delStore('mlaccessToken');
        });
        conf.onRefresh(identity => {
          if (identity.isAuthenticated) {
            mlapp.$go('/api/auth/refreshAccessToken').success(data => {
              if (data.accessToken) {
                identity.setAccessToken(data.accessToken);
                mlapp.setStore('mlaccessToken', data.accessToken);
              }
            });
          }
        });
        conf.onAuthenticate(async (identity, pageObj) => {
          if (!identity.isAuthenticated) {
            var res = await mlapp.$go('/api/auth/Authenticate', pageObj);
            return res.data.isAuthenticated ? true : false;
          }
          return identity.isAuthenticated;
        });
      }
    });

    mlapp.setPluginConfig('ml-msg', {
      configHandler: conf => {
        conf.setMsg((target, options) => {
          if (options.code === 1) {
            target.$notify({
              title: '成功',
              message: options.msg,
              type: 'success'
            });
          } else if (options.code === 2) {
            target.$notify.error({
              title: '错误',
              message: options.msg
            });
          } else {
            target.$notify.info({
              message: options.msg
            });
          }
        });
      }
    });
  },
  window
);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
