<template>
  <div class="set">
    <van-nav-bar title="设置" left-arrow @click-left="onClickLeft" />
    <div class="box">
      <van-cell-group style="border-radius:10px;overflow: hidden;">
        <van-cell title="个人信息" to="/message" :border="false" is-link></van-cell>
        <van-cell title="修改登录密码" to="clpassword" :border="false" is-link></van-cell>
        <van-cell title="修改支付密码" to="cppassword" :border="false" is-link></van-cell>
      </van-cell-group>
    </div>
    <div class="box">
      <van-cell-group style="border-radius:10px;overflow: hidden;">
        <van-cell title="实名认证" to="/rname" is-link :border="false" :value="user.identity==null || user.name==null?'未绑定':'已绑定'"></van-cell>
        <van-cell title="提现账户" to="/caccount" is-link :border="false" :value="user.alipay"></van-cell>
      </van-cell-group>
    </div>
    <div class="box">
      <van-cell-group style="border-radius:10px;overflow: hidden;">
        <van-cell class="xinyu" title="信誉分" :value="user.credit">
          <van-icon
            slot="right-icon"
            name="warning"
            class="icon"
            color="rgb(152, 150, 150)"
            style="line-height: inherit;"
          />
        </van-cell>
      </van-cell-group>
    </div>
    <div class="box">
      <van-button type="default" to="/login_regis/login">退出登录</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "set",
  data() {
    return {
      user: ""
    };
  },
  mounted() {
    this.getMemberlist();
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1);
    },
    //获取用户详情
    getMemberlist() {
      this.$axios({
        url: this.$global.url + "api/user/memberList" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          id: localStorage.getItem('mid')
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.user = res.data.data;
          } else if (res.data.code == 0) {
            this.user = [];
            this.$notify({
              message: "暂无数据！",
              type: "warning",
              duration: 700
            });
          }else {
            this.$notify({
              message: res.data.msg,
              type: "danger"
            });
          }
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            message: "网络较差，请稍后重试！",
            type: "danger"
          });
        });
    }
  }
};
</script>

<style scoped>
.set {
  width: 100%;
  height: 100vh;
  background: rgba(245, 245, 245, 1);
}
.van-nav-bar .van-icon {
  color: #333333;
}
.box {
  padding: 15px;
  padding-bottom: 0;
  border-radius: 10px;
}
.xinyu {
  position: relative;
}
.icon {
  position: absolute;
  left: 60px;
}
.van-cell__value {
  color: #333333;
}
.tixian {
  flex: 0.5;
}
.van-button--default {
  color: #ff3131;
}
.van-button {
  width: 90%;
  position: fixed;
  bottom: 15px;
  left: 15px;
}
</style>