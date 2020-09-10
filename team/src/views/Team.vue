<template>
  <div>
    <el-container style="height: 100vh; border: 1px solid #eee">
      <!-- 头部区域 -->
      <el-header>
        <div class="teamHeader">
          <span class="title">Traveler组队交友平台</span>
          <span class="user" v-if="isLogin">欢迎您,{{user}}</span>
          <span v-else class="user teamLogin" @click="$router.push('/login')">请登录</span>
          <el-popover placement="buttom" width="180" v-model="visible">
            <p>确定退出登录吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false" style="color:#333;">取消</el-button>
              <el-button type="primary" size="mini" @click="logout" style="background-color:red;border-color:red;">确定</el-button>
            </div>
            <el-button slot="reference" class="teamLogout" :style="{ display: visibleButton }">退出登录</el-button>
          </el-popover>
        </div>
      </el-header>

      <el-container>
        <!-- 左侧导航栏区域 -->
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
          <el-menu router :default-active="$route.path">
            <!-- 寻找小队页面 -->
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-s-flag"></i>Traveler小队
              </template>
              <el-menu-item-group>
                <template slot="title">小队</template>
                <el-menu-item index="/team">
                  <template slot="title">
                    <i class="el-icon-search"></i>寻找小队
                  </template>
                </el-menu-item>
                <el-menu-item index="/createTeam">
                  <template slot="title">
                    <i class="el-icon-s-promotion"></i>创建小队
                  </template>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <!-- 我的小队页面 -->
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-menu"></i>我的小队
              </template>
              <el-menu-item-group>
                <template slot="title">我的</template>
                <el-menu-item index="/myCreateTeam">
                  <template slot="title">
                    <i class="el-icon-user-solid"></i>我创建的小队
                  </template>
                </el-menu-item>
                <el-menu-item index="/myJoinTeam">
                  <template slot="title">
                    <i class="el-icon-user"></i>我加入的小队
                  </template>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <!-- 消息中心页面 -->
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-message"></i>消息中心
              </template>
              <el-menu-item-group>
                <template slot="title">队长消息</template>
                <el-menu-item index="/messageApply">
                  <template slot="title">
                    <i class="el-icon-chat-dot-round"></i>入队申请
                  </template>
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <template slot="title">队员消息</template>
                <el-menu-item index="/messageStatus">
                  <template slot="title">
                    <i class="el-icon-open"></i>申请状态
                  </template>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <!-- 个人中心页面 -->
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-user-solid"></i>个人中心
              </template>
              <el-menu-item-group>
                <template slot="title">个人主页</template>
                <el-menu-item index="/myInfo">
                  <template slot="title">
                    <i class="el-icon-setting"></i>个人信息
                  </template>
                </el-menu-item>
                <el-menu-item index="/myPass">
                  <template slot="title">
                    <i class="el-icon-lock"></i>修改密码
                  </template>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>

        <!-- 主板内容区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLogin: false,
      user: "",
      userId: "",
      visible: false,
      visibleButton: 'none'
    };
  },
  methods: {
    async justifyIsLogin() {
      const res = await this.$http.get("/isLogin");
      if (res.data.status === 1) {
        this.isLogin = true;
        this.visibleButton= 'block'
        this.user = res.data.username;
        this.userId = res.data.userId;
      }
    },
    async logout() {
      const res = await this.$http.get("/logout");
      this.visible = false
      this.$message({
        message: res.data.message,
        type: "success",
      })
      this.$router.push('/')
    },
  },
  created() {
    this.justifyIsLogin();
  },
};
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
.teamHeader {
  width: 90%;
  margin: 0 auto;
}
.teamHeader .title {
  font-size: 20px;
  font-weight: bold;
  color: white;
}
.teamHeader .user {
  position: absolute;
  right: 15%;
  font-size: 15px;
  font-weight: bold;
}
.teamHeader .teamLogin {
  cursor: pointer;
}
.teamHeader .teamLogin:hover {
  color: white;
}
.teamHeader .teamLogout {
  right: 8%;
  top: 10px;
  position: absolute;
  font-size: 15px;
  font-weight: bold;
}
.el-popover{
  right: 8%;
}
.el-aside {
  color: #333;
}
</style>