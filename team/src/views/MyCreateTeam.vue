<template>
  <div class="content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/#/team">Traveler组队交友平台</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>我的小队</el-breadcrumb-item>
      <el-breadcrumb-item>我创建的小队</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div class="box-card-content">
        <div class="title">
          <h1>我创建的小队</h1>
          <div class="edit" @click="isEdit = true">
            <i class="el-icon-edit"></i>
            <span>编辑小队信息</span>
          </div>
        </div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="小队名称" prop="teamName">
            <el-input v-model="ruleForm.teamName" v-if="isEdit"></el-input>
            <span v-else>{{teamInfo.teamName}}</span>
          </el-form-item>
          <el-form-item label="小队目的地" prop="destination">
            <v-distpicker
              v-if="isEdit"
              @selected="regionSelect"
              hide-area
              :province="ruleForm.province"
              :city="ruleForm.city"
            ></v-distpicker>
            <span v-else>{{teamInfo.province}}·{{teamInfo.city}}</span>
          </el-form-item>
          <el-form-item label="出发日期" required>
            <el-col :span="11" v-if="isEdit">
              <el-form-item prop="date">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  v-model="ruleForm.date"
                  style="width:200px"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <span v-else>{{teamInfo.date}}</span>
          </el-form-item>
          <el-form-item label="小队类型" prop="type">
            <el-radio-group v-model="ruleForm.type" v-if="isEdit" :disabled="true">
              <el-radio label="双人旅行"></el-radio>
              <el-radio label="三人出征"></el-radio>
              <el-radio label="五人开黑"></el-radio>
            </el-radio-group>
            <div v-else>
              <el-tag v-if="teamInfo.type === '双人旅行'">双人旅行</el-tag>
              <el-tag v-if="teamInfo.type === '三人出征'" type="success">三人出征</el-tag>
              <el-tag v-if="teamInfo.type === '五人开黑'" type="danger">五人开黑</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="小队介绍" prop="desc">
            <el-input class="textarea" type="textarea" v-model="ruleForm.desc" v-if="isEdit"></el-input>
            <span v-else>{{teamInfo.desc}}</span>
          </el-form-item>
          <el-form-item class="createTeamButtons" v-if="isEdit">
            <el-button type="primary" @click="submitForm('ruleForm')" class="create">保存</el-button>
            <el-button @click="canselEdit" class="reset">取消</el-button>
          </el-form-item>
        </el-form>

        <h3>
          小队成员
          <span>({{teamInfo.members-1}}人)</span>
        </h3>
        <el-input placeholder="请输入成员名称" prefix-icon="el-icon-search" v-model="searchMember"></el-input>
        <el-button icon="el-icon-search" @click="searchMemberByName">添加成员</el-button>

        <el-table :data="teamMemberList" style="width: 90%; margin: 10px auto">
          <el-table-column label="姓名" width="180" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="性别" width="120" align="center">
            <template slot-scope="scope">
              <i
                class="el-icon-male"
                v-if="scope.row.sex === 'male'"
                style="color:rgb(35,168,242);"
              ></i>
              <i class="el-icon-female" v-else style="color:red;"></i>
            </template>
          </el-table-column>
          <el-table-column label="电话" width="180" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="邮件" width="200" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.email }}</span>
            </template>
          </el-table-column>
          <el-table-column label="QQ" width="180" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.qq }}</span>
            </template>
          </el-table-column>
          <el-table-column label="地址" width="200" align="center">
            <template slot-scope="scope">
              <span
                style="margin-left: 10px"
              >{{ scope.row.province }} · {{scope.row.city}} · {{scope.row.area}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除成员</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="quitTeam">
          <el-button type="danger" @click="removeTeam">解散小队</el-button>
        </div>
      </div>
    </el-card>

    <!-- 弹出对话框 -->
    <el-dialog title="成员信息" :visible.sync="dialogVisible" width="30%">
      <el-form :model="searchMemberInfo" label-width="100px" class="demo-searchMemberInfo">
        <el-form-item label="姓名">
          <span>{{searchMemberInfo.name}}</span>
        </el-form-item>
        <el-form-item label="性别">
          <span>{{searchMemberInfo.sex}}</span>
        </el-form-item>
        <el-form-item label="地址">
          <span>{{searchMemberInfo.province}} · {{searchMemberInfo.city}} · {{searchMemberInfo.area}}</span>
        </el-form-item>
        <el-form-item label="电话">
          <span>{{searchMemberInfo.phone}}</span>
        </el-form-item>
        <el-form-item label="QQ">
          <span>{{searchMemberInfo.qq}}</span>
        </el-form-item>
        <el-form-item label="邮箱">
          <span>{{searchMemberInfo.email}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMember">添 加</el-button>
      </div>
    </el-dialog>
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
      } else if (value === this.teamInfo.teamName) {
        callback();
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
      isEdit: false,
      ruleForm: {
        teamId: 0,
        teamName: "",
        province: "",
        city: "",
        date: "",
        type: "",
        members: 1,
        desc: "",
        userId: "",
      },
      //为保证修改时能撤销修改，设置两个变量
      teamInfo: {},
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
      //小队成员列表
      teamMemberList: [],
      searchMember: "",
      searchMemberInfo: {},

      dialogVisible: false,
    };
  },
  methods: {
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
          this.$confirm("您尚未创建小队，是否前往创建您的小队?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$router.push("/createTeam");
            })
            .catch(() => {
              this.$router.push("/team");
            });
        } else if (res.data.status === 2) {
          var myCreateTeamID = res.data.createTeam;
          this.ruleForm.teamId = myCreateTeamID;
          this.getTeamInfo();
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
    async getTeamInfo() {
      var res = await this.$http.get(`/myCreateTeam/${this.ruleForm.teamId}`);
      if (res.data.status === 1) {
        //加载小队数据
        var myTeam = res.data.myCreateTeam;
        this.teamInfo.teamName = myTeam.teamName;
        this.teamInfo.province = myTeam.teamProvince;
        this.teamInfo.city = myTeam.teamCity;
        this.teamInfo.date = myTeam.teamDate;
        this.teamInfo.type = myTeam.teamType;
        this.teamInfo.desc = myTeam.teamDesc;
        this.teamInfo.members = myTeam.teamMembers;

        this.ruleForm.teamName = myTeam.teamName;
        this.ruleForm.province = myTeam.teamProvince;
        this.ruleForm.city = myTeam.teamCity;
        this.ruleForm.date = myTeam.teamDate;
        this.ruleForm.type = myTeam.teamType;
        this.ruleForm.desc = myTeam.teamDesc;
        this.ruleForm.members = myTeam.teamMembers;
        //加载小队成员信息
        this.getTeamMemberList(this.ruleForm.teamId);
      } else {
        this.$message.error("请求出错啦，请稍后重试！");
        this.$router.push("/team");
      }
    },
    async getTeamMemberList(myCreateTeamID) {
      var res = await this.$http.get(`/teamMemberList/${myCreateTeamID}`);
      this.teamMemberList = res.data.teamMemberList;
    },
    regionSelect(data) {
      this.ruleForm.province = data.province.value;
      this.ruleForm.city = data.city.value;
    },
    //修改小队信息
    canselEdit(){
      this.isEdit=false
      this.getTeamInfo()
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.ruleForm.province === "" || this.ruleForm.city === "") {
            this.$message.error("请选择小队目的地！");
          } else {
            const res = await this.$http.post("/editTeam", this.ruleForm);
            if (res.data.status === 1) {
              this.$message({
                message: res.data.message,
                type: "success",
              });
              this.isEdit = false;
              this.getTeamInfo()
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
    //删除小队成员
    handleDelete(index, row) {
      this.$confirm(`您确认要将成员【${row.name}】从小队中移除吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          var removeInfo = {};
          removeInfo.teamId = this.ruleForm.teamId;
          removeInfo.userId = row.id;
          removeInfo.teamMembers = this.ruleForm.members - 1;
          var res = await this.$http.post("/removeMember", removeInfo);
          if (res.data.status === 1) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getTeamMemberList(this.ruleForm.teamId);
          } else {
            this.$message.error("删除失败！");
          }
        })
        .catch(() => {
          this.$router.push("/team");
        });
    },
    //搜索小队成员
    async searchMemberByName() {
      var res = await this.$http(`/searchUserByName/${this.searchMember}`);
      if (res.data.status === 1) {
        this.searchMemberInfo = res.data.userInfo;

        this.dialogVisible = true;
      } else {
        this.$message.error("未找到该成员，请重试！");
      }
    },
    //添加小队成员
    addMember() {
      var addMemberInfo = this.searchMemberInfo;
      if (
        addMemberInfo.createTeam !== null ||
        addMemberInfo.joinTeam !== null
      ) {
        this.$message.error("该成员已创建或已加入小队！添加失败！");
        this.dialogVisible = false;
      } else {
        this.$confirm(`确认添加${addMemberInfo.name}为小队成员？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            //判断小队人数
            var teamType = this.ruleForm.type;
            var teamMaxMembers = 5;
            if (teamType === "双人旅行") {
              teamMaxMembers = 2;
            } else if (teamType === "三人出征") {
              teamMaxMembers = 3;
            }
            var teamMembers = this.ruleForm.members;

            if (teamMembers === teamMaxMembers) {
              this.$message.error("小队人数已满！");
            } else {
              var res = await this.$http.post("addUser", {
                joinTeam: this.ruleForm.teamId,
                userId: this.searchMemberInfo.id,
                members: teamMembers + 1,
              });
              if (res.data.status === 1) {
                this.$message({
                  message: res.data.message,
                  type: "success",
                });
                this.getTeamMemberList(this.ruleForm.teamId);
              } else {
                this.$message.error(res.data.message);
              }
            }
            this.dialogVisible = false;
          })
          .catch(() => {
            this.dialogVisible = false;
          });
      }
    },
    //解散小队
    removeTeam() {
      this.$confirm(`您确认要解散小队"${this.ruleForm.teamName}"吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          var res = await this.$http(`/removeTeam/${this.ruleForm.teamId}`);
          if (res.data.status === 1) {
            this.$message({
              type: "success",
              message: "解散成功！",
            });
            this.$router.push("/team");
          } else {
            this.$message.error("出错了！请重试！");
          }
        })
        .catch(() => {
          this.$message({
            message: "已取消",
            type: "info",
          });
        });
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
.quitTeam {
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>