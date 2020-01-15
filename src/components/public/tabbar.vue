<template>
  <van-tabbar v-model="active" route active-color="#696FFF" inactive-color="#999999">
    <van-tabbar-item icon="wap-home" to="/index">首页</van-tabbar-item>
    <van-tabbar-item icon="column" to="/class">分类</van-tabbar-item>
    <van-tabbar-item to="/publish">
      <van-icon name="add" size="38px" />
    </van-tabbar-item>
    <van-tabbar-item replace icon="comment" :dot="show" to="/news">消息</van-tabbar-item>
    <van-tabbar-item replace icon="manager" to="/mine">我的</van-tabbar-item>
  </van-tabbar>
</template>
<script>
export default {
  name: "Tabbar",
  data() {
    return {
      active: 0,
      show: false
    };
  },
  created() {
    this.getAccountLog();
  },
  methods: {
    getAccountLog() {
      this.$axios({
        url: this.$global.url + "api/user/accountLog" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          mid: localStorage.getItem("mid"),
          page: 1,
          limit: 10
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            if (res.data.count > localStorage.getItem("mess_num")) {
              this.show = true;
              if (this.$route.path == "/news") {
                this.show = false;
                localStorage.setItem("mess_num", res.data.count);
              }
            }
          } else if (res.data.code == 0) {
            localStorage.setItem("mess_num", 0);
          } else {
            this.$notify({
              message: res.data.msg,
              type: "danger"
            });
          }
        })
        .catch(e => {
          this.$notify({
            message: "网络较差，请稍后重试！",
            type: "danger"
          });
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>