<template>
  <div class="residue">
    <van-nav-bar
      title="我的余额"
      left-arrow
      @click-left="onClickLeft"
      right-text="账单"
      @click-right="onClickRight"
    />
    <div class="box">
      <p>
        <span>{{lines}}</span>
        <span>可用余额</span>
      </p>
    </div>
    <div class="tishi">
      <p>余额：</p>
      <!-- <p>1：余额只能用于本平台内消费</p> -->
      <p>余额可提现支付宝</p>
    </div>
    <div class="button">
      <van-button type="default" :block="true" :round="true" to="/withdraw">提现</van-button>
      <van-button type="default" :block="true" :round="true" to="/withDRecord">提现记录</van-button>
      <!-- <van-button type="default" :block="true" :round="true" to="/">充值</van-button> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "set",
  data() {
    return {
      lines: ""
    };
  },
  mounted() {
    this.lines = this.$route.query.lines;
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1);
    },
    onClickRight() {
      this.$router.push({ path: "/bill", query: { status: 0 } });
    }
  }
};
</script>

<style scoped>
.residue {
  width: 100%;
  height: 100%;
}
.van-nav-bar .van-icon {
  color: #333333;
}
.box {
  color: white;
  height: 1.6rem;
  margin: 15px;
  background: url("./../assets/mine/money_bg.png") no-repeat center center;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.box span {
  display: block;
  text-align: center;
}
.box span:nth-of-type(1) {
  font-size: 0.3rem;
  margin-bottom: 5px;
}
.box span:nth-of-type(2) {
  font-size: 0.12rem;
}
.van-nav-bar__text {
  color: #333333;
}
.tishi {
  font-size: 0.12rem;
  padding: 0 25px;
}
.tishi p {
  margin-bottom: 5px;
}
.tishi p:nth-of-type(1) {
  margin-bottom: 10px;
}
.tishi p:nth-of-type(2),
.tishi p:nth-of-type(3) {
  padding-left: 22px;
}
.button {
  padding: 15px;
  margin-top: 48px;
}
button:nth-of-type(1) {
  background: #6574ff;
  color: white;
}
button:nth-of-type(2),button:nth-of-type(3) {
  border: 1px solid #696fff;
  color: #696fff;
  margin-top: 25px;
}
</style>