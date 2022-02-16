module.exports = function(obj) {
  return {
    name: 'add',
    template: `
      <template>
      <div>
        <el-form size="mini" label-width="140px" ref="model" style="text-align:left">
          <el-card>
            <el-form-item label="名称">
              <el-input v-model="submit.Name" class="ms-width-p50"></el-input>
            </el-form-item>
            <el-form-item label="下拉选项">
              <ml-enum-select conf="data_UserTipType" v-model="submit.Status"></ml-enum-select>
            </el-form-item>
    
            <el-form-item label="文本输入">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 10}"
                v-model="submit.Content"
                class="ms-width-p50"
              ></el-input>
            </el-form-item>
  
            <el-form-item label="文本输入">
              <ml-editor v-model="submit.Content"></ml-editor>
            </el-form-item>
  
            <el-form-item v-show="submit.Imgs&&submit.Imgs.length>0" label="图片凭据：">
              <el-image
                fit="contain"
                style="width:100px;height:100px;box-shadow: 0 0 2px grey;margin: 10px;background-color: rgb(250, 250, 250);border-radius: 6px;overflow: hidden;"
                v-for="(img,index) in model.Imgs"
                :key="index"
                :src="img"
                :preview-src-list="model.Imgs"
              ></el-image>
            </el-form-item>
    
            <el-form-item label="图片上传">
              <ml-upload v-model="submit.BrandImg" conf="Image" fit="contain">
                <ml-image
                  style="width:180px;height:140px;box-shadow: 0 0 10px #d6d1d1;border-radius: 4px;"
                  :src="submit.BrandImg"
                  fit="contain"
                ></ml-image>
              </ml-upload>
            </el-form-item>
    
            <el-form-item label="多图片上传">
              <ml-upload
                v-model="submit.Imgs"
                conf="Image"
                :options="{type:'shortImg',limit:5,multiple:true}"
                fit="contain"
              ></ml-upload>
            </el-form-item>
          </el-card>
          <el-card>
            <el-button type="primary" class="mse-btn-primary" @click="add">新增</el-button>
            <el-button @click="close">取消</el-button>
          </el-card>
        </el-form>
      </div>
    </template>
    
    <script>
    export default {
      name: "${obj.name}-add",
      data() {
        return {
          submit: {}
        };
      },
      methods: {
        close() {
          this.$nav.close();
        },
        add() {
          let _ = this;
          _.$go("",_.submit).success((res,msg)=>{
            _.$successMsg(msg)
            _.$navItem.$parent.query();
            _.close()
          })
        }
      }
    };
    </script>
      `
  };
};
