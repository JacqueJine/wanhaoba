<template>
  <div class="set">
    <van-nav-bar title="修改支付密码" left-arrow @click-left="onClickLeft" />
    <div class="box">
      <van-cell-group style="border-radius:10px;overflow: hidden;">
        <van-field v-model="oldpwd" :type="oldType" label="旧密码" input-align="right" right-icon="eye-o" maxlength="6" @click-right-icon="showPwd(1)" placeholder="请输入旧密码" />
        <van-field v-model="newpwd" :type="newType" label="新密码" input-align="right" right-icon="eye-o" maxlength="6" @click-right-icon="showPwd(2)" placeholder="请输入新密码" />
        <van-field v-model="pwd" :type="pwdType" label="确认密码" input-align="right" right-icon="eye-o" maxlength="6" @click-right-icon="showPwd(3)" placeholder="请输入再次输入新密码" />
      </van-cell-group>
    </div>
    <div class="box">
      <van-button type="default" @click="check">保存</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "set",
  data() {
    return {
      oldpwd: "",
      newpwd: "",
      pwd: "",
      oldType:'password',
      newType:'password',
      pwdType:'password',
    };
  },
  mounted() {
    // //获取用户详情
    // this.$axios({
    //   url: this.$global.url + "api/user/memberList" + ".html",
    //   method: "POST",
    //   data: this.$qs.stringify({
    //     id: 1
    //   })
    // })
    //   .then(res => {
    //     if (res.data.code == 1) {
    //       this.oldpwd = res.data.data.pay_pwd;
    //     } else {
    //       this.$notify({
    //         message: res.data.msg,
    //         type: "danger"
    //       });
    //     }
    //   })
    //   .catch(e => {
    //     this.$notify({
    //       message: "网络较差，请稍后重试！",
    //       type: "danger"
    //     });
    //   });
  },
  methods: {
    submit(){
      this.$axios({
          url: this.$global.url + "api/user/memberUpdate" + ".html",
          method: "POST",
          data: this.$qs.stringify({
            mid: localStorage.getItem('mid'),
            data: {
              worn_pay_pwd: this.oldpwd,
              pay_pwd: this.newpwd
            }
          })
        })
          .then(res => {
            if (res.data.code == 1) {
              this.$notify({
                message: res.data.msg,
                type: "success"
              });
              this.$router.back(-1);
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
    check(){
      let reg=/^\d{6}$/
      if(this.newpwd!=this.pwd){
        this.$notify({
          message: "新密码两次输入不一致",
          type: "danger"
        });
        return false
      }else if(!reg.test(this.newpwd)){
        this.$notify({
          message: "支付密码只能为数字",
          type: "danger"
        });
        return false
      }
      this.submit()
    },
    showPwd(index){
      if(index==1){
        if(this.oldType=='text'){
          this.oldType='password'
        }else{
          this.oldType='text'
        }
      }else if(index==2){
        if(this.newType=='text'){
          this.newType='password'
        }else{
          this.newType='text'
        }
      }else if(index==3){
        if(this.pwdType=='text'){
          this.pwdType='password'
        }else{
          this.pwdType='text'
        }
      }
    },
    onClickLeft() {
      this.$router.back(-1);
    }
  }
};
</script>

<style scoped>
.set {
  width: 100%;
  min-height: 100vh;
  background: rgba(245, 245, 245, 1);
}
.van-nav-bar .van-icon {
  color: #333333;
}
.box {
  padding: 15px;
  padding-bottom: 0;
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
  color: white;
}
.van-button {
  width: 100%;
  margin-top: 78px;
  border-radius: 100px;
  background: #6574ff;
}
input {
  text-align: right;
  border: none;
  outline: none;
  width: 1.4rem;
}
::-webkit-input-placeholder {
  text-align: right;
}
.van-cell__title {
  display: flex;
  justify-content: space-between;
}
</style>