module.exports = function(obj) {
  return {
    name: 'list',
    template: `
          <template>
            <ml-table-list ref="table" :pointData="pointConf">
              <template #tool>
                <el-button size="mini" @click="addHandler()">新增</el-button>
              </template>
          
              <template #query="scope">
                <el-form inline size="mini">
                  <el-form-item label="文本查询">
                    <el-input v-model="scope.query.Name"></el-input>
                  </el-form-item>
          
                  <el-form-item label="下拉筛选查询">
                    <ml-enum-select v-model="scope.query.Type" conf="data_UserTipType"></ml-enum-select>
                  </el-form-item>
                </el-form>
              </template>
              <el-table-column :sortable="'custom'" fixed prop="Id" label="显示文本" width="80"></el-table-column>
          
              <el-table-column prop="Status" label="显示下拉文本" width="80">
                <template #default="scope">
                  <ml-enum :value="scope.row.Status" conf="data_UserTipStatus"></ml-enum>
                </template>
              </el-table-column>
          
              <el-table-column prop="CreateDate" label="显示时间" sortable="custome" width="160">
                <template #default="scope">
                  <ml-text-date :value="scope.row.CreateDate"></ml-text-date>
                </template>
              </el-table-column>
          
              <el-table-column fixed prop="MainName" label="显示长文本，用..." width="240">
                <template slot-scope="scope">
                  <ml-text-line :value="scope.row.MainName"></ml-text-line>
                </template>
              </el-table-column>
          
              <el-table-column prop="CreateDate" label="显示图片" width="160">
                <template slot-scope="scope">
                  <ml-image :src="scope.row.Img" conf="ImageFace"></ml-image>
                </template>
              </el-table-column>
              <template #operate="scope">
                <el-button size="mini" @click="editHandler(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
              </template>
            </ml-table-list>
          </template>
          
          <script>
          export default {
            name: "${obj.name}-list",
            data() {
              return {
                pointConf: {
                  queryUrl: "/api/admin/${obj.group}/${obj.name}PageList",
                  //   defaultSort: { prop: "Id", order: "descending" }, //ascending
                  operateConfig: {
                    width: 220,
                    fixed: "right"
                  },
                  operate: []
                }
              };
            },
            methods: {
              query(){
                this.$refs.table.query();
              },
              addHandler() {
                  let _ = this;
                  _.$nav.open({
                    name: "新增",
                    content: "${obj.name}-add"
                  });
                },
              editHandler(row) {
                let _ = this;
                _.$nav.open({
                  name: "编辑",
                  content: "${obj.name}-edit",
                  params: { id: row.id }
                });
              },
              detailHandler(row) {
                let _ = this;
                _.$nav.open({
                  name: "详情",
                  content: "${obj.name}-detail",
                  params: { id: row.id }
                });
              },
              deleteHandler(row) {
                if (confirm('是否删除？')) {
                let _ = this;
                _.$go("", [row.id]).success((res,msg) => {
                  _.query();
                  _.$successMsg(msg)
                })
                .error((err) => {
                  _.$errorMsg(err);
                })
              }
            }
            }
          };
          </script>`
  };
};
