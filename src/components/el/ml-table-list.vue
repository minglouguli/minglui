<template>
  <div :ref="pointConf.code">
    <slot name="top"></slot>
    <el-row type="flex" justify="end" style="margin-bottom: 4px">
      <!-- <el-col :span="4"> -->
      <el-button
        size="mini"
        v-if="showQuery"
        @click="query(1)"
        type="primary"
        plain
        >查询</el-button
      >
      <el-button size="mini" v-if="showExport" @click="exportExcel(1)"
        >导出</el-button
      >

      <slot name="tool"></slot>
      <!-- </el-col> -->
    </el-row>
    <div v-loading="comConfig.loading">
      <el-form
        label-position="left"
        size="mini"
        style="text-align: left"
        label-width="70px"
        :inline="true"
      >
        <slot name="query" :query="queryParams"></slot>
      </el-form>
      <el-row>
        <el-table
          :data="tableData"
          :border="border"
          stripe
          highlight-current-row
          style="width: 100%"
          :height="height"
          max-height="600"
          class="ms-table"
          :row-key="rowKey"
          :tree-props="treeProps"
          :default-sort="pointConf.defaultSort"
          @sort-change="sortChangeHandler"
        >
          <slot name="firstcol"></slot>

          <el-table-column
            fixed
            :index="tableIndexFun"
            type="index"
            width="50"
          ></el-table-column>

          <slot></slot>
        </el-table>
      </el-row>
      <el-row type="flex" justify="start" style="margin-top: 20px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.currentPage"
          :page-sizes="pagination.pageSizes"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        ></el-pagination>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

<script>
// let defaultOpt = {
//   queryUrl: '/api/admin/newreport/CourseLearnReport',
//   exportExcelUrl: '/api/admin/newreport/CourseLearnReportExport',
//   queryParams: {}, //query查询携带参数
//   queryHandler: function(data) {
//     return data;
//   }, //返回数据处理程序；
//   noNavParams: true, //不使用导航属性上的传参
//   defaultSort: { prop: 'Id', order: 'descending' }, //ascending
// };
export default {
  name: 'ml-table-list',
  props: {
    pointData: {
      type: Object,
      default() {
        return null;
      }
    },
    options: {
      type: Object,
      default() {
        return null;
      }
    },
    border: {
      type: Boolean,
      default: true
    },
    showQuery: {
      type: Boolean,
      default: true
    },
    showExport: {
      type: Boolean,
      default: false
    },
    height: {},
    autoSearch: {
      type: Boolean,
      default: true
    },
    rowKey: {},
    treeProps: {}
  },
  data() {
    let _ = this;
    var _options =
      _.options || _.pointData || _.$navItem.dataSet.pointData || {};

    var _queryParams = Object.assign(
      {},
      _options.queryParams,
      _options.noNavParams ? {} : _.$navItem.params
    );

    return {
      pointConf: _options,
      // pointConf: pointConf,

      comConfig: {
        loading: false
      },
      pagination: {
        currentPage: 1,
        pageSizes: _options.pageSizes || [2, 10, 20, 50],
        pageSize: _options.rows || 10,
        total: 0
      },
      queryParams: _queryParams,
      baseQueryParam: {},
      tableData: []
    };
  },
  mounted() {
    let _ = this;

    if (_.pointConf) {
      _.pointConf.defaultSort = _.pointConf.defaultSort || {
        prop: 'Id',
        order: 'descending'
      };
      this.baseQueryParam.sort = _.pointConf.defaultSort.prop || '';
      this.baseQueryParam.order =
        _.pointConf.defaultSort.order == 'ascending' ||
        _.pointConf.defaultSort.order == 'asc'
          ? 'asc'
          : 'desc';
    }

    this.query();
    if (this.autoSearch) {
      let unwatch = this.$watch(
        'queryParams',
        this.$ml.debounce(
          () => {
            this.query(1);
          },
          1000,
          false
        ),
        { deep: true, immediate: false }
      );
      this.$beforeDestroy(() => {
        unwatch && unwatch();
      });
    }
  },
  methods: {
    tableIndexFun(index) {
      return (
        (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
      );
    },
    query(page) {
      let _ = this;

      if (page) {
        _.pagination.currentPage = page;
      }
      try {
        _.comConfig.loading = true;
        _.baseQueryParam.page = _.pagination.currentPage;
        //   (_.pagination.currentPage - 1) * _.pagination.pageSize + 1;
        _.baseQueryParam.rows = _.pagination.pageSize;

        var param = Object.assign(
          {},
          _.queryParams
          //    _.pointConf.noNavParams ? {} : _.$navItem.params
        );
        param.__base = _.baseQueryParam;
        this.$go(_.pointConf.queryUrl, param, { noErrorMsg: true })
          .success(data => {
            _.tableData =
              (_.pointConf.queryHandler &&
                _.pointConf.queryHandler(data.list)) ||
              data.list;
            _.pagination.total = data.count;
          })
          .error(msg => {
            // this.$errorMsg(msg);
          })
          .finally(() => {
            this.comConfig.loading = false;
          });
      } catch (error) {
        console.log('error', error);
        _.comConfig.loading = false;
      }
    },
    exportExcel(page) {
      let _ = this;
      page = 1;
      if (page) {
        _.pagination.currentPage = page;
      }
      try {
        _.comConfig.loading = true;
        let basequeryParam = {
          start: (_.pagination.currentPage - 1) * _.pagination.pageSize,
          length: _.pagination.pageSize
        };
        var param = Object.assign({}, _.queryParams);
        param.query = basequeryParam;
        this.$go(_.pointConf.exportExcelUrl, param, {})
          .success(data => {
            if (typeof data == 'object') {
              if (data.filename) {
                window.open(_.ml.getUrl(data.filename), '_blank');
              } else {
                alert('下载失败');
              }
            } else {
              window.open(data, '_blank');
            }
          })
          .error(msg => {
            this.$errorMsg(msg);
          })
          .finally(() => {
            _.comConfig.loading = false;
          });
      } catch (error) {
        console.log('eerrr', error);
        _.comConfig.loading = false;
      }
    },
    sortChangeHandler(col) {
      if (col.order) {
        this.baseQueryParam.sort = col.prop;
        this.baseQueryParam.order = col.order == 'ascending' ? 'asc' : 'desc';
        if (this.pagination.currentPage != 1) {
          this.pagination.currentPage = 1;
        } else {
          this.query();
        }
      }
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.query();
    },
    handleCurrentChange(cur) {
      this.pagination.currentPage = cur;
      this.query();
    }
  }
};
</script>
