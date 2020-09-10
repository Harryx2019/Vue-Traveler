<template>
  <div class="about">
    <el-card class="box-card">
      <div slot="header" class="header">
        <span>欢迎来到Traveler组队交友平台</span>
      </div>
      <div class="buttons">
        <el-button type="primary" round class="login" @click="$router.push('/login')">登录</el-button>
        <el-button type="success" round class="register" @click="$router.push('/register')">注册</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  
}
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
.buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 120px;
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
.buttons .register {
  margin-left: 0;
}
</style>
