<template>
  <div class="example">
    <ml-comdes
      title="ml-enum"
      :doc="doc.mlEnum"
      :code="code.mlEnum"
      height="160px"
    >
      <div>
        示例1：
        <ml-enum :value="data.mlEnumValue" enum="data_status"></ml-enum>
      </div>
      <div>
        示例2：
        <ml-enum :value="data.mlEnumValue" url="@getEnumData"></ml-enum>
      </div>
    </ml-comdes>
    <ml-comdes
      title="ml-enum-select"
      :doc="doc.mlEnumSelect"
      :code="code.mlEnumSelect"
    >
      <ml-enum-select
        v-model="data.mlEnumValue"
        enum="data_status"
      ></ml-enum-select>
      <ml-enum-select
        v-model="data.mlEnumValue"
        url="@getEnumData"
      ></ml-enum-select>
    </ml-comdes>
  </div>
</template>
<style lang="scss" scoped>
.example {
  text-align: left;
}
</style>
<script>
export default {
  name: 'tp-base',
  data() {
    return {
      data: {
        mlEnumValue: 1
      },
      doc: {
        mlEnum: 'json数据匹配',
        mlEnumSelect: 'json数据匹配下拉选项'
      },
      code: {
        mlEnum: `<ml-enum :value="data.mlEnumValue" enum="data_status"></ml-enum>
<ml-enum :value="data.mlEnumValue" url="/api/test/getEnumData"></ml-enum>
// 网络返回数据格式：
{
    options: [
      { text: '正常-网络请求', value: 1 },
      { text: '禁用-网络请求', value: 0 }
    ]
  }`,
        mlEnumSelect: ` <ml-enum-select v-model="data.mlEnumValue" enum="data_status">
 </ml-enum-select>
 
 <ml-enum-select v-model="data.mlEnumValue" url="/api/test/getEnumData">
 </ml-enum-select>`
      }
    };
  }
};
</script>
