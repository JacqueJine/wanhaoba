<template>
  <div class="residue">
    <van-nav-bar
      title="我的糖果"
      left-arrow
      @click-left="onClickLeft"
      right-text="账单"
      @click-right="onClickRight"
    />
    <div class="box">
      <p>
        <span>{{sugar}}</span>
        <span>我的糖果</span>
      </p>
    </div>
    <div class="tishi">
      <p>糖果是什么：</p>
      <p>1：糖果是你出售或出租获得的收益。</p>
      <p>2：糖果可以转为余额，余额可以在本平台进行任意消费。 糖果也可以提现。1糖果=1元</p>
    </div>
    <div class="button">
      <van-button type="default" :block="true" :round="true" @click="toBalance">转余额</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "set",
  data() {
    return {
      sugar: ""
    };
  },
  created() {
    //获取用户详情
    this.$axios({
      url: this.$global.url + "api/user/memberList" + ".html",
      method: "POST",
      data: this.$qs.stringify({
        id: localStorage.getItem("mid")
      })
    })
      .then(res => {
        if (res.data.code == 1) {
          this.sugar = res.data.data.candies;
        } else if (res.data.code == 0) {
          this.sugar = [];
          this.$notify({
            message: "暂无数据！",
            type: "warning",
            duration: 700
          });
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
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1);
    },
    onClickRight() {
      this.$router.push({ path: "/bill", query: { status: 1 } });
    },
    //是否可转余额
    toBalance() {
      this.$router.push({path:'/balance',query:{id:this.sugar}});
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
button:nth-of-type(2) {
  border: 1px solid #696fff;
  color: #696fff;
  margin-top: 25px;
}
</style>