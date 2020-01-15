<template>
  <div class="set">
    <van-nav-bar title="提现账户" left-arrow @click-left="onClickLeft" />
    <div class="box">
      <van-cell-group style="border-radius:10px;overflow: hidden;">
        <van-cell :border="false">
          <template slot="title">
            <span>支付宝账号</span>
            <span>
              <input type="text" v-model="zfb" placeholder="请输入" />
            </span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <div class="box">
      <p class="tishi">我们会根据您提交的支付宝账号进行打款，如有错误，后果自负</p>
    </div>
    <div class="box">
      <van-button type="default" @click="alipay">保存</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "set",
  data() {
    return {
      zfb: ""
    };
  },
  created() {
    //获取用户详情
    this.$axios({
      url: this.$global.url + "api/user/memberList" + ".html",
      method: "POST",
      data: this.$qs.stringify({
        id: this.$global.getToken("mid")
      })
    })
      .then(res => {
        if (res.data.code == 1) {
          this.zfb = res.data.data.alipay;
        }else if (res.data.code == 0) {
            this.zfb = [];
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
    alipay() {
      let phReg = /^[1][3,4,5,7,8][0-9]{9}$/; //手机号码正则
      let emReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/; //邮箱正则
      if (!phReg.test(this.zfb)&&!emReg.test(this.zfb)) {
        this.$notify({
          message: "请输入正确的支付宝账号",
          type: "danger"
        });
        return false;
      }
      this.$axios({
        url: this.$global.url + "api/user/memberUpdate" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          mid: localStorage.getItem('mid'),
          data: {
            alipay: this.zfb
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
.tishi {
  font-size: 0.12rem;
  padding: 0 0.15rem;
  line-height: 0.24rem;
}
</style>