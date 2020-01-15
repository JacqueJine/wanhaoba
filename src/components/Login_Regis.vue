<template>
  <div class="l_r">
    <div class="head">
      <p>
        <router-link to="/login_regis/login">登录</router-link>
        <router-link to="/login_regis/register">注册</router-link>
      </p>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.head {
  padding: 15px;
}
.l_r .head p {
  display: flex;
  justify-content: space-between;
}
.router-link-active {
  color: #333333;
  font-size: 0.2rem;
}
a{
    color:rgba(51,51,51,.4);
    font-size:.18rem;
}
</style>