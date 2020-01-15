<template>
  <div class="forget">
    <van-nav-bar title="忘记密码" :border="false" left-arrow @click-left="onClickLeft" />
    <div class="content">
      <ul>
        <li>
          <p>新密码</p>
          <van-field
            class="input"
            right-icon="eye-o"
            :type="newType"
            @click-right-icon="showPwd(1)"
            v-model="pass"
            placeholder="请输入新密码"
          />
          <van-field
            class="input last"
            right-icon="eye-o"
            :type="pwdType"
            @click-right-icon="showPwd(2)"
            v-model="pass_"
            placeholder="请再次输入新密码"
          />
        </li>
      </ul>
      <van-button
        color="linear-gradient(to bottom,rgba(101,116,255,1) 0%,rgba(112,101,255,1) 100%)"
        round
        size="large"
        @click="setpass"
      >完成</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "forget",
  data() {
    return {
      pass: "",
      pass_: "",
      pwdType: "password",
      newType: "password",
      phone: ""
    };
  },
  mounted() {
    this.phone = this.$route.query.tel;
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1);
    },
    showPwd(index) {
      if (index == 2) {
        if (this.pwdType == "text") {
          this.pwdType = "password";
        } else {
          this.pwdType = "text";
        }
      } else if (index == 1) {
        if (this.newType == "text") {
          this.newType = "password";
        } else {
          this.newType = "text";
        }
      }
    },
    setpass() {
      if (this.pass != this.pass_) {
        this.$notify({
          message: "两次密码不一致！",
          type: "danger"
        });
        return false;
      }
      this.$axios({
        url: this.$global.url + "api/login/editPwd" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          tel: this.phone,
          pwd: this.pass
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            // to=""
            this.$notify({
              message: "重置成功！",
              type: "success"
            });
            this.$router.push({ path: "/login_regis/login" });
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
.last {
  margin-top: 0.15rem;
}
.content {
  padding: 0.15rem;
}
.input {
  background: rgba(153, 153, 153, 0.2);
  border-radius: 25px;
  font-size: 0.14rem;
}
</style>