<template>
  <div class="content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/#/team">Traveler组队交友平台</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>Traveler小队</el-breadcrumb-item>
      <el-breadcrumb-item>创建小队</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <h1>创建小队</h1>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="小队名称" prop="teamName">
          <el-input v-model="ruleForm.teamName"></el-input>
        </el-form-item>
        <el-form-item label="小队目的地" prop="destination">
          <v-distpicker @selected="regionSelect" hide-area></v-distpicker>
        </el-form-item>
        <el-form-item label="出发日期" required>
          <el-col :span="11">
            <el-form-item prop="date">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                v-model="ruleForm.date"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="小队类型" prop="type">
          <el-radio-group v-model="ruleForm.type">
            <el-radio label="双人旅行"></el-radio>
            <el-radio label="三人出征"></el-radio>
            <el-radio label="五人开黑"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="小队介绍" prop="desc">
          <el-input class="textarea" type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item class="createTeamButtons">
          <el-button type="primary" @click="submitForm('ruleForm')" class="create">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')" class="reset">重置</el-button>
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
    //检测小队名是否可用
    var validateCheckTeamName = async (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入小队名称"));
      } else {
        const res = await this.$http.get(`/createTeam/${value}`);
        if (res.data.status === 0) {
          callback(new Error(res.data.message));
        }
        if (res.data.status === 1) {
          callback();
        }
      }
    };
    return {
      isLogin: false,
      ruleForm: {
        teamName: "",
        province: "",
        city: "",
        date: "",
        type: "",
        members: 1,
        desc: "",
        userId: "",
      },
      rules: {
        teamName: [
          { required: true, message: "请输入小队名称", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
          {
            validator: validateCheckTeamName,
            trigger: "blur",
          },
        ],
        date: [
          {
            required: true,
            message: "请选择出发日期",
            trigger: "change",
          },
        ],
        type: [{ required: true, message: "请选择小队类型", trigger: "blur" }],
        desc: [{ required: true, message: "请填写小队简介", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.ruleForm.province === "" || this.ruleForm.city === "") {
            this.$message.error("请选择小队目的地！");
          } else {
            const res = await this.$http.post("/createTeam", this.ruleForm);
            if (res.data.status === 1) {
              this.$message({
                message: res.data.message,
                type: "success",
              });
              this.$router.push("/team");
            } else if (res.data.status === 0) {
              this.$message.error(res.data.message);
            }
          }
        } else {
          this.$message.error("请完善小队信息！");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    regionSelect(data) {
      this.ruleForm.province = data.province.value;
      this.ruleForm.city = data.city.value;
    },
    async justify() {
      //判断是否登录
      var res = await this.$http.get("/isLogin");
      if (res.data.status === 1) {
        this.isLogin = true;
        let userId = res.data.userId;
        this.ruleForm.userId = userId;
        //判断是否创建小队
        res = await this.$http.get(`/isCreate/${userId}`);
        //尚未创建小队
        if (res.data.status === 1) {
          //判断是否加入小队
          res = await this.$http.get(`/isJoin/${userId}`);
          if (res.data.status === 1) {
            this.isJoin = false;
            //是否申请小队
            res = await this.$http.get(`/isApplyTeam/${userId}`);
            if (res.data.status === 1) {
              this.isApply = false;
            } else if (res.data.status === 2) {
              this.$confirm("您已提交入队申请，是否前往查看申请状态?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  this.$router.push("/messageStatus");
                })
                .catch(() => {
                  this.$router.push("/team");
                });
            } else {
              this.$message.error("请求出错啦，请稍后重试！");
              this.$router.push("/team");
            }
          } else if (res.data.status === 2) {
            this.$confirm("您已加入小队，是否前往查看您的小队?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.$router.push("/myJoinTeam");
              })
              .catch(() => {
                this.$router.push("/team");
              });
          } else {
            this.$message.error("请求出错啦，请稍后重试！");
            this.$router.push("/team");
          }
        } else if (res.data.status === 2) {
          this.$confirm("您已创建小队，是否前往查看您的小队?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$router.push("/myCreateTeam");
            })
            .catch(() => {
              this.$router.push("/team");
            });
        } else {
          this.$message.error("请求出错啦，请稍后重试！");
          this.$router.push("/team");
        }
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
.content {
  width: 90%;
  margin: 0 auto;
  padding: 20px 0;
}

.box-card {
  width: 100%;
  margin: 5vh 0;
}

.el-input {
  width: 30%;
}

.textarea {
  width: 40%;
}

.createTeamButtons {
  display: flex;
  flex-direction: column;
}
.create {
  width: 15%;
}
.reset {
  width: 10%;
}
.create {
  color: #333;
  background-color: rgb(236, 248, 255);
  border-color: rgb(220, 223, 230);
}
.create:hover {
  background-color: rgb(230, 242, 242);
  border-color: rgb(179, 192, 209);
}
</style>