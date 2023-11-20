<template>
  <div>
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.username" placeholder="用户名" clearable></el-input>
          <el-input v-model="searchModel.level" placeholder="权限等级" clearable></el-input>
          <el-button type="primary" @click="getUserList" icon="el-icon-search">查询</el-button>
        </el-col>
        <el-col :span="4" align="right">
          <el-button type="primary" @click="openEditUI(null)" icon="el-icon-plus" circle></el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 结果列表 -->
    <el-card>
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column label="#" width="80">
          <template slot-scope="scope">
            {{
              (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="id" label="用户ID" width="180">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="level" label="权限等级" width="180">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0" type="danger">禁用</el-tag>
            <el-tag v-else-if="scope.row.level == 1">普通用户</el-tag>
            <el-tag v-else-if="scope.row.level == 2">管理员用户</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" @click="openEditUI(scope.row.id)" icon="el-icon-edit" circle></el-button>
            <el-button type="danger" @click="deleteUser(scope.row)" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页组件 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo" :page-sizes="[5, 10, 20, 50]" :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 用户信息编辑对话框 -->
    <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="userform" ref="userformRef" :rules="rules">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="userform.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="userform.id == null || userform.id == undefined" label="密码" :label-width="formLabelWidth"
          prop="password">
          <el-input type="password" v-model="userform.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限等级" :label-width="formLabelWidth" prop="level">
          <el-input v-model="userform.level" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUser()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userApi from "@/api/userdatabase";
export default {
  data() {
    return {
      total: 0,
      title: "",
      userform: {},
      formLabelWidth: "130px",
      dialogFormVisible: false,
      searchModel: {
        pageNo: 1,
        pageSize: 10,
      },
      userList: [],
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "长度在 3 到 50 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
        level: [
          { required: true, message: "请输入用户的权限级别", trigger: "blur" },
          {
            min: 1,
            max: 1,
            message: "权限0：不允许登录 权限1：普通用户 权限2：管理员用户",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    deleteUser(user) {
      this.$confirm(`您确认删除用户 ${user.username}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          userApi.deleteUserById(user.id).then((response) => {
            this.$message({
              type: response.message,
              message: "删除成功!",
            });
            this.getUserList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    saveUser() {
      // 触发表单验证
      this.$refs.userformRef.validate((valid) => {
        if (valid) {
          //提交给后台
          userApi.saveUser(this.userform).then((response) => {
            //成功提示，关闭对话框，刷新表格
            this.$message({
              message: response.message,
              type: "success",
            });
            this.dialogFormVisible = false;
            this.getUserList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    clearForm() {
      this.userform = {};
      this.$refs.userformRef.clearValidate();
    },
    openEditUI(id) {
      if (id == null || id == undefined) {
        this.title = "新增用户";
      } else {
        this.title = "修改用户";
        userApi.getUserById(id).then((response) => {
          this.userform = response.data;
        });
      }
      this.dialogFormVisible = true;
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getUserList();
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getUserList();
    },
    getUserList() {
      userApi.getUserList(this.searchModel).then((response) => {
        this.userList = response.data.rows;
        this.total = response.total;
      });
    },
  },
  created() {
    this.getUserList();
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