<template>
  <div class="login">
    <div>
      <ul>
        <li>
          <p>手机号</p>
          <van-field class="input" v-model="phone" maxlength="11" placeholder="请输入手机号" />
        </li>
        <li>
          <p>密码</p>
          <van-field class="input" v-model="password" type="password" placeholder="请输入密码" />
          <p class="forget">
            <router-link to="/forget">忘记密码</router-link>
          </p>
        </li>
      </ul>
      <van-button color="#6574FF" round size="large" @click="login">登录</van-button>
      <van-row class="loginOther" style="line-height:40px;">
        <van-col span="6">第三方登录</van-col>
        <van-col span="18">
          <van-icon size="40" :name="require('../assets/common/weixin.png')" />
          <van-icon
            style="padding-left:0.1rem"
            size="40"
            :name="require('../assets/common/qq.png')"
          />
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      phone: "",
      password: ""
    };
  },
  mounted() {},
  methods: {
    login() {
      if (this.phone == "" || this.password == "") {
        this.$notify({
          message: "用户名或密码不能为空",
          type: "danger"
        });
      } else {
        this.$axios({
          url: this.$global.url + "api/login/login" + ".html",
          method: "POST",
          data: this.$qs.stringify({
            data: {
              user_number: this.phone,
              pwd: this.password
            }
          })
        })
          .then(res => {
            if (res.data.code == 1) {
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
.login > div {
  padding: 15px;
}
ul li {
  padding-bottom: 0.15rem;
}
ul li p {
  font-size: 0.14rem;
  padding: 0.15rem 0.24rem 0.15rem;
}
.input {
  background: rgba(153, 153, 153, 0.2);
  border-radius: 25px;
  font-size: 0.14rem;
}
.forget {
  text-align: right;
  font-size: 0.12rem;
}
a {
  color: #333333;
}
.loginOther {
  margin-top: 1.6rem;
  color: rgba(51, 51, 51, 0.4);
  font-size: 0.14rem;
  width: 100%;
}
</style>