<template>
  <div class="about">
    <el-card class="box-card">
      <div slot="header" class="header">
        <span>欢迎注册Traveler组队交友平台</span>
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
          <el-form-item label="确认密码" prop="checkPass">
            <el-input
              type="password"
              v-model="ruleForm.checkPass"
              autocomplete="off"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="ruleForm.gender">
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="所在地">
            <v-distpicker @selected="regionSelect"></v-distpicker>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" autocomplete="off" prefix-icon="el-icon-message"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input
              v-model="ruleForm.phone"
              autocomplete="off"
              prefix-icon="el-icon-phone-outline"
            ></el-input>
          </el-form-item>
          <el-form-item label="QQ" prop="qq">
            <el-input v-model="ruleForm.qq" autocomplete="off" prefix-icon="el-icon-bell"></el-input>
          </el-form-item>
          <el-form-item class="button">
            <el-button type="success" round @click="submitForm('ruleForm')">注册</el-button>
          </el-form-item>
          <span class="toRegister" @click="$router.push('/login')">已有账号，立即登录</span>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import VDistpicker from "v-distpicker";
export default {
  components: { VDistpicker },
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

    //检测用户名是否可用
    var validateCheckUser = async (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        const res = await this.$http.get(`/register/${value}`);
        if (res.data.status === 0) {
          callback(new Error(res.data.message));
        }
        if (res.data.status === 1) {
          callback();
        }
      }
    };
    return {
      ruleForm: {
        user: "",
        pass: "",
        checkPass: "",
        gender: "",
        province: "",
        city: "",
        area: "",
        email: "",
        phone: "",
        qq: "",
      },
      rules: {
        user: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            validator: validateCheckUser,
            trigger: 'blur'
          },
        ],
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
          if(this.ruleForm.gender === '男'){
            this.ruleForm.sex = 'male'
          }else{
            this.ruleForm.sex = 'female'
          }
          const res = await this.$http.post("/register", this.ruleForm);
          if (res.data.status === 1) {
            this.$message({
              message: res.data.message,
              type: "success",
            });
            this.$router.push("/login");
          } else if (res.data.status === 0) {
            this.$message.error(res.data.message);
          }
        } else {
          this.$message.error("请完善个人信息！");
          return false;
        }
      });
    },
    regionSelect(data) {
      this.ruleForm.province = data.province.value;
      this.ruleForm.city = data.city.value;
      this.ruleForm.area = data.area.value;
    },
  },
};
</script>

<style scoped>
.box-card {
  width: 480px;
  margin: 10vh auto;
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
.toRegister {
  font-size: 13px;
  text-align: right;
  width: 90%;
  display: inline-block;
  color: rgb(155, 158, 160);
  top: -10px;
  cursor: pointer;
}
.button {
  margin-bottom: 0;
}
.el-button {
  font-size: 16px;
  font-weight: bold;
  width: 80%;
}
.toRegister:hover {
  color: black;
}
</style>