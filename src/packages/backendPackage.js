import MlNav from '../plugins/el/ml-nav';
import MlEditor from '../plugins/el/ml-editor';
import MlUploader from '../plugins/el/ml-uploader';
import MlTab from '../components/el/ml-tab.vue';
import MlTable from '../components/el/ml-table-list.vue';
import MlEnum from '../components/el/ml-enum.vue';
import MlEnumSelect from '../components/el/ml-enum-select.vue';
import MlCascader from '../components/el/ml-cascader.vue';
import MlCascaderText from '../components/el/ml-cascader-text.vue';
import MlDateText from '../components/el/ml-date-text.vue';
import MlDate from '../components/el/ml-date.vue';
import MlAuth from '../components/el/ml-auth.vue';
import mlDialog from '../plugins/sax/ml-dialog';
import MlLoading from '../plugins/sax/ml-loading';

let backendPackage = {
  install: Vue => {
    Vue.use(MlNav);
    Vue.use(MlEditor);
    Vue.use(MlUploader);
    Vue.use(mlDialog);
    Vue.use(MlLoading);
    Vue.component(MlTab.name, MlTab);
    Vue.component(MlTable.name, MlTable);
    Vue.component(MlEnum.name, MlEnum);
    Vue.component(MlEnumSelect.name, MlEnumSelect);
    Vue.component(MlCascader.name, MlCascader);
    Vue.component(MlCascaderText.name, MlCascaderText);
    Vue.component(MlDateText.name, MlDateText);
    Vue.component(MlDate.name, MlDate);
    Vue.component(MlAuth.name, MlAuth);
  }
};

export { MlCore, MlApp } from 'minglui-core/src/index';

export { backendPackage as BackendPackage };
