<template>
  <div>
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.tgtnumber" placeholder="数据id" clearable></el-input>
          <el-button type="primary" @click="getRadarList" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 结果列表 -->
    <el-card>
      <el-table :data="radarList" stripe style="width: 100%">
        <el-table-column label="#" width="80">
          <template slot-scope="scope">
            {{
              (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="180">
        </el-table-column>
        <el-table-column prop="predata" label="剩余使用最佳时间" width="180">
        </el-table-column>
        <el-table-column prop="logtime" label="记录时间" width="180">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteRadarData(scope.row)" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页组件 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo" :page-sizes="[5, 10, 20, 30]" :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 用户信息编辑对话框 -->
  </div>
</template>

<script>
import radarApi3 from "@/api/radarpredictdata";
export default {
  data() {
    return {
      total: 0,
      title: "",
      radarform: {},
      formLabelWidth: '130px',
      dialogFormVisible: false,
      searchModel: {
        pageNo: 1,
        pageSize: 10,
        id: 1,
      },
      radarList: [],
    };
  },
  methods: {
    deleteRadarData(radarData) {
      this.$confirm(`您确认删除航班${radarData.tgtnumber}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        radarApi3.deletedataById(radarData.id).then(response => {
          this.$message({
            type: response.message,
            message: '删除成功!'
          });
          this.getRadarList();
        });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getRadarList();
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getRadarList();
    },
    getRadarList() {
      radarApi3.getRadarList(this.searchModel).then((response) => {
        this.radarList = response.data.rows;
        this.total = response.total;
      });
    },
  },
  created() {
    this.getRadarList();
  },
};
</script>

<style>
#search .el-input {
  width: 200px;
  margin-right: 10px;
}

.el-dialog .el-input {
  width: 85%;
}
</style>