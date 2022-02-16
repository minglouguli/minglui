<template>
  <div>
    <editor :disabled="disabled" v-model="ivalue" :init="options" />
    <el-dialog title="插入图片" :visible.sync="config.dialogImageUpload">
      <div class="mss-img-box">
        <ml-uploader
          class="ms-size--100 mss-img-item"
          showProgress
          :type="1"
          multiple
          resize
          :url="uploadImageOptions.uploadImageUrl"
          :params="{
            fileSetKey: uploadImageOptions.uploadImageFileSetKey,
            isFull: uploadImageOptions.uploadWithDomain != false
          }"
          show-progress
          maxFileSize="20mb"
          useChunk
          @onSuccess="uploadImageSuccess"
        >
        </ml-uploader>
        <div
          v-for="(item, i) in img.imgs"
          :key="i"
          class="mss-img-item mss-img-item-pre ms-image"
        >
          <div class="mss-img-item-clear" @click="clearImg(i)">×</div>
          <el-image
            :src="item.res.url"
            :title="item.name"
            fit="contain"
            class="mss-img-item-img"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="config.dialogImageUpload = false">取 消</el-button>
        <el-button type="primary" @click="inertImg">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showTemplate" width="88%">
      <ml-editor-template
        ref="xtemplate"
        :url="init.templateUrl"
      ></ml-editor-template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showTemplate = false">取 消</el-button>
        <el-button type="primary" @click="templateOkHandler">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="showVideoUpload">
      <div>
        <el-form size="mini" label-width="100px">
          <el-form-item label="视频地址">
            <el-input v-model="videoInfo.src"></el-input>

            <ml-upload
              v-model="videoInfo.tempSrc"
              @success="d => (videoInfo.src = d.Url)"
              conf="VideoContent"
              fit="contain"
              :options="{ type: 'file', multiple: false }"
            >
              <div></div>
            </ml-upload>
          </el-form-item>

          <el-form-item label="宽度">
            <el-input class="ms-width-100" v-model="videoInfo.width"></el-input>
          </el-form-item>
          <el-form-item label="高度">
            <el-input
              class="ms-width-100"
              v-model="videoInfo.height"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showVideoUpload = false">取 消</el-button>
        <el-button type="primary" @click="videoUploadOkHandler"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
  <!-- <editor api-key="no-api-key" v-model="content" :init="options" /> -->
  <!-- <editor api-key="n6ni2r12256fmlebxqrwqtxs85xmbh8kkm05hgvogj2ulmmc" :init="options" /> -->
</template>

<style lang="scss" scoped>
.mss-img-box {
  display: flex;
  flex-wrap: wrap;
  background-color: #fafafa;
  border-radius: 10px;
  //box-shadow: 0 0 2px #e2e2e2;
  .mss-img-item {
    margin: 10px;
  }
  .mss-img-item-pre {
    width: 100px;
    height: 100px;
    // overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .mss-img-item-clear {
      position: absolute;
      width: 20px;
      height: 20px;
      right: -10px;
      top: -10px;
      cursor: pointer;
      color: white;
      background-color: #eb5645;
      border-radius: 10px;
      display: inline-block;
      text-align: center;
      vertical-align: middle;
      line-height: 20px;
      z-index: 1;
      transition: all 0.4s ease;
      &:hover {
        transform: rotateZ(180deg);
        background-color: #fa2008;
      }
    }
    .mss-img-item-img {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 8px;
    }
  }
}
</style>

<script>
import tinymce from 'tinymce/tinymce';
import Editor from '@tinymce/tinymce-vue';

import 'tinymce/themes/silver';
import 'tinymce/icons/default/icons';
import 'tinymce/plugins/image'; // 插入上传图片插件
import 'tinymce/plugins/imagetools'; // 插入上传图片插件
import 'tinymce/plugins/media'; // 插入视频插件
import 'tinymce/plugins/table'; // 插入表格插件
import 'tinymce/plugins/lists'; // 列表插件
import 'tinymce/plugins/link';
import 'tinymce/plugins/wordcount'; // 字数统计插件
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/code';

//import "tinymce/plugins/quickbars";
//import "tinymce/plugins/formatpainter";
//import "tinymce/plugins/paste";
window.tinymce = tinymce;
export default {
  name: 'ml-editor',
  model: {
    prop: 'value',
    event: 'modelChange'
  },
  props: {
    uploadImageOptions: {
      uploadWithDomain: true,
      uploadImageUrl: '',
      uploadImageFileSetKey: ''
    },
    init: {
      type: Object,
      default() {
        return {
          isSimple: false,
          useTemplate: false
        };
      }
    },
    value: { type: String, default: '' },
    toolbar: { type: [String, Array], default: '' },
    disabled: { type: Boolean, default: false }
  },

  data() {
    let _ = this;
    let defaulttoolbar = [
      'undo redo| formatselect fontsizeselect | bold italic forecolor backcolor | \
           alignleft aligncenter alignright alignjustify | bullist numlist outdent indent' +
        ' | removeformat  |table |imageUpload mlmedia link insertdatetime| code fullscreen preview help | showModel mltemplate' //+ (_.init.userTemplate ? 'template' : ''),
    ];
    if (_.init.isSimple) {
      defaulttoolbar = [
        'undo redo|  fontsizeselect | bold italic forecolor backcolor | \
           alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat  |table |imageUpload mlmedia link   '
      ];
    }
    var init = Object.assign(
      {},
      {
        // quickbars_selection_toolbar:
        //   "bold italic | quicklink h2 h3 blockquote imageUpload quicktable",
        // contextmenu: "link imageUpload imagetools table",
        statusbar: false,
        language_url: 'tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: 'tinymce/skins/ui/oxide',
        content_css: 'tinymce/skins/content/default/content.min.css',
        height: 500,
        // max_width: 400,
        // width: 400,
        menubar: false, //菜单
        mobile: {
          menubar: false
        },
        //images_upload_url: "postAcceptor.php",   //设置images_upload_url 或 images_upload_handler，ui中就会出现上传图片的ui;
        // images_upload_base_path: "/some/basepath",
        //images_upload_credentials: true,
        // images_upload_handler: function(blobInfo, success, failure) {
        //   console.log(
        //     blobInfo,
        //     blobInfo.filename(),
        //     blobInfo.id(),
        //     blobInfo.name(),
        //     blobInfo.uri()
        //   );
        // var xhr, formData;
        // xhr = new XMLHttpRequest();
        // xhr.withCredentials = false;
        // xhr.open("POST", "postAcceptor.php");
        // xhr.onload = function() {
        //   var json;
        //   if (xhr.status != 200) {
        //     failure("HTTP Error: " + xhr.status);
        //     return;
        //   }
        //   json = JSON.parse(xhr.responseText);
        //   if (!json || typeof json.location != "string") {
        //     failure("Invalid JSON: " + xhr.responseText);
        //     return;
        //   }
        //   success(json.location);
        // };
        // formData = new FormData();
        // formData.append("file", blobInfo.blob(), fileName(blobInfo));
        // xhr.send(formData);

        // success(
        //   "http://mobile.merrychange.net/Content/Upload/Image/User/xia20200110172520321.jpg"
        // );
        //},
        plugins: [
          'image imagetools media link',
          'table insertdatetime fullscreen preview code' //+ (_.init.userTemplate ? ' template' : ''),
          // "advlist autolink lists link image charmap print preview anchor",
          // "searchreplace visualblocks code fullscreen",
          // "insertdatetime media table paste code help wordcount"
        ],
        templates: [
          {
            title: '容器2',
            content: 'abc<b>aaa</b>',
            description: '容器2'
          },
          {
            title: '容器1',
            url: './tinymce/template/one.html',
            description: '容器1'
          }
        ],
        toolbar: defaulttoolbar,
        setup: editor => {
          _.editor = editor;
          var setApp = function (isApp) {
            if (isApp) {
              let $domcontainer = editor.editorContainer;
              let $domx = editor.contentAreaContainer.parentElement; // this.$el.querySelector(".tox-sidebar-wrap");
              //  console.log("momoo", editor);
              $domcontainer.style['background-color'] = '#f3f4f7';

              $domx.style.width = '288px';
              $domx.style.margin = '10px auto';
              $domx.style['border-radius'] = '10px';
              $domx.style['box-shadow'] = '0 0 4px grey';
              $domx.style['overflow'] = 'hidden';
              editor.contentDocument.body.style.zoom = 0.7;
            } else {
              let $domcontainer = editor.editorContainer;
              let $domx = editor.contentAreaContainer.parentElement; // this.$el.querySelector(".tox-sidebar-wrap");
              //  console.log("momoo", editor);
              $domcontainer.style['background-color'] = '';

              $domx.style.width = '';
              $domx.style.margin = '';
              $domx.style['border-radius'] = '';
              $domx.style['box-shadow'] = '';
              $domx.style['overflow'] = '';
              editor.contentDocument.body.style.zoom = 1;
            }
          };
          //console.log("eeedd", editor);
          editor.ui.registry.addButton('imageUpload', {
            tooltip: '插入图片',
            icon: 'image',
            onAction: () => {
              _.config.dialogImageUpload = true;
            }
          });

          editor.ui.registry.addButton('mlmedia', {
            tooltip: '插入视频',
            icon: 'embed',
            onAction: () => {
              _.showVideoUpload = true;
              var $nodes = editor.selection.getContent();
              if ($nodes.length > 0) {
                var node = $nodes[0];
                if (node.tagName == 'VIDEO') {
                  _.videoInfo.width = node.style.width || '80%';
                  _.videoInfo.height = node.style.height || '300px';
                  var $sr = $nodes.eq(0).find('source')[0];
                  _.videoInfo.src = node.src || ($sr && $sr.src) || '';
                }
              } else {
                _.videoInfo.width = '80%';
                _.videoInfo.height = '300px';
                _.videoInfo.src = '';
              }
              // if(node){
              //  var $node= $(node);
              //  if($node.attr('data-mce-object')=='video'){

              //  }
              // }
              // console.log('selelelel', $node, editor.selection.getContent());
            }
          });

          editor.ui.registry.addButton('showModel', {
            tooltip: '切换web和h5',
            icon: 'contrast',
            onAction: () => {
              _.$props.init.useApp = !_.$props.init.useApp;
              setApp(_.$props.init.useApp);
            }
          });

          editor.ui.registry.addButton('mltemplate', {
            tooltip: '插入模板',
            icon: 'template',
            onAction: () => {
              _.showTemplate = true;
            }
          });

          editor.on('init', function (e) {
            setApp(_.$props.init.useApp);
          });
        }
      },
      this.$props.init
    );
    return {
      showTemplate: false,
      showVideoUpload: false,
      config: {
        dialogImageUpload: false
      },
      img: {
        imgs: []
      },

      ivalue: _.value,
      options: init,
      videoInfo: {
        src: '',
        tempSrc: '',
        width: '300px',
        height: '150px'
      }
    };
  },
  watch: {
    value(v) {
      this.ivalue = v;
    },
    ivalue(v) {
      this.$emit('modelChange', v);
    }
  },
  components: {
    editor: Editor
  },
  mounted() {},
  methods: {
    getText() {
      return this.editor.getContent({ format: 'text' });
    },
    keyUp(c) {
      //  console.log("keyup", c);
    },
    inertImg() {
      let _ = this;
      _.config.dialogImageUpload = false;
      if (_.img.imgs && _.img.imgs.length > 0) {
        for (let i = 0; i < _.img.imgs.length; i++) {
          const element = _.img.imgs[i];
          var html =
            '<img style="width:98%;display: block; margin-left: auto; margin-right: auto;" src="' +
            element.res.url +
            '" alt="图片" data-mce-src="' +
            element.res.url +
            '" data-mce-style="width:98%; display: block; margin-left: auto; margin-right: auto;"/>';
          // console.log("xxxxx", html);
          _.editor.execCommand('mceInsertContent', false, html);
        }
        _.img.imgs = [];
      }
    },
    inertContent(content) {
      let _ = this;
      _.editor.execCommand('mceInsertContent', true, content);
    },
    templateOkHandler() {
      this.inertContent(this.$refs.xtemplate.content);
      this.showTemplate = false;
      this.$refs.xtemplate.content = '';
    },
    videoUploadOkHandler() {
      let _ = this;
      var width = (_.videoInfo.width && `width:${_.videoInfo.width}`) || '80%'; // 300;
      var height = (_.videoInfo.height && `height:${_.videoInfo.height}`) || ''; //150;
      var src = _.videoInfo.src;
      // 'http://192.168.0.111:8186/Content/Upload/VideoFile/a256ae7d370a4cb68e9f17838cd155be.mp4';

      var html = `<p><video controls="controls" style="${width};${height};" ><source src="${src}" type="video/mp4" /></video></p>`;
      _.editor.execCommand('mceInsertContent', false, html);
      _.showVideoUpload = false;
    },
    uploadImageSuccess(up, file) {
      console.log('yyyy', file);
      this.img.imgs.push(file);
    },
    clearImg(index) {
      this.img.imgs.splice(index, 1);
    }
  }
};
</script>
