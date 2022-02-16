import mlEditor from './ml-editor.vue';
class MLEditor {
  install = Vue => {
    Vue.component(mlEditor.name, mlEditor);
  };
}

export default new MLEditor();
