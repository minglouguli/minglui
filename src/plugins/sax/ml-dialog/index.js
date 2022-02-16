import mlDialog from './ml-dialog.vue';

class MLDialog {
  install(Vue) {
    Vue.component(mlDialog.name, mlDialog);

    let dialog = function (title, opt, target) {
      let options = {
        ...{
          title: title || '',
          active: true
        },
        ...opt
      };

      let com = Vue.extend({
        render(h) {
          return h(mlDialog.name, {
            props: {
              options: options
            }
          });
        }
      });

      let instance = new com();
      // let div = document.createElement('div');
      let ndiv = instance.$mount();
      let tarObj = target || document.body;
      tarObj.append(ndiv.$el);
      return ndiv;
    };

    Vue.prototype.$mldialog = function (title, opt, target) {
      return dialog(
        title,
        {
          ...{ showValue: false, component: null },
          ...opt
        },
        target
      );
    };

    Vue.prototype.$mlalert = function (title, opt, target) {
      return dialog(
        title,
        {
          ...{
            showValue: false,
            showOk: true
          },
          ...opt
        },
        target
      );
    };

    Vue.prototype.$mlconfir = function (title, opt, target) {
      return dialog(
        title,
        {
          ...{
            showValue: false,
            showOk: true,
            showCancle: true
          },
          ...opt
        },
        target
      );
    };

    Vue.prototype.$mlprompt = function (title, opt, target) {
      return dialog(
        title,
        {
          ...{
            showValue: true,
            showOk: true,
            showCancle: true
          },
          ...opt
        },
        target
      );
    };
  }
}

export default new MLDialog();
