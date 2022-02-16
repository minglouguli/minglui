import MlCodeEditor from '../plugins/common/ml-code-editor/ml-code-editor.vue';

export default {
  install: function (Vue) {
    Vue.component(MlCodeEditor.name, MlCodeEditor);
  }
};
