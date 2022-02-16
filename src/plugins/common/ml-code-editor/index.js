import MlCodeEditor from './ml-code-editor.vue';

export default {
  install: function (Vue) {
    Vue.component(MlCodeEditor.name, MlCodeEditor);
  }
};
