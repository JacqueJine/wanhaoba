<template>
  <div class="news">
    <header>
      <div class="head">
        <van-icon name="checked" color="#F7F7F7" size="60px" />
        <span>支付成功</span>
      </div>
    </header>
    <div class="main">
      <div class="border">
        <p></p>
      </div>
      <div class="info">
        <van-cell-group :border="false">
          <van-cell :border="false">
            <van-row>
              <van-col span="8" class="label alignR">登录方式：</van-col>
              <van-col span="16" class="cellValue">{{data.login_method}}登录</van-col>
            </van-row>
          </van-cell>
          <van-cell v-if="!type" :border="false">
            <van-row>
              <van-col span="8" class="label alignR">下单时间：</van-col>
              <van-col span="16" class="cellValue">{{data.count_down}}</van-col>
            </van-row>
          </van-cell>
          <van-cell v-if="!type" :border="false">
            <van-row>
              <van-col span="8" class="label alignR">开始倒计时：</van-col>
              <van-col span="16" class="cellValue">
                <van-count-down :time="time" format="DD 天 HH 时 mm 分 ss 秒" />
                <i>(赠送5分钟上号时间)</i>
              </van-col>
            </van-row>
          </van-cell>
        </van-cell-group>
        <van-cell-group :border="false" class="account">
          <van-cell class="cell" :border="false">
            <van-row>
              <van-col span="8" class="label">账号：</van-col>
              <van-col span="16" class="cellValue">{{data.account_number}}</van-col>
            </van-row>
          </van-cell>
          <van-cell class="cell" :border="false">
            <van-row>
              <van-col span="8" class="label">密码：</van-col>
              <van-col span="16" class="cellValue">{{data.pwd}}</van-col>
            </van-row>
          </van-cell>
          <van-row class="note">请牢记账号密码或截图保存。也可以在订单详情里找到</van-row>
        </van-cell-group>
      </div>
    </div>
    <van-row class="btnGroup">
      <van-button
        color="linear-gradient(to bottom,rgba(101,116,255,1) 0%,rgba(112,101,255,1) 100%)"
        round
        size="large"
        to="/index"
      >返回首页</van-button>
    </van-row>
  </div>
</template>
<script>
export default {
  name: "paySuccess",
  data() {
    return {
      data: {},
      time:'',
      type:0
    };
  },
  created() {
    this.type=this.$route.query.id
    this.data = JSON.parse(localStorage.getItem("pay"));
    this.time=this.data.start_time
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.news {
  width: 100%;
  height: 100vh;
  background: rgba(245, 245, 245, 1);
}
header {
  height: 2.30rem;
  background: linear-gradient(
    90deg,
    rgba(93, 128, 246, 1) 0%,
    rgba(98, 88, 238, 1) 100%
  );
  display: flex;
  position: relative;
  justify-content: center;
}
.head {
  display: flex;
  align-items: center;
  color: #f7f7f7;
}
.head span {
  font-size: 20px;
  padding-left: 15px;
}
.border {
  padding: 0 15px;
}
.border p {
  width: 100%;
  height: 16px;
  background: rgba(41, 36, 176, 1);
  border-radius: 8px;
}
.info {
  padding: 0 20px;
  margin-top: -8px;
}
.main {
  position: absolute;
  top: 1.68rem;
  width: 100%;
}
.label {
  color: rgba(51, 51, 51, 0.4);
}
.alignR {
  text-align: right;
}
.cellValue i {
  font-size: 12px;
  font-style: normal;
  color: rgba(51, 51, 51, 0.6);
}
.account {
  padding: .25rem .15rem .15rem;
  border-radius: 0 0 10px 10px;
  box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.1);
}
.cell {
  background: rgba(51, 51, 51, 0.1);
  border-radius: 25px;
  margin-bottom: .15rem;
}
.note {
  text-align: center;
  font-size: 12px;
  color: #999;
  transform: scale(0.9);
}
.btnGroup {
  padding: 0 15px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  position: absolute;
  bottom: 15px;
}
.btnGroup p {
  margin-bottom: 30px;
}
</style>