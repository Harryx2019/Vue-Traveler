<template>
  <div class="content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/#/team">Traveler组队交友平台</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <h1>修改密码</h1>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="新密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
            prefix-icon="el-icon-lock"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
            prefix-icon="el-icon-lock"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="button">
          <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
          <el-button @click="canselEdit" class="reset">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 检测密码与重复密码是否一致
    var validateCheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        userId: 0,
        oldPass: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        pass: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
        checkPass: [
          {
            required: true,
            message: "请再次输入密码",
            trigger: "blur",
          },
          {
            validator: validateCheckPass,
            trigeer: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.ruleForm.pass === this.ruleForm.oldPass) {
            this.$message.error("新旧密码不能相同！");
            return;
          } else {
            var res = await this.$http.post("/changePass", this.ruleForm);
            if (res.data.status === 1) {
              //重新登录
              res = await this.$http.get("/logout");
              this.$message({
                message: "修改密码成功！请重新登录！",
                type: "success",
              });
              this.$router.push("/login");
            } else if (res.data.status === 0) {
              this.$message.error(res.data.message);
            }
          }
        } else {
          this.$message.error("请完善个人信息！");
          return false;
        }
      });
    },
    canselEdit() {
      this.$refs["ruleForm"].resetFields();
    },
    async getUserInfo() {
      var res = await this.$http.get(`/searchUser/${this.ruleForm.userId}`);
      if (res.data.status === 1) {
        var userInfo = res.data.userInfo;

        this.ruleForm.oldPass = userInfo.password;
      } else {
        this.$message.error("请求出错啦，请稍后重试！");
        this.$router.push("/team");
      }
    },
    async justify() {
      //判断是否登录
      var res = await this.$http.get("/isLogin");
      if (res.data.status === 1) {
        this.isLogin = true;
        let userId = res.data.userId;
        this.ruleForm.userId = userId;
        //获取用户信息
        this.getUserInfo();
      } else {
        this.$confirm("您尚未登录, 是否前往登录?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$router.push("/login");
          })
          .catch(() => {
            this.$router.push("/team");
          });
      }
    },
  },
  created() {
    this.justify();
  },
};
</script>

<style scoped>
@import "../assets/common.css";
.content {
  width: 90%;
  margin: 0 auto;
  padding: 20px 0;
}
.box-card {
  width: 100%;
  margin: 5vh auto;
}
.box-card-content {
  width: 95%;
  margin: 0 auto;
}
.box-card .title {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.box-card .edit {
  margin-left: 10px;
  font-size: 14px;
  font-weight: bold;
  color: rgb(155, 158, 160);
  cursor: pointer;
}
.box-card .edit:hover {
  color: #000;
}

.textarea {
  width: 30%;
}

.el-input {
  width: 20%;
  margin-right: 10px;
}
</style>