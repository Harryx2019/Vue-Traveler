<template>
  <div class="content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/#/team">Traveler组队交友平台</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>消息中心</el-breadcrumb-item>
      <el-breadcrumb-item>申请状态</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div class="title">
        <h1>申请状态</h1>
        <span style="font-size:14px;">注：当申请状态为【已同意】或【已拒绝】，请点击确认按钮。</span>
      </div>

      <el-table
        :data="applyList"
        style="width: 100%;margin: 20px auto;"
        :row-class-name="tableRowClassName"
      >
        <el-table-column label="小队名称" width="180" align="center">
          <template slot-scope="scope">
            <span style="font-size: 17px; font-weight: bold;">{{ scope.row.teamInfo.teamName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="小队目的地" width="180" align="center">
          <template slot-scope="scope">
            <span
              style="font-size: 17px; font-weight: bold;"
            >{{ scope.row.teamInfo.teamProvince }}·{{scope.row.teamInfo.teamCity}}</span>
          </template>
        </el-table-column>
        <el-table-column label="出发日期" width="180" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.teamInfo.teamDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="队长" width="100" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top" width="200">
              <p>姓名: {{ scope.row.teamHeaderInfo.name }}</p>
              <p>
                性别:
                <i
                  class="el-icon-male"
                  v-if="scope.row.teamHeaderInfo.sex === 'male'"
                  style="color:rgb(35,168,242);"
                ></i>
                <i class="el-icon-female" v-else style="color:red;"></i>
              </p>
              <p>电话: {{ scope.row.teamHeaderInfo.phone }}</p>
              <p>QQ: {{ scope.row.teamHeaderInfo.qq }}</p>
              <p>邮箱: {{ scope.row.teamHeaderInfo.email }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.teamHeaderInfo.name }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="小队类型" width="100" align="center">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.teamInfo.teamType === '双人旅行'"
              disable-transitions
            >{{scope.row.teamInfo.teamType}}</el-tag>
            <el-tag
              v-if="scope.row.teamInfo.teamType === '三人出征'"
              type="success"
              disable-transitions
            >{{scope.row.teamInfo.teamType}}</el-tag>
            <el-tag
              v-if="scope.row.teamInfo.teamType === '五人开黑'"
              type="danger"
              disable-transitions
            >{{scope.row.teamInfo.teamType}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="小队人数" width="80" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.teamInfo.teamMembers }}</span>
          </template>
        </el-table-column>
        <el-table-column label="小队介绍" width="240" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.teamInfo.teamDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请状态" width="120" align="center">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.applyStatus === 0">待审核</el-tag>
            <el-tag type="success" v-if="scope.row.applyStatus === 1">已通过</el-tag>
            <el-tag type="danger" v-if="scope.row.applyStatus === 2">已拒绝</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="danger"
              @click="withdrawApply(scope.$index, scope.row)"
              v-if="scope.row.applyStatus === 0"
            >撤回申请</el-button>
            <el-button type="success" @click="confirmApply(scope.$index, scope.row)" v-else>确认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: "",
      applyList: [],
    };
  },
  methods: {
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "warning-row";
      }
      return "";
    },
    async getApplyList() {
      var res = await this.$http.get(`/applyTeamList/${this.userId}`);
      if (res.data.status === 1) {
        var applyTeamList = res.data.applyList;
        //补充完整队伍及队长信息
        for (var i = 0; i < applyTeamList.length; i++) {
          var teamId = applyTeamList[i].applyTeam;
          res = await this.$http.get(`/searchTeamById/${teamId}`);
          applyTeamList[i].teamInfo = res.data.teamInfo;

          res = await this.$http.get(`/teamHeader/${teamId}`);
          applyTeamList[i].teamHeaderInfo = res.data.headerInfo;
        }
        this.applyList = applyTeamList;
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
        this.userId = userId;
        //判断是否创建小队
        res = await this.$http.get(`/isCreate/${userId}`);
        //尚未创建小队
        if (res.data.status === 1) {
          //判断是否加入小队
          res = await this.$http.get(`/isJoin/${userId}`);
          if (res.data.status === 1) {
            this.isJoin = false;
            //获取申请列表
            this.getApplyList();
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
          this.$confirm(
            "您已是【队长】身份，不可接收申请状态消息，是否查看您创建的小队？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
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
    async confirmApply(index, row) {
      var deleteInfo = {};
      deleteInfo.applyUser = row.applyUser;
      deleteInfo.applyTeam = row.applyTeam;
      const res = await this.$http.post("/deleteApply", deleteInfo);
      if (res.data.status === 1) {
        if (row.applyStatus === 1) {
          this.$message({
            type: "success",
            message: `您已成功加入"${row.teamInfo.teamName}"小队`,
          });
        } else {
          this.$message({
            type: "success",
            message: "已确认",
          });
        }
        this.getApplyList();
      } else {
        this.$message.error("操作失败！");
      }
    },
    withdrawApply(index, row) {
      this.$confirm(
        `您确认撤回向小队"${row.teamInfo.teamName}"的入队申请?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(async () => {
        var deleteInfo = {};
        deleteInfo.applyUser = row.applyUser;
        deleteInfo.applyTeam = row.applyTeam;
        const res = await this.$http.post("/deleteApply", deleteInfo);
        if (res.data.status === 1) {
          this.$message({
            type: "success",
            message: "撤回申请成功！",
          });
          this.getApplyList();
        } else {
          this.$message.error("撤回失败");
        }
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
</style>