<template>
  <div class="forget">
    <van-nav-bar title="忘记密码" :border="false" left-arrow @click-left="onClickLeft" />
    <div class="content">
      <ul>
        <li>
          <p>手机号</p>
          <van-field class="input" v-model="phone" placeholder="请输入手机号" />
          <van-row class="code">
            <van-col span="14">
              <van-field class="input" v-model="idNumber" placeholder="请输入验证码" />
            </van-col>
            <van-col span="10" style="text-align:right">
              <van-button
                color="linear-gradient(to bottom,rgba(101,116,255,1) 0%,rgba(112,101,255,1) 100%)"
                @click="getCode()"
                :disabled="disableBtn"
                round
              >{{!disableBtn?'点击获取验证码':btnNum+'后获取'}}</van-button>
            </van-col>
          </van-row>
        </li>
      </ul>
      <van-button
        color="linear-gradient(to bottom,rgba(101,116,255,1) 0%,rgba(112,101,255,1) 100%)"
        round
        size="large"
        @click="toNext"
      >下一步</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "forget",
  data() {
    return {
      phone: "",
      idNumber: "",
      disableBtn: false,
      btnNum: 59,
      timer: null
    };
  },
  mounted() {},
  methods: {
    onClickLeft() {
      this.$router.back(-1);
    },
    countDown() {
      this.btnNum--;
      if (this.btnNum < 0) {
        clearInterval(this.timer);
        this.btnNum = 59;
        this.disableBtn = false;
      }
    },
    getCode() {
      if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        this.$notify({
          message: "请先填写手机号",
          type: "danger"
        });
        return false;
      }
      this.$axios({
        url: this.$global.url + "api/login/exitCode" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          phone: this.phone
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.$notify({
              message: res.data.msg,
              type: "success"
            });
            this.disableBtn = true;
            this.timer = setInterval(this.countDown, 1000);
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
    toNext() {
      // to="/setpass"
      if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        this.$notify({
          message: "请填写正确手机号",
          type: "danger"
        });
        return false;
      } else if (this.idNumber == "") {
        this.$notify({
          message: "验证码不能为空",
          type: "danger"
        });
        return false;
      }
      this.$axios({
        url: this.$global.url + "api/login/verifyCode" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          tel: this.phone,
          code: this.idNumber
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.$router.push({ path: "/setpass", query: { tel: this.phone } });
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

<style scoped>
ul li {
  padding-bottom: 0.67rem;
}
ul li p {
  font-size: 0.14rem;
  padding: 0 24px 15px;
  font-weight: bold;
}

.content {
  padding: 0.15rem;
}
.input {
  background: rgba(153, 153, 153, 0.2);
  border-radius: 25px;
  font-size: 0.14rem;
}
.code {
  padding-top: 0.15rem;
}
</style>