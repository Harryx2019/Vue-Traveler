<template>
  <div class="about">
    <el-card class="box-card">
      <div slot="header" class="header">
        <span>欢迎登录Traveler组队交友平台</span>
      </div>
      <div>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="user">
            <el-input v-model="ruleForm.user" autocomplete="off" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input
              type="password"
              v-model="ruleForm.pass"
              autocomplete="off"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item class="button">
            <el-button type="primary" class="login" round @click="submitForm('ruleForm')">登录</el-button>
          </el-form-item>
          <span class="toRegister" @click="$router.push('/register')">尚未注册，立即注册</span>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        user: "",
        pass: "",
      },
      rules: {
        user: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        pass: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await this.$http.post("/login", this.ruleForm);
          if (res.data.status === 0) {
            this.$message.error(res.data.message);
          } else if (res.data.status === 1) {
            this.$message({
              message: res.data.message,
              type: "success",
            });
            this.$router.push("/team");
          }
        } else {
          this.$message.error("请输入用户名和密码！");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.box-card {
  width: 480px;
  margin: 15vh auto;
}
.el-card__header {
  padding: 0;
  height: 8vh;
}
.header {
  height: 8vh;
  line-height: 8vh;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  background-color: rgb(220, 238, 250);
}
.el-input {
  width: 300px;
}
.el-input__inner:focus {
  border: 1px solid #4d7cfe;
}
.button {
  margin-bottom: 0;
}
.el-button {
  font-size: 16px;
  font-weight: bold;
  width: 80%;
}
.login,
.login:active {
  background: rgb(64, 158, 255);
  border-color: rgb(64, 158, 255);
}
.login:hover,
.login:focus {
  background-color: rgb(102, 177, 255);
  border-color: rgb(102, 177, 255);
}
.toRegister {
  font-size: 13px;
  text-align: right;
  width: 90%;
  display: inline-block;
  color: rgb(155, 158, 160);
  top: -10px;
  cursor: pointer;
}
.toRegister:hover {
  color: black;
}
</style>