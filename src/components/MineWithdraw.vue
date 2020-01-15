<template>
  <div class="balance">
    <van-nav-bar title="提现" left-arrow @click-left="onClickLeft" />
    <div class="content">
      <p class="dao">
        <span>提现到支付宝：</span>
        <span>{{alipay}}</span>
      </p>
      <p class="input">
        <input type="number" v-model="sugar" placeholder="请输入提现金额" />
      </p>
      <p class="text">
        余额：{{candies}}
        <span @click="sugar=candies">全部转换</span>
      </p>
      <p class="text" style="color:#ccc">提现后需审核，预计5个工作日内到账</p>
      <p class="button">
        <van-button type="default" :block="true" :round="true" @click="showPopup">确定提现</van-button>
      </p>
    </div>
    <van-popup
      closeable
      position="bottom"
      :close-on-click-overlay="false"
      :style="{ height: '360px' }"
      v-model="show"
    >
      <div style="height:50px;padding-top:45px">
        <van-password-input
          style="width:100%"
          :value="payPwd"
          info="支付密码为 6 位数字"
          :focused="showKeyboard"
          @focus="showKeyboard = true"
        />
      </div>
      <van-number-keyboard :show="showKeyboard" @input="onInput" @delete="onDelete" />
    </van-popup>
    <van-popup v-model="loading" :close-on-click-overlay="false" style="background:transparent">
      <van-loading size="24px" type="spinner" vertical></van-loading>
    </van-popup>
    <van-popup v-model="show1">
      <div class="popup1">
        <p>转换成功</p>
        <p>
          <van-button type="default" :block="true" :round="true" to="/residue">确定</van-button>
        </p>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "balance",
  data() {
    return {
      payPwd: "",
      showKeyboard: true,
      candies: 0,
      sugar: "",
      loading: false,
      show: false,
      show1: false,
      alipay: ""
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
          this.candies = res.data.data.lines;
          this.alipay = res.data.data.alipay;
        } else if (res.data.code == 0) {
          this.candies = [];
          this.alipay = [];
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
    //密码输入事件
    onInput(key) {
      this.payPwd = (this.payPwd + key).slice(0, 6);
      if (this.payPwd.length == 6) {
        this.show = false;
        this.loading = true;
        this.$axios({
          url: this.$global.url + "api/user/createWithdraw" + ".html",
          method: "POST",
          data: this.$qs.stringify({
            data: {
              mid: localStorage.getItem("mid"),
              pay_pwd: this.payPwd,
              lines: this.sugar
            }
          })
        })
          .then(res => {
            this.loading = false;
            if (res.data.code == 1) {
              this.$notify({
                message: res.data.msg,
                type: "success"
              });
              this.$router.push('/mine');
            } else {
              this.payPwd = "";
              this.$notify({
                message: res.data.msg,
                type: "danger"
              });
            }
          })
          .catch(e => {
            this.loading = false;
            this.payPwd = "";
            this.$notify({
              message: "网络较差，请稍后重试！",
              type: "danger"
            });
          });
      }
    },
    //删除密码
    onDelete() {
      this.payPwd = this.payPwd.slice(0, this.payPwd.length - 1);
    },
    onClickLeft() {
      this.$router.back(-1);
    },
    //支付密码弹框
    showPopup() {
      let reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
      //判断是否有支付宝账户
      if (this.alipay == null) {
        this.$notify({
          message: "请进入个人中心填写支付宝账户！",
          type: "danger"
        });
        return false;
      }
      if (!this.sugar || !reg.test(this.sugar)) {
        this.$notify({
          message: "请输入正确的金额",
          type: "danger"
        });
        return false;
      } else if (Math.floor(this.sugar) > this.candies) {
        this.$notify({
          message: "转换金额不能大于余额",
          type: "danger"
        });
        return false;
      }
      this.show = true;
    },
    showPopup1() {
      this.show = false;
      this.show1 = true;
    }
  }
};
</script>

<style scoped>
.balance {
  width: 100%;
  height: 100%;
}
.van-nav-bar .van-icon {
  color: #333333;
}
.content {
  overflow: hidden;
}
.input {
  text-align: center;
  margin: 0.75rem 0 0.68rem;
}
.input input {
  border: none;
  outline: none;
  font-size: 0.3rem;
  width: 2.13rem;
}
.text {
  margin: 0 0 5px 30px;
  font-size: 0.12rem;
}
.text span {
  color: #696fff;
}
.button {
  padding: 0.15rem;
}
.dao {
  padding: 0.2rem 0.15rem 0.15rem;
  display: flex;
  justify-content: space-between;
}
.button button {
  color: white;
  background: #6574ff;
  font-size: 0.18rem;
}
button .little {
  font-size: 0.12rem;
}
.popup {
  padding: 0.15rem 0.1rem;
  width: 3.25rem;
  height: 2.34rem;
  box-sizing: border-box;
}
.popup > p:nth-of-type(1) {
  font-size: 0.18rem;
  text-align: center;
  margin: 12px 0 30px;
}

.popup .p_input {
  display: flex;
  justify-content: space-between;
}
.popup .p_input > input {
  width: 0.44rem;
  height: 0.51rem;
  border: none;
  outline: none;
  background: #d8d8d8;
  text-align: center;
}
.popup button {
  height: 0.36rem;
  margin-top: 0.5rem;
  line-height: 0.36rem;
  background: #696fff;
  color: white;
}
.popup1 {
  padding: 0.27rem 0 0.15rem;
  width: 3.25rem;
  height: 1.5rem;
  box-sizing: border-box;
}
.popup1 p {
  text-align: center;
}
.popup1 p:nth-of-type(1) {
  font-size: 0.18rem;
}
.popup1 button {
  height: 0.36rem;
  line-height: 0.36rem;
  background: #696fff;
  color: white;
  width: 1.25rem;
  display: inline-block;
  margin-top: 0.47rem;
}
</style>