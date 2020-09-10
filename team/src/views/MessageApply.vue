<template>
  <div class="content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/#/team">Traveler组队交友平台</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>消息中心</el-breadcrumb-item>
      <el-breadcrumb-item>入队申请</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div class="box-card-content">
        <h1>入队申请</h1>
        <el-form :model="myTeamInfo" label-width="100px" class="demo-myTeamInfo">
          <el-form-item label="小队名称">
            <span>{{myTeamInfo.teamName}}</span>
          </el-form-item>
          <el-form-item label="小队目的地">
            <span>{{myTeamInfo.teamProvince}}·{{myTeamInfo.teamCity}}</span>
          </el-form-item>
          <el-form-item label="出发日期">
            <span>{{myTeamInfo.teamDate}}</span>
          </el-form-item>
          <el-form-item label="小队类型">
            <div>
              <el-tag v-if="myTeamInfo.teamType === '双人旅行'">双人旅行</el-tag>
              <el-tag v-if="myTeamInfo.teamType === '三人出征'" type="success">三人出征</el-tag>
              <el-tag v-if="myTeamInfo.teamType === '五人开黑'" type="danger">五人开黑</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="小队介绍">
            <span>{{myTeamInfo.teamDesc}}</span>
          </el-form-item>
        </el-form>

        <h1>
          申请列表
          <span>({{applyList.length}})</span>
        </h1>
        <el-table :data="applyList" style="width: 100%">
          <el-table-column label="姓名" width="180" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.userInfo.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="性别" width="120" align="center">
            <template slot-scope="scope">
              <i
                class="el-icon-male"
                v-if="scope.row.userInfo.sex === 'male'"
                style="color:rgb(35,168,242);"
              ></i>
              <i class="el-icon-female" v-else style="color:red;"></i>
            </template>
          </el-table-column>
          <el-table-column label="地址" width="220" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.userInfo.province }} · {{scope.row.userInfo.city}} · {{scope.row.userInfo.area}}</span>
            </template>
          </el-table-column>
          <el-table-column label="电话" width="180" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.userInfo.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="QQ" width="180" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.userInfo.qq }}</span>
            </template>
          </el-table-column>
          <el-table-column label="邮箱" width="220" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.userInfo.email }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="aggreApply(scope.$index, scope.row)">同意</el-button>
              <el-button size="mini" type="danger" @click="refuseApply(scope.$index, scope.row)">拒绝</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLogin: false,
      userId: 0,

      createTeam: 0,
      myTeamInfo: {},
      applyList: [],
    };
  },
  methods: {
    async justify() {
      //判断是否登录
      var res = await this.$http.get("/isLogin");
      if (res.data.status === 1) {
        this.isLogin = true;
        let userId = res.data.userId;
        this.userId = userId;
        //判断是否创建小队
        res = await this.$http.get(`/isCreate/${userId}`);
        //尚未创建小队
        if (res.data.status === 1) {
          this.$confirm(
            "只有【队长】身份才能接收入队申请消息，是否前往创建你的小队?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(() => {
              this.$router.push("/createTeam");
            })
            .catch(() => {
              this.$router.push("/team");
            });
        } else if (res.data.status === 2) {
          //获取申请列表
          var createTeam = res.data.createTeam;
          this.createTeam = createTeam;
          res = await this.$http.get(`searchTeamById/${createTeam}`);
          if (res.data.status === 1) {
            this.myTeamInfo = res.data.teamInfo;
          } else {
            this.$message.error("请求出错啦，请稍后重试！");
            this.$router.push("/team");
          }

          this.getApplyList();
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
    async getApplyList() {
      var res = await this.$http.get(`/teamApplyList/${this.createTeam}`);
      if (res.data.status === 1) {
        var applyList = res.data.applyList;
        for (var i = 0; i < applyList.length; i++) {
          res = await this.$http.get(`/searchUser/${applyList[i].applyUser}`);
          applyList[i].userInfo = res.data.userInfo;
        }
        this.applyList = applyList;
      } else {
        this.$message.error("请求出错啦，请稍后重试！");
        this.$router.push("/team");
      }
    },
    aggreApply(index, row) {
      this.$confirm(`您确认同意"${row.userInfo.name}"的入队申请?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        //判断小队人数是否符合要求
        var teamType = this.myTeamInfo.teamType;
        var teamMaxMembers = 5;
        if (teamType === "双人旅行") {
          teamMaxMembers = 2;
        } else if (teamType === "三人出征") {
          teamMaxMembers = 3;
        }
        var teamMembers = this.myTeamInfo.teamMembers;
        if (teamMembers === teamMaxMembers) {
          //如果小队人数已满 拒绝所有入队申请
          //this.clearApplyList()
          this.$message.error("小队人数已满！");
        } else {
          var applyInfo = {};
          applyInfo.applyUser = row.applyUser;
          applyInfo.applyTeam = row.applyTeam;
          applyInfo.teamMembers = teamMembers + 1;
          var res = await this.$http.post("/agreeApply", applyInfo);
          if (res.data.status === 1) {
            //清除申请记录
            var deleteInfo = {};
            deleteInfo.applyUser = row.applyUser;
            deleteInfo.applyTeam = row.applyTeam;
            res = await this.$http.post("/deleteApply", deleteInfo);
            if (res.data.status === 1) {
              this.$message({
                type: "success",
                message: "已同意",
              });
              this.getApplyList();
            } else {
              this.$message.error("操作失败！");
            }
          } else {
            this.$message.error("操作失败");
          }
        }
      });
    },
    refuseApply(index, row) {
      this.$confirm(`您确认拒绝"${row.userInfo.name}"的入队申请?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        var applyInfo = {};
        applyInfo.applyUser = row.applyUser;
        applyInfo.applyTeam = row.applyTeam;
        const res = await this.$http.post("/refuseApply", applyInfo);
        if (res.data.status === 1) {
          this.$message({
            type: "success",
            message: "已拒绝",
          });
          this.getApplyList();
        } else {
          this.$message.error("操作失败");
        }
      });
    },
    async clearApplyList() {
      for (var i = 0; i < this.applyList.length; i++) {
        var applyInfo = {};
        applyInfo.applyUser = this.applyList[i].applyUser;
        applyInfo.applyTeam = this.applyList[i].applyTeam;
        const res = await this.$http.post("/refuseApply", applyInfo);
        if (res.data.status === 0) {
          this.$message.error("操作失败");
          return;
        }
      }
      this.getApplyList();
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
</style>