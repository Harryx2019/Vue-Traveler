<template>
  <div class="content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/#/team">Traveler组队交友平台</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>个人信息</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <h1>个人信息</h1>
      <p style="font-size:14px;">注：姓名和性别不可更改！</p>
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名" prop="user">
          <el-input v-model="ruleForm.user" autocomplete="off" prefix-icon="el-icon-user" disabled></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <i class="el-icon-male" v-if="ruleForm.sex === 'male'" style="color:rgb(35,168,242);"></i>
          <i class="el-icon-female" v-else style="color:red;"></i>
        </el-form-item>
        <el-form-item label="所在地">
          <v-distpicker
            @selected="regionSelect"
            :province="ruleForm.province"
            :city="ruleForm.city"
            :area="ruleForm.area"
          ></v-distpicker>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" autocomplete="off" prefix-icon="el-icon-message"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="ruleForm.phone" autocomplete="off" prefix-icon="el-icon-phone-outline"></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="ruleForm.qq" autocomplete="off" prefix-icon="el-icon-bell"></el-input>
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
import VDistpicker from "v-distpicker";
export default {
  components: { VDistpicker },
  data() {
    return {
      ruleForm: {
        userId: 0,
        user: "",
        gender: "",
        province: "",
        city: "",
        area: "",
        email: "",
        phone: "",
        qq: "",
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await this.$http.post("/editUserInfo", this.ruleForm);
          if (res.data.status === 1) {
            this.$message({
              message: res.data.message,
              type: "success",
            });
            this.getUserInfo()
          } else if (res.data.status === 0) {
            this.$message.error(res.data.message);
          }
        } else {
          this.$message.error("请完善个人信息！");
          return false;
        }
      });
    },
    canselEdit() {
      this.getUserInfo();
    },
    regionSelect(data) {
      this.ruleForm.province = data.province.value;
      this.ruleForm.city = data.city.value;
      this.ruleForm.area = data.area.value;
    },
    async getUserInfo() {
      var res = await this.$http.get(`/searchUser/${this.ruleForm.userId}`);
      if (res.data.status === 1) {
        var userInfo = res.data.userInfo;

        this.ruleForm.user = userInfo.name;
        this.ruleForm.sex = userInfo.sex;
        this.ruleForm.province = userInfo.province;
        this.ruleForm.city = userInfo.city;
        this.ruleForm.area = userInfo.area;
        this.ruleForm.email = userInfo.email;
        this.ruleForm.phone = userInfo.phone;
        this.ruleForm.qq = userInfo.qq;
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