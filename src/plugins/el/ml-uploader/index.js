import mlUploader from './ml-uploader.vue';
import Uploader from './upload';
class MLUploader {
  install = Vue => {
    Vue.component(mlUploader.name, mlUploader);
    Vue.prototype.$createUploader = function (opt) {
      let options = {
        ...{
          url: '',
          triggerElement: null,
          dropElement: null,
          onAddFile(up, files) {},
          onRemovedFile(up, files) {},
          beforeUpload(up, file) {},

          progress() {},
          error() {},
          success() {},
          complete(up, files) {}
        },
        ...opt
      };

      options.onBeforeUpload = (up, files) => {
        options.beforeUpload(up, files);
      };

      options.onSuccess = (up, file, responseObject) => {
        if (responseObject.response) {
          let res = JSON.parse(responseObject.response);
          if (res.isSuccess === true) {
            options.success(up, file, res);
          } else if (res.isSuccess === false) {
            options.error(up, file, res);
          } else {
            options.success(up, file, res);
          }
        } else {
          options.success(up, file, responseObject);
        }
      };
      options.onError = (up, err) => {
        let message = '';
        if (err.code == -600) {
          let size = up.settings.filters && up.settings.filters.max_file_size;
          if (size) {
            message = `文件大小不能超过${size}`;
          } else {
            message = `文件大小限制`;
          }
        }
        options.error(
          up,
          null,
          {
            isSuccess: false,
            code: 0,
            data: null,
            message: message
          },
          err
        );
      };
      options.onChunkUploaded = (up, file, responseObject) => {
        if (responseObject.response) {
          let res = JSON.parse(responseObject.response);
          if (res.isSuccess === false) {
            file.status = 4;
            options.error(up, file, res);
          }
        }
      };
      options.onComplete = (up, files) => {
        options.complete(up, files);
      };
      options.onProgress = (up, file, responseObject, allpercent) => {
        options.progress(up, file, responseObject, allpercent);
      };
      return new Uploader(options);
    };
  };
}

export default new MLUploader();
