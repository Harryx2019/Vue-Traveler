<template>
  <div class="content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/#/team">Traveler组队交友平台</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>我的小队</el-breadcrumb-item>
      <el-breadcrumb-item>我加入的小队</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div class="box-card-content">
        <div class="title">
          <h1>我加入的小队</h1>
        </div>
        <el-form :model="myJoinTeam" label-width="100px" class="demo-myJoinTeam">
          <el-form-item label="小队名称">
            <span>{{myJoinTeam.teamName}}</span>
          </el-form-item>
          <el-form-item label="小队目的地">
            <span>{{myJoinTeam.province}}·{{myJoinTeam.city}}</span>
          </el-form-item>
          <el-form-item label="出发日期">
            <span>{{myJoinTeam.date}}</span>
          </el-form-item>
          <el-form-item label="小队类型">
            <div>
              <el-tag v-if="myJoinTeam.type === '双人旅行'">双人旅行</el-tag>
              <el-tag v-if="myJoinTeam.type === '三人出征'" type="success">三人出征</el-tag>
              <el-tag v-if="myJoinTeam.type === '五人开黑'" type="danger">五人开黑</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="小队介绍">
            <span>{{myJoinTeam.desc}}</span>
          </el-form-item>
        </el-form>

        <h3>
          小队成员
          <span>({{myJoinTeam.members}}人)</span>
        </h3>

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
          <el-table-column label="身份" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.$index === 0" type="danger">队长</el-tag>
              <el-tag v-else type="success">队员</el-tag>
            </template>
          </el-table-column>
        </el-table>

        <div class="quitTeam">
          <el-button type="danger" @click="quitTeam">退出小队</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      myJoinTeam: {
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
      teamMemberList: [],
    };
  },
  methods: {
    async justify() {
      //判断是否登录
      var res = await this.$http.get("/isLogin");
      if (res.data.status === 1) {
        this.isLogin = true;
        let userId = res.data.userId;
        this.myJoinTeam.userId = userId;
        //判断是否加入小队
        res = await this.$http.get(`/isJoin/${userId}`);
        //尚未创建小队
        if (res.data.status === 1) {
          this.$confirm("您尚未加入小队，是否前往加入小队?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$router.push("/team");
            })
            .catch(() => {
              this.$router.push("/team");
            });
        } else if (res.data.status === 2) {
          var myJoinTeamID = res.data.joinTeam;
          res = await this.$http.get(`/myJoinTeam/${myJoinTeamID}`);
          if (res.data.status === 1) {
            //加载小队数据
            var myJoinTeam = res.data.myJoinTeam;
            this.myJoinTeam.teamId = myJoinTeam.teamId
            this.myJoinTeam.teamName = myJoinTeam.teamName;
            this.myJoinTeam.province = myJoinTeam.teamProvince;
            this.myJoinTeam.city = myJoinTeam.teamCity;
            this.myJoinTeam.date = myJoinTeam.teamDate;
            this.myJoinTeam.type = myJoinTeam.teamType;
            this.myJoinTeam.desc = myJoinTeam.teamDesc;
            this.myJoinTeam.members = myJoinTeam.teamMembers;
            //加载小队成员信息
            this.getTeamMemberList(myJoinTeamID);
          } else {
            this.$message.error("请求出错啦，请稍后重试！");
            this.$router.push("/team");
          }
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
    async getTeamMemberList(myCreateTeamID) {
      //获取队长信息
      var res = await this.$http.get(`/teamHeader/${myCreateTeamID}`);
      if (res.data.status === 1) {
        this.teamMemberList.push(res.data.headerInfo);
        res = await this.$http.get(`/teamMemberList/${myCreateTeamID}`);
        var teamMemberList = res.data.teamMemberList;
        for (var i = 0; i < teamMemberList.length; i++) {
          this.teamMemberList.push(teamMemberList[i]);
        }
      } else {
        this.$message.error("请求出错啦，请稍后重试！");
        this.$router.push("/team");
      }
    },
    quitTeam() {
      this.$confirm(`您确认要退出小队"${this.myJoinTeam.teamName}"吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          var removeInfo = {};
          removeInfo.teamId = this.myJoinTeam.teamId;
          removeInfo.userId = this.myJoinTeam.userId;
          removeInfo.teamMembers = this.myJoinTeam.members - 1;
          var res = await this.$http.post("/removeMember", removeInfo);
          if (res.data.status === 1) {
            this.$message({
              message: "退出成功！",
              type: "success",
            });
            this.$router.push("/team");
          } else {
            this.$message.error("退出失败！");
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

.quitTeam {
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>