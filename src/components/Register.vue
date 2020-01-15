<template>
  <div class="register">
    <ul>
      <li>
        <p>手机号</p>
        <van-field class="input" v-model="phone" type="number" maxlength="11" placeholder="请输入手机号" />
        <van-row class="code">
          <van-col span="14">
            <van-field class="input" v-model="idNumber" type="number" maxlength="6" placeholder="请输入验证码" />
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
      <li>
        <p>登录密码</p>
        <van-field class="input" type="password" v-model="login_pass" placeholder="请输入登录密码" />
        <p style='margin-top:15px'>确认登录密码</p>
        <van-field class="input" type="password" v-model="login1_pass" placeholder="请再次输入登录密码" />
      </li>
      <li>
        <p>支付密码</p>
        <van-field
          class="input"
          type="password"
          maxlength="6"
          v-model="pay_pass"
          placeholder="请输入6位数字支付密码"
        />
        <p style='margin-top:15px'>确认支付密码</p>
        <van-field
          class="input"
          type="password"
          maxlength="6"
          v-model="pay1_pass"
          placeholder="请再次输入支付密码"
        />
      </li>
    </ul>
    <van-button
      color="linear-gradient(to bottom,rgba(101,116,255,1) 0%,rgba(112,101,255,1) 100%)"
      round
      size="large"
      @click="ti"
    >提交</van-button>
    <van-popup v-model="show">
      <div class="finish">
        <p>注册成功</p>
        <van-button
          color="linear-gradient(to bottom,rgba(101,116,255,1) 0%,rgba(112,101,255,1) 100%)"
          round
          size="large"
          to="/login_regis/login"
        >去登陆</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "register",
  data() {
    return {
      phone: "",
      idNumber: "",
      login_pass: "",
      login1_pass: "",
      pay_pass: "",
      pay1_pass: "",
      show: false,
      disableBtn: false,
      btnNum: 59,
      timer: null
    };
  },
  created() {
    // this.timer=setInterval(this.countDown, 1000);
  },
  methods: {
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
        url: this.$global.url + "api/common/code" + ".html",
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
    ti() {
      if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        this.$notify({
          message: "手机号有误",
          type: "danger"
        });
        return false;
      } else if (this.idNumber == "") {
        this.$notify({
          message: "请输入验证码！",
          type: "danger"
        });
        return false;
      } else if (this.login_pass == "") {
        this.$notify({
          message: "请输入登录密码",
          type: "danger"
        });
        return false;
      } else if (this.login1_pass == "") {
        this.$notify({
          message: "请确认登录密码",
          type: "danger"
        });
        return false;
      } else if (this.login_pass != this.login1_pass) {
        this.$notify({
          message: "两次登录密码不一致！！",
          type: "danger"
        });
        return false;
      } else if (!/^\d{6}$/.test(this.pay_pass)) {
        this.$notify({
          message: "请输入6位数字支付密码",
          type: "danger"
        });
        return false;
      } else if (this.pay1_pass == "") {
        this.$notify({
          message: "请确认支付密码",
          type: "danger"
        });
        return false;
      } else if (this.pay_pass != this.pay1_pass) {
        this.$notify({
          message: "两次支付密码不一致！！",
          type: "danger"
        });
        return false;
      } else if (this.idNumber=='') {
        this.$notify({
          message: "请输入验证码！！",
          type: "danger"
        });
        return false;
      } else {
        this.$axios({
          url: this.$global.url + "api/login/register" + ".html",
          method: "POST",
          data: this.$qs.stringify({
            data: {
              tel: this.phone,
              pwd: this.login_pass,
              pay_pwd: this.pay_pass,
              code: this.idNumber
            }
          })
        })
          .then(res => {
            if (res.data.code == 1) {
              this.$notify({
                message: res.data.msg,
                type: "success"
              });
              this.$global.setToken("mid", res.data.mid);
              localStorage.setItem("role", res.data.shop);
              localStorage.setItem("mess_num", 0);
              this.$router.push({ path: "/index" });
            } else {
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
  }
};
</script>

<style scoped>
.register {
  padding: 0.15rem;
}
ul li {
  padding-bottom: 0.3rem;
}
ul li p {
  font-size: 0.14rem;
  padding: 0 24px 15px;
  font-weight: bold;
}
.input {
  background: rgba(153, 153, 153, 0.2);
  border-radius: 25px;
  font-size: 0.14rem;
}
.code {
  padding-top: 0.15rem;
}
.finish {
  width: 3.25rem;
  height: 1.5rem;
  padding: 0.27rem 0 0.15rem;
  text-align: center;
  box-sizing: border-box;
}
.finish p {
  margin-bottom: 0.47rem;
  font-size: 0.18rem;
}
.finish button {
  width: 1.25rem;
  height: 0.36rem;
  margin: 0 auto;
  line-height: 0.36rem;
}
</style>