<template>
  <div class="ms-code-editor">
    <div class="ms-code-editor-area" :style="{ height: height }">
      <textarea ref="codearea"></textarea>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.ms-code-editor {
  height: 100%;
  width: 100%;
  flex: 1;
  text-align: left;
  // border: 1px solid gray;
  //border-radius: 10px;
  //box-shadow: 0 0 10px gray;
  //padding: 10px;
  //overflow: hidden;
  ::v-deep.cm-s-neat span.cm-keyword {
    font-weight: normal;
  }
  ::v-deep {
    .CodeMirror {
      height: 100%;
    }
    // .cm-type {
    //   color: #2b91af;
    // }
    // .cm-comment {
    //   color: #608b4e;
    // }
    // cm-def {
    //   color: #2b91af;
    // }
    // .cm-attribute {
    //   color: #2b91af;
    // }
    // .cm-tag {
    //   color: blue;
    // }
    // .cm-keyword {
    //   color: blue;
    // }
    // .cm-tag.cm-bracket {
    //   color: #2b91af;
    // }
    // .cm-qualifier {
    //   color: #ffad4c;
    // }
    // .cm-property {
    //   color: #0060b5;
    // }
  }
  .ms-code-editor--custome {
    ::v-deep {
      .CodeMirror {
        height: 100%;
      }
      .cm-type {
        color: #2b91af;
      }
      .cm-comment {
        color: #608b4e;
      }
      cm-def {
        color: #2b91af;
      }
      .cm-attribute {
        color: #2b91af;
      }
      .cm-tag {
        color: blue;
      }
      .cm-keyword {
        color: blue;
      }
      .cm-tag.cm-bracket {
        color: #2b91af;
      }
      .cm-qualifier {
        color: #ffad4c;
      }
      .cm-property {
        color: #0060b5;
      }
    }
  }
}
</style>
<script>
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neat.css';
// import 'codemirror/theme/elegant.css';
// import 'codemirror/theme/ssms.css';
import 'codemirror/mode/clike/clike'; //text/x-csrc (C), text/x-c++src (C++), text/x-java (Java)
//, text/x-csharp (C#),
//text/x-objectivec (Objective-C), text/x-scala (Scala), text/x-vertex x-shader/x-fragment (shader programs)
//, text/x-squirrel (Squirrel) and text/x-ceylon
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/vue/vue'; //text/x-vue
import 'codemirror/mode/htmlmixed/htmlmixed'; //text/html
import 'codemirror/mode/css/css'; //text/css, text/x-scss , text/x-less ,
import 'codemirror/mode/sass/sass'; //text/x-sass
import 'codemirror/addon/scroll/simplescrollbars.css';
import 'codemirror/addon/scroll/simplescrollbars';

import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';

export default {
  name: 'ml-code-editor',
  model: {
    prop: 'value',
    event: 'vchange'
  },
  props: {
    value: {
      type: String
    },
    height: {
      type: String,
      default: 'auto'
    },
    mode: {
      type: [String, Object],
      default: 'text/javascript'
    }
  },
  data() {
    return {
      editor: null,
      e_value: ''
    };
  },
  watch: {
    value(v) {
      this.setValue(v);
    },
    mode(v) {
      this.changeMode(v);
    }
  },
  mounted() {
    this.editor = CodeMirror.fromTextArea(this.$refs.codearea, {
      lineNumbers: true,
      //keyMap: 'sublime',
      indentUnit: 4,
      theme: 'neat',
      tabSize: 4,

      foldGutter: true,
      lineWrapping: true,
      gutters: [
        'CodeMirror-linenumbers',
        'CodeMirror-foldgutter',
        'CodeMirror-lint-markers'
      ],

      //mode: { name: 'javascript', json: true },
      //mode: 'htmlmixed', //'text/javascript',
      // mode: this.mode, // 'text/x-csharp', //'text/javascript',
      //mode: 'text/x-vue', //'text/javascript',
      showCursorWhenSelecting: true,
      option: {
        autofocus: true
      }
      //  这是针对sql有自定义表和字段的，这样可以把自己的表和字段也放入提示里。如果数据是异步请求获取的，可以通过editor.setOption('hintOptions', data)
      // hintOptions: {
      //   tables: {
      //     table1: [ 'col_A', 'col_B', 'col_C' ],
      //     table2: [ 'other_columns1', 'other_columns2' ]
      //   }
      // }
    });
    this.changeMode(this.mode);

    this.editor.on('change', cm => {
      let code = this.editor.getValue();
      this.e_value = code;
      this.$emit('vchange', code);
      this.$emit('change', code);
    });
    this.editor.setValue(this.value);
  },
  methods: {
    changeMode(mode) {
      let iv = mode;
      if (mode == 'json') {
        iv = { name: 'javascript', json: true };
      }
      this.editor.setOption('mode', iv);
    },

    setValue(v) {
      if (this.e_value != v) {
        this.editor.setValue(v);
      }
    }
  }
};
</script>
