<template>
  <div class="set">
    <van-nav-bar title="实名认证" left-arrow @click-left="onClickLeft" />
    <div class="box">
      <van-cell-group style="border-radius:10px;overflow: hidden;">
        <van-cell :border="false">
          <template slot="title">
            <span>真实姓名</span>
            <span>
              <input type="text" maxlength="4" placeholder="请输入" v-model="user.name" />
            </span>
          </template>
        </van-cell>
        <van-cell :border="false">
          <template slot="title">
            <span>身份证号码</span>
            <span>
              <input type="text" maxlength="18" placeholder="请输入" v-model="user.identity" />
            </span>
          </template>
        </van-cell>
        <van-cell :border="false">
          <template slot="title">
            <span>身份证</span>
            <span>{{this.user.goods_phot==null?"无":''}}</span>
            <van-image
              width="100"
              height="100"
              :src="this.imgUrl+this.user.goods_phot"
              v-if="this.user.goods_phot!=null"
            />
            <!-- </span> -->
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <div class="box">
      <!-- to="/set" -->
      <van-button type="default" @click="save">保存</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "set",
  data() {
    return {
      user: {},
      identity: "",
      imgUrl: this.$global.imgUrl
    };
  },
  mounted() {
    this.getMemberlist();
  },
  watch: {
    identity(val, oldVal) {
      console.log(val, oldVal);
    }
  },
  methods: {
    plusXing(str, frontLen, endLen) {
      let len = str.length - frontLen - endLen;
      let xing = "";
      for (var i = 0; i < len; i++) {
        xing += "*";
      }
      return (
        str.substring(0, frontLen) + xing + str.substring(str.length - endLen)
      );
    },
    onClickLeft() {
      this.$router.back(-1);
    },
    //获取用户详情
    getMemberlist() {
      this.$axios({
        url: this.$global.url + "api/user/memberList" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          id: this.$global.getToken("mid")
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.user = res.data.data;
            // this.identity = res.data.data.identity;
            // this.identity=this.plusXing(this.identity, 3, 4)
          } else if (res.data.code == 0) {
            this.user = [];
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
    //保存
    save() {
      let reg1 = /^[\u4e00-\u9fa5]*$/;
      var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
      if (
        !reg1.test(this.user.name) ||
        this.user.name.length > 4 ||
        this.user.name.length < 2
      ) {
        this.$notify({
          message: "名字必须位2-4位的中文",
          type: "danger"
        });
        return false;
      } else if (!regIdCard.test(this.user.identity)) {
        this.$notify({
          message: "身份证号不正确",
          type: "danger"
        });
        return false;
      } else {
        this.$axios({
          url: this.$global.url + "api/user/memberUpdate" + ".html",
          method: "POST",
          data: this.$qs.stringify({
            mid: localStorage.getItem("mid"),
            data: {
              name: this.user.name,
              identity: this.user.identity
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