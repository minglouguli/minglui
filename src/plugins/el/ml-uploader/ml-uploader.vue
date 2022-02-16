<template>
  <div class="ml-uploader">
    <template v-if="multiple">
      <div v-if="type == 0">
        <div ref="trigger" class="ml-uploader-trigger">
          <slot :files="files">
            <el-button size="mini" type="primary">点击上传</el-button>
          </slot>
        </div>
        <el-progress
          v-if="showProgress"
          v-show="sfile.showProgress"
          class="mss-progress"
          :text-inside="true"
          :stroke-width="12"
          :percentage="sfile.percent"
        ></el-progress>
      </div>
      <div v-else-if="type == 1">
        <div ref="trigger" class="ml-uploader-drop">
          <div class="mss-uploader-drop-box" :class="dropBoxClass">
            <el-progress
              :width="100"
              v-show="sfile.showProgress"
              v-if="showProgress"
              type="circle"
              :percentage="sfile.percent"
            ></el-progress>

            <span v-show="!sfile.showProgress">＋</span>
          </div>
        </div>
        <!-- <el-progress
          v-if="showProgress"
          v-show="sfile.showProgress"
          class="mss-progress"
          :text-inside="true"
          :stroke-width="12"
          :percentage="sfile.percent"
        ></el-progress> -->
      </div>
      <div v-else-if="type == 2" class="mss-pre-item-list">
        <div
          ref="trigger"
          class="ml-uploader-trigger ms-size--100 mss-pre-item"
        >
          <div class="mss-uploader-drop-box" :class="dropBoxClass">
            <span>＋</span>
          </div>
        </div>

        <div
          v-for="item in ifiles"
          :key="item.id"
          class="mss-pre-item ms-size--100"
        >
          <el-progress
            :width="100"
            v-if="item.percent < 100"
            type="circle"
            :percentage="item.percent"
          ></el-progress>
          <el-image
            v-else
            :class="imgClass"
            class="ms-image ms-size--100"
            :src="(item.res && item.res.value) || ''"
            fit="contain"
          ></el-image>
        </div>
      </div>
      <div v-else-if="type == 3">
        <el-image
          v-for="item in ifiles"
          :key="item.id"
          :class="imgClass"
          class="ms-image ms-size--100"
          :src="(item.res && item.res.value) || ''"
          fit="contain"
        ></el-image>
        <div class="ms-flex">
          <el-input size="mini" v-model="ivalue"></el-input>
          <div ref="trigger" class="ml-uploader-trigger">
            <el-button size="mini" type="primary">上传</el-button>
          </div>
        </div>

        <el-progress
          v-if="showProgress"
          v-show="sfile.showProgress"
          class="mss-progress"
          :text-inside="true"
          :stroke-width="12"
          :percentage="sfile.percent"
        ></el-progress>
      </div>
      <div v-else>
        <div ref="trigger" class="ml-uploader-trigger"></div>
      </div>
    </template>
    <template v-else>
      <div v-if="type == 0">
        <div ref="trigger" class="ml-uploader-trigger">
          <slot>
            <el-button size="mini" type="primary">点击上传</el-button>
          </slot>
        </div>
        <el-progress
          v-if="showProgress"
          v-show="sfile.showProgress"
          class="mss-progress"
          :text-inside="true"
          :stroke-width="12"
          :percentage="sfile.percent"
        ></el-progress>
      </div>
      <div v-else-if="type == 1">
        <div ref="trigger" class="ml-uploader-drop">
          <div class="mss-uploader-drop-box" :class="dropBoxClass">
            <span>＋</span>
          </div>
        </div>
        <el-progress
          v-if="showProgress"
          v-show="sfile.showProgress"
          class="mss-progress"
          :text-inside="true"
          :stroke-width="12"
          :percentage="sfile.percent"
        ></el-progress>
      </div>
      <div v-else-if="type == 2">
        <div ref="trigger" class="ml-uploader-trigger">
          <el-image
            class="ms-image ms-size--100"
            :class="imgClass"
            :src="value"
            fit="contain"
          ></el-image>
        </div>
        <el-progress
          v-if="showProgress"
          v-show="sfile.showProgress"
          class="mss-progress"
          :text-inside="true"
          :stroke-width="12"
          :percentage="sfile.percent"
        ></el-progress>
      </div>
      <div v-else-if="type == 3">
        <el-image
          :class="imgClass"
          class="ms-image ms-size--100"
          :src="value"
          fit="contain"
        ></el-image>
        <div class="ms-flex">
          <el-input size="mini" v-model="ivalue"></el-input>
          <div ref="trigger" class="ml-uploader-trigger">
            <el-button size="mini" type="primary">上传</el-button>
          </div>
        </div>

        <el-progress
          v-if="showProgress"
          v-show="sfile.showProgress"
          class="mss-progress"
          :text-inside="true"
          :stroke-width="12"
          :percentage="sfile.percent"
        ></el-progress>
      </div>
      <div v-else>
        <div ref="trigger" class="ml-uploader-trigger"></div>
      </div>
    </template>

    <slot ref="drop" name="drop"></slot>
    <div v-if="showList" class="ml-uploader-list">
      <slot name="list" :files="files">
        <div class="mss-uploader-list">
          <div
            style="flex: 1"
            class="mss-uploader-list-item"
            v-for="file in files"
            :key="file.id"
          >
            <div>
              <div>{{ file.name }}</div>
              <el-progress :percentage="file.percent"></el-progress>
            </div>
            <span class="ms-width--100 ms-info--primary ms-font--mini">{{
              file.origSize | toSize
            }}</span>
            <span class="ms-width--100 ms-info--danger ms-font--mini">{{
              file.type
            }}</span>
            <button class="ms-btn ms-btn-primary" type="button">×</button>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.ml-uploader {
  display: inline-block;
  .mss-pre-item-list {
    display: flex;
    flex-wrap: wrap;
    .mss-pre-item {
      margin: 1rem;
    }
  }

  .ml-uploader-trigger {
    display: inline-block;
    text-align: center;
    cursor: pointer;
    outline: none;
    position: relative;
  }
  .ml-uploader-drop {
    display: block;
    text-align: center;
    cursor: pointer;
    outline: none;
    position: relative;
  }
  .mss-uploader-drop-box {
    min-width: 100px;
    min-height: 100px;
    cursor: pointer;
    border: 1px dashed rgb(156, 156, 156);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    transition: all 0.4s ease;

    &:hover {
      border: 1px dashed rgb(92, 143, 187);
      box-shadow: 0 4px 10px #c2c2c2;
    }
    span {
      font-size: 50px;
      font-weight: 100;
      color: #a5a5a5;
    }
  }

  .mss-progress {
    font-size: 10px;
    position: relative;
  }
  .mss-uploader-list {
    display: flex;
    flex-direction: column;
    .mss-uploader-list-item {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
    }
  }
}
</style>
<script>
import MlUploader from './upload';

export default {
  name: 'ml-uploader',
  model: {
    prop: 'value',
    event: 'modelChange'
  },
  props: {
    url: {
      type: String
    },
    files: {
      type: Array,
      default() {
        return [];
      }
    },
    type: {
      type: Number,
      default: 0
    },
    value: {
      type: [String],
      default: ''
    },
    multiple: {
      type: Boolean
    },
    showList: {
      type: Boolean
    },
    params: {
      type: Object
    },
    headers: {
      type: Object
    },
    useChunk: {
      type: Boolean
    },
    resize: {
      type: Boolean
    },
    crop: {
      type: Boolean
    },
    resizeWidth: {
      type: Number,
      default: 800
    },
    resizeHeight: {
      type: Number,
      default: 800
    },
    isAutoUpload: {
      type: Boolean,
      default() {
        return true; // this.crop || this.resize ? false : true;
      }
    },
    mimeTypes: {
      type: [String, Array]
    },
    maxFileSize: {
      type: [Number, String],
      default: '5mb'
    },
    dropBoxClass: {
      type: String,
      default: ''
    },
    imgClass: {
      type: String,
      default: ''
    },
    successDataHandler: {
      type: Function
    },
    showProgress: {
      type: Boolean
    }
  },
  computed: {
    ivalue: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit('modelChange', v);
      }
    }
  },
  data() {
    return {
      uploader: null,
      valueList: [],
      ifiles: [],
      sfile: {
        showProgress: false,
        percent: 0
      }
    };
  },
  watch: {
    url(value) {
      this.uploader.setUrl(value);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let _ = this;
      this.uploader = new MlUploader({
        url: this.url,
        triggerElement: _.$refs.trigger,
        dropElement: _.$refs.drop,
        headers: this.headers,
        params: this.params,
        multiple: this.multiple,
        useChunk: this.useChunk,
        isAutoUpload: this.isAutoUpload,
        mimeTypes: this.mimeTypes,
        maxFileSize: this.maxFileSize,
        resize:
          this.resize || this.crop
            ? {
                width: this.resizeWidth,
                height: this.resizeHeight,
                crop: this.crop
              }
            : null,
        onAddFile(up, files) {
          _.ifiles = up.files;
          _.sfile.percent = 0;
          _.$emit('onAddFile', _.uploader, files);
          _.$emit('update:files', _.uploader.uploader.files);
        },
        onRemovedFile(up, files) {
          _.ifiles = up.files;
          _.$emit('update:files', _.uploader.uploader.files);
          _.$emit('onRemovedFile', _.uploader, files);
        },
        onBeforeUpload(up, file) {
          _.$emit('onAddFile', _.uploader, file);
          _.sfile.showProgress = true;
        },
        onChunkUploaded(up, file, responseObject) {
          if (responseObject.response) {
            let res = JSON.parse(responseObject.response);
            if (res.isSuccess === false) {
              file.status = 4;
              _.$errorMsg(`${file.name} 上传失败:${res.message}`);
              _.$emit('onError', _.uploader, res);
            }
          }
          _.$emit('onChunkUploaded', _.uploader, file, responseObject);
        },
        onSuccess(up, file, responseObject) {
          if (responseObject.response) {
            let res = JSON.parse(responseObject.response);
            if (res.isSuccess === true) {
              let data =
                (_.successDataHandler && _.successDataHandler(res)) || res.data;
              if (_.multiple === false) {
                _.valueList = [data.value];
              } else {
                _.valueList.push(data.value);
              }

              _.$set(file, 'res', res.data);
              _.$emit(
                'modelChange',
                _.multiple === false ? _.valueList[0] : _.valueList.join(';')
              );

              _.$emit('update:files', _.uploader.uploader.files);
              _.$successMsg(`${file.name} 上传成功！`);
              _.$emit('onSuccess', _.uploader, file, res);
            } else if (res.isSuccess === false) {
              _.$errorMsg(`${file.name} 上传失败:${res.message}`);
              _.$emit('onError', _.uploader, res);
            } else {
              _.$successMsg(`${file.name} 上传成功！`);
              _.$emit('update:files', _.uploader.uploader.files);
              _.$emit('onSuccess', _.uploader, file, res);
            }
          } else {
            _.$successMsg(`${file.name} 上传成功！`);

            _.$emit('update:files', _.uploader.uploader.files);
            _.$emit('onSuccess', _.uploader, file, responseObject);
          }
        },
        onError(up, err) {
          //   console.log('error', err);
          let message = '';
          if (err.code == -600) {
            let size = up.settings.filters && up.settings.filters.max_file_size;
            if (size) {
              message = `文件大小不能超过${size}`;
            } else {
              message = `文件大小限制`;
            }
          }
          _.$errorMsg(message);
          _.$emit('onError', _.uploader, {
            isSuccess: false,
            code: 0,
            data: null,
            message: message
          });
        },
        onProgress(up, file, responseObject) {
          // console.log('grogress', _.files, file.percent);

          if (up.files.length == 1) {
            _.sfile.percent = file.percent;
            if (_.sfile.percent >= 100) {
              setTimeout(() => {
                _.sfile.showProgress = false;
              }, 1000);
            }
          } else {
            let percent = 0;
            let length = _.uploader.uploader.files.length;
            for (let i = 0; i < length; i++) {
              const ifile = _.uploader.uploader.files[i];
              percent += ifile.percent;
            }
            let px = Math.ceil(percent / length);
            console.log('==', percent, px);
            _.sfile.percent = px;
            if (_.sfile.percent >= 100) {
              setTimeout(() => {
                _.sfile.showProgress = false;
              }, 1000);
            }
          }

          _.$emit('update:files', _.uploader.uploader.files);
          _.$emit('onProgress', _.uploader, file, responseObject);
        },
        onComplete(up, files) {
          _.$emit('update:files', _.uploader.uploader.files);
          _.$emit('onComplete', _.uploader, files);
        }
      });
      this.$beforeDestroy(() => {
        if (_.uploader) {
          _.uploader.destroy();
        }
      });
      this.$emit('update:files', this.uploader.uploader.files);
    },
    setOption(opt) {
      this.uploader.setOption(opt);
    },
    setUrl(url) {
      this.uploader.setUrl(url);
    },
    setHeaders(headers) {
      this.uploader.setHeaders(headers);
    },
    setParams(params) {
      this.uploader.setParams(params);
    },
    removeFile(id) {
      this.uploader.removeFile(id);
    },
    inputValueChange(v) {
      this.$emit('modelChange', v);
    },
    getFiles() {
      return this.files; // this.uploader.uploader.files;
    }
  }
};
</script>
