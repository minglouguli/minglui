import plupload from 'plupload';
//file Status :QUEUED 1, UPLOADING 2, FAILED 4, DONE 5
class MlUploader {
  uploader = null;
  options = {
    triggerElement: null,
    dropElement: null,
    url: '',
    isAutoUpload: true, //是否选择完文件就自动上传， 否则通过返回对象.start() 进行触发；
    useChunk: false, // 是否启动分片上传
    chunkSize: 5 * 1024 * 1024,
    mimeTypes: '', //[{ title: "Image files", extensions: "jpg,gif,png" }],"image/*,application/pdf",  //文件格式限制
    maxFileSize: 0, //文件大小限制 如：100kb; 10mb;
    headers: null,
    params: {},
    multiple: false, //多选
    uniqueNames: false,
    resize: null,
    // {
    //   width: 0,
    //   height: 0,
    //   quality: 90,
    //   crop: false // crop to exact dimensions
    // },
    onAddFile: null,
    onRemoveFile: null,
    onBeforeUpload: null,
    onChunkUploaded: null,
    onSuccess: null,
    onError: null,
    onProgress: null,
    onComplete: null
  };
  constructor(options) {
    let _ = this;
    this.options = Object.assign({}, this.options, options);
    var chunkSize = this.options.useChunk ? this.options.chunkSize : 0;

    if (!this.options.triggerElement) {
      this.options.triggerElement = document.createElement('div');
    }
    this.options.dropElement =
      this.options.dropElement || this.options.triggerElement;
    this.uploader = new plupload.Uploader({
      url: this.options.url,
      browse_button: this.options.triggerElement,
      filters: {
        mime_types: this.options.mimeTypes, // "image/*,application/pdf",
        max_file_size: this.options.maxFileSize || 0 //最大只能上传400kb的文件
        // prevent_duplicates: true
      },
      file_data_name: this.options.fileDataName || 'file',
      headers: this.options.headers,
      multipart: true, //为true时将以multipart/form-data的形式来上传文件
      multipart_params: this.options.params, //上传附加参数
      multi_selection: this.options.multiple, //每次只能上传一个文件
      max_retries: 0, //当发生plupload.HTTP_ERROR错误时的重试次数，为0时表示不重试
      chunk_size: chunkSize, //分片上传文件时，每片文件被切割成的大小，为数字时单位为字节。也可以使用一个带单位的字符串，如"200kb"。当该值为0时表示不使用分片上传功能
      unique_names: this.options.uniqueNames, //为每个文件生成唯一名称
      flash_swf_url: 'js/Moxie.swf',
      silverlight_xap_url: 'js/Moxie.xap',
      resize: this.options.resize,
      drop_element: this.options.dropElement //拖拽区域
    });
    let uploader = this.uploader;
    this.uploader.init();

    //绑定文件添加进队列事件
    this.uploader.bind('FilesAdded', function (up, files) {
      console.log('ssss', _.options);
      if (!_.options.multiple) {
        while (uploader.files.length > 1)
          uploader.removeFile(uploader.files[0]);
      } else {
        while (uploader.files.length > files.length)
          uploader.removeFile(uploader.files[0]);
      }

      if (_.options.isAutoUpload) {
        _.options.onAddFile && _.options.onAddFile(up, files);

        uploader.start();
      } else {
        _.options.onAddFile && _.options.onAddFile(up, files);
      }
    });
    this.uploader.bind('FilesRemoved', function (up, files) {
      _.options.onRemovedFile && _.options.onRemovedFile(up, files);
    });
    // 上传前
    this.uploader.bind('BeforeUpload', function (up, file) {
      //  console.log(file, up);
      if (up.settings.multipart_params) {
        up.settings.multipart_params.size = file.size;
        up.settings.multipart_params.id = file.id;
      }

      if (_.options.onBeforeUpload) {
        _.options.onBeforeUpload(up, file);
      }
    });

    this.uploader.bind('UploadFile', function (up, file) {
      // console.log('toooo');
      // console.log(
      //   'uploadFile',
      //   up.files.select((s) => s.id)
      // );
    });

    //绑定文件上传进度事件
    this.uploader.bind('UploadProgress', function (up, file) {
      if (_.options.onProgress) {
        let allPercent = file.percent;
        if (up.files.length == 1) {
          allPercent = file.percent;
        } else {
          let percent = 0;
          let length = up.files.length;
          for (let i = 0; i < length; i++) {
            const ifile = up.files[i];
            percent += ifile.percent;
          }
          let px = Math.ceil(percent / length);
          allPercent = px;
          if (allPercent >= 100) {
            allPercent = 100;
          }
        }

        _.options.onProgress(up, file, file.percent, allPercent);
      }
    });
    //上传结束，无论成功失败
    this.uploader.bind('UploadComplete', function (up, files) {
      _.options.onComplete && _.options.onComplete(up, files);
    });
    //每片上传成功后触发
    this.uploader.bind('ChunkUploaded', function (up, file, responseObject) {
      _.options.onChunkUploaded &&
        _.options.onChunkUploaded(up, file, responseObject);
    });
    this.uploader.bind('FileUploaded', function (up, file, responseObject) {
      _.options.onSuccess && _.options.onSuccess(up, file, responseObject);
    });
    //上传出错
    this.uploader.bind('error', function (up, err) {
      console.error(err.message, err);
      _.options.onError && _.options.onError(up, err);
    });
  }
  open() {
    this.options.triggerElement.dispatchEvent(new MouseEvent('click'));
    //  this.options.triggerElement.click();
  }
  upload() {
    this.uploader.start();
  }
  stop() {
    this.uploader.stop();
  }
  setUrl(url) {
    this.uploader.setOption({
      url: url
    });
  }
  setOption(opt) {
    this.uploader.setOption(opt);
  }
  setHeaders(headers) {
    this.uploader.setOption({
      headers: headers
    });
  }
  setParams(params) {
    this.uploader.setOption({
      multipart_params: params
    });
  }
  updateParams(params) {
    let p = { ...this.uploader.settings.multipart_params, ...params };
    // console.log(p);
    this.setParams(p);
  }
  removeFile(id) {
    let _ = this;
    if (_.uploader) {
      if (id) {
        if (_.uploader.files.length > 0) {
          let itme = _.uploader.files.find(f => f.id == id);
          _.uploader.removeFile(itme);
        }
      } else {
        while (_.uploader.files.length > 1)
          _.uploader.removeFile(_.uploader.files[0]);
      }
    }
  }
  destroy() {
    this.uploader.destroy();
  }
}

export default MlUploader;
