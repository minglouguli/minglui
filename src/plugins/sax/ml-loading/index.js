class MlLoading {
  install(Vue) {
    Vue.prototype.$mlloading = function (options) {
      //https://vuesax.com/docs/components/Loading.html#type
      //   let opt = {
      //     color: '#2980b9',
      //     background: '#ffffff',
      //     type: 'default',
      //     text: 'loading',
      //     percent: 0, //loading.changePercent(newPercent);
      //     progress: 0, //loading.changeProgress(newProgress);
      //     target: window.document.body
      //   };
      return (this.$vs && this.$vs.loading(options)) || {};
    };
  }
}

export default new MlLoading();
