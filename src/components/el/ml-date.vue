<template>
  <el-time-picker
    v-if="type == 'time'"
    v-model="ivalue"
    :placeholder="placeholder"
  >
  </el-time-picker>
  <el-date-picker
    v-else
    v-model="ivalue"
    :type="type"
    :placeholder="placeholder"
    :format="format"
  >
  </el-date-picker>
</template>

<script>
export default {
  name: 'ml-date',
  model: {
    prop: 'value',
    event: 'vchange'
  },
  props: {
    value: {
      type: [String, Number, Date]
    },
    placeholder: {
      type: String,
      default: function () {
        return this.type == 'time' ? '请选择时间' : '请选择日期';
      }
    },
    type: {
      default: 'datetime'
    },
    valueFormat: {
      type: String,
      default: function () {
        return this.type == 'time'
          ? 'HH:mm:ss'
          : this.type == 'date'
          ? 'yyyy-MM-dd'
          : 'yyyy-MM-dd HH:mm:ss';
      }
    },
    format: {
      type: String,
      default: function () {
        return this.type == 'time'
          ? 'HH:mm:ss'
          : this.type == 'date'
          ? 'yyyy-MM-dd'
          : 'yyyy-MM-dd HH:mm:ss';
      }
    }
  },
  computed: {
    ivalue: {
      get() {
        if (this.value) {
          if (typeof this.value == 'string') {
            return this.value.toDate();
          } else if (typeof this.value == 'number') {
            return new Date(this.value * 1000);
          } else {
            return this.value;
          }
        } else {
          return null;
        }
      },
      set(v) {
        if (!v) {
          this.$emit('vchange', '');
        } else {
          if (typeof this.value == 'number') {
            this.$emit('vchange', v.getTime() / 1000);
          } else {
            if (this.valueFormat == 'timestamp') {
              this.$emit('vchange', v.getTime() / 1000);
            } else if (this.valueFormat == '[MM]') {
              this.$emit('vchange', v);
            } else {
              this.$emit('vchange', v.format(this.valueFormat));
            }
          }
        }
      }
    }
  }
};
</script>
