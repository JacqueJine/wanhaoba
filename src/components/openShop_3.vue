<template>
  <div class="news">
    <div class="main">
      <van-icon name="checked" color="#7065FF" size="96px" />
      <p>恭喜您！提交成功请等待审核</p>
      <span>预计3个工作日内审核完成，请耐心等待</span>
    </div>
    <van-row class="btnGroup">
      <van-button
        color="linear-gradient(to bottom,rgba(101,116,255,1) 0%,rgba(112,101,255,1) 100%)"
        round
        size="large"
        to='/index'
      >返回首页</van-button>
    </van-row>
  </div>
</template>
<script>
export default {
  name: "openShop_3",
  data() {
    return {};
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.news {
  width: 100%;
  height: 100vh;
}
.main {
  padding: 65px 15px 0;
  text-align: center;
}
.main p {
  font-size: .20rem;
  font-weight: bold;
  padding: 40px 0 10px;
}
.main span {
  font-size: .12rem;
  color: rgba(51, 51, 51, 0.6);
}
.btnGroup {
  padding: 0 15px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  position: absolute;
  bottom: 15px;
}
</style>