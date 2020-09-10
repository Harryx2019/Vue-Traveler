<template>
  <div class="content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/#/team">Traveler组队交友平台</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>Traveler小队</el-breadcrumb-item>
      <el-breadcrumb-item>寻找小队</el-breadcrumb-item>
    </el-breadcrumb>

    <el-carousel :interval="4000" type="card" height="28vh" indicator-position="none">
      <el-carousel-item v-for="item in images" :key="item.id">
        <el-image :src="item.url" fit="cover"></el-image>
      </el-carousel-item>
    </el-carousel>

    <el-card class="box-card">
      <h1>寻找小队</h1>
      <el-input placeholder="请输入小队名称" prefix-icon="el-icon-search" v-model="searchTeamName"></el-input>
      <el-button icon="el-icon-search" @click="searchTeam">搜索小队</el-button>

      <el-table :data="teamList" style="width: 100%;" :row-class-name="tableRowClassName">
        <el-table-column label="小队名称" width="180" align="center">
          <template slot-scope="scope">
            <span style="font-size: 17px; font-weight: bold;">{{ scope.row.teamName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="小队目的地" width="180" align="center">
          <template slot-scope="scope">
            <span
              style="font-size: 17px; font-weight: bold;"
            >{{ scope.row.teamProvince }}·{{scope.row.teamCity}}</span>
          </template>
        </el-table-column>
        <el-table-column label="出发日期" width="180" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.teamDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="队长" width="100" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top" width="200">
              <p>姓名: {{ scope.row.teamHeader.name }}</p>
              <p>
                性别:
                <i
                  class="el-icon-male"
                  v-if="scope.row.teamHeader.sex === 'male'"
                  style="color:rgb(35,168,242);"
                ></i>
                <i class="el-icon-female" v-else style="color:red;"></i>
              </p>
              <p>电话: {{ scope.row.teamHeader.phone }}</p>
              <p>QQ: {{ scope.row.teamHeader.qq }}</p>
              <p>邮箱: {{ scope.row.teamHeader.email }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.teamHeader.name }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="小队类型"
          width="100"
          :filters="[{ text: '双人旅行', value: '双人旅行' }, { text: '三人出征', value: '三人出征' },{ text: '五人开黑', value: '五人开黑' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.teamType === '双人旅行'" disable-transitions>{{scope.row.teamType}}</el-tag>
            <el-tag
              v-if="scope.row.teamType === '三人出征'"
              type="success"
              disable-transitions
            >{{scope.row.teamType}}</el-tag>
            <el-tag
              v-if="scope.row.teamType === '五人开黑'"
              type="danger"
              disable-transitions
            >{{scope.row.teamType}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="小队人数" width="80" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.teamMembers }}</span>
          </template>
        </el-table-column>
        <el-table-column label="小队介绍" width="240" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.teamDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请入队" align="center">
          <template slot-scope="scope">
            <el-button type="success" @click="applyTeam(scope.$index, scope.row)">申请入队</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="teamList.length"
      ></el-pagination>
    </el-card>

    <el-card class="box-card-bottom">
      <h4>Traveler组队交友平台 使用说明</h4>
      <p>1.所有用户均可浏览所有小队信息，如若需要加入小队或创建小队则必需注册登录。</p>
      <p>2.每个用户只能拥有一个小队或者加入一个小队，即已经创建小队则不能加入小队，已经加入小队则不能创建小队。</p>
      <p>3.只有队长身份才能接受入队申请，小队人数有严格限制，不可超过小队最大规模。</p>
      <p>4.每一个用户可以同时向多个小队提交入队申请，但只能加入一个小队。</p>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [
        {
          id: 1,
          url: require("../img/team1.png"),
        },
        {
          id: 2,
          url: require("../img/team2.png"),
        },
        {
          id: 3,
          url: require("../img/team3.png"),
        },
        {
          id: 4,
          url: require("../img/team4.png"),
        },
      ],
      searchTeamName: "",

      // 查询参数对象
      queryInfo: {
        pagenum: 1,
        pagesize: 10,
      },
      teamList: [],
      currentPage4: 4,

      isLogin: false,
      isCreate: false,
      isJoin: false,
      userId: 0,
    };
  },
  methods: {
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "warning-row";
      }
      return "";
    },
    async getTeamList() {
      var res = await this.$http.get("/teamList", {
        params: this.queryInfo,
      });
      if (res.data.status === 1) {
        var teamList = res.data.teamList;
        //将队长信息添加至队伍列表中
        for (var i = 0; i < teamList.length; i++) {
          res = await this.$http.get(`/searchUser/${teamList[i].teamHeader}`);
          if (res.data.status === 1) {
            teamList[i].teamHeader = res.data.userInfo;
          } else {
            this.$message.error(res.data.message);
          }
        }
        this.teamList = teamList;
      } else {
        this.$message.error(res.data.message);
      }
    },
    filterTag(value, row) {
      return row.teamType === value;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getTeamList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getTeamList();
    },
    //搜索小队
    async searchTeam() {
      if (this.searchTeamName === "") {
        this.$message.error("请输入小队名称");
        this.getTeamList();
      } else {
        var res = await this.$http.get(`/searchTeam/${this.searchTeamName}`);
        var searchTeamInfo = res.data.teamInfo;
        //将队长信息添加至队伍列表中
        res = await this.$http.get(
          `/searchUser/${searchTeamInfo[0].teamHeader}`
        );
        if (res.data.status === 1) {
          searchTeamInfo[0].teamHeader = res.data.userInfo;
        } else {
          this.$message.error(res.data.message);
        }
        this.teamList = searchTeamInfo;
      }
    },
    //申请入队
    applyTeam(index, row) {
      if (this.isLogin) {
        if (this.isCreate) {
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
          if (this.isJoin) {
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
            this.$confirm(`确认向小队"${row.teamName}"发起入队申请？`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(async () => {
                //判断小队人数
                var teamType = row.teamType;
                var teamMaxMembers = 5;
                if (teamType === "双人旅行") {
                  teamMaxMembers = 2;
                } else if (teamType === "三人出征") {
                  teamMaxMembers = 3;
                }
                var teamMembers = row.teamMembers;

                if (teamMembers === teamMaxMembers) {
                  this.$message.error("小队人数已满！");
                } else {
                  var applyinfo = {};
                  applyinfo.applyUser = this.userId;
                  applyinfo.applyTeam = row.teamId;
                  var res = await this.$http.post("/isApply", applyinfo);
                  if (res.data.status === 1) {
                    res = await this.$http.post("/applyTeam", applyinfo);
                    this.$message({
                      type: "success",
                      message: "已发送申请!",
                    });
                  } else {
                    this.$confirm(
                      `您已向小队"${row.teamName}"发起入队申请,是否前往查看申请状态？`,
                      "提示",
                      {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                      }
                    )
                      .then(() => {
                        this.$router.push("/messageStatus");
                      })
                      .catch(() => {
                        this.$router.push("/team");
                      });
                  }
                }
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消申请",
                });
              });
          }
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
          } else if (res.data.status === 2) {
            this.isJoin = true;
          } else {
            this.$message.error("请求出错啦，请稍后重试！");
            this.$router.push("/team");
          }
        } else if (res.data.status === 2) {
          this.isCreate = true;
        } else {
          this.$message.error("请求出错啦，请稍后重试！");
          this.$router.push("/team");
        }
      }
    },
  },
  created() {
    this.getTeamList();
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

.el-carousel {
  width: 90%;
  margin: 2vh auto;
}

.box-card {
  width: 90%;
  margin: 0 auto;
}
.el-input {
  width: 20%;
  margin-right: 10px;
}

.el-pagination {
  margin-top: 15px;
}

.box-card-bottom{
  width: 90%;
  margin: 5vh auto;
}
.box-card-bottom p{
  font-size: 14px;
}
</style>