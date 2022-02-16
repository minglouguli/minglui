import MlUploader from '../plugins/el/ml-uploader';
import mlDialog from '../plugins/sax/ml-dialog';
import MlLoading from '../plugins/sax/ml-loading';

let minglUi = {
  install: Vue => {
    Vue.use(MlUploader);
    Vue.use(mlDialog);
    Vue.use(MlLoading);
  }
};
export { minglUi as MinglUi };
export { MlCore, MlApp } from 'minglui-core';
