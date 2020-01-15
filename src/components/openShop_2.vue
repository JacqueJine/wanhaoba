<template>
  <div class="news">
    <van-nav-bar left-arrow :border="false" @click-left="back()"></van-nav-bar>
    <div class="main">
      <p class="title">请上传身份证人像面</p>
      <ul>
        <!-- <li>
          <p>真实姓名</p>
          <van-field
            class="input"
            v-model="name"
            maxlength="8"
            @blur="check()"
            placeholder="请输入2-4位中文姓名"
          />
        </li>
        <li>
          <p>居民身份证号</p>
          <van-field
            class="input"
            v-model="identity_number"
            maxlength="18"
            @blur="check()"
            placeholder="请输入正确的身份证号"
          />
        </li>-->
        <el-upload
          class="avatar-uploader"
          :action="url+'root/common/uploadImg.html'"
          :show-file-list="false"
          :on-success="upImgSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <p class="mess" style="font-size:.12rem;color:#AAA">提示：最短边至少15px，最长边最大4096px</p>
      </ul>
      <div class="text">
        <p>1： 按国家政策要求，游戏玩家需要先进行实名认证 ，再进行游戏相关交易。</p>
        <p>2： 为了您顺畅的租号体验，请您尽快填写下方的身份信息。平台会对您填写的信息严格保密。</p>
      </div>
    </div>
    <van-row class="btnGroup">
      <van-button
        color="linear-gradient(to bottom,rgba(101,116,255,1) 0%,rgba(112,101,255,1) 100%)"
        round
        size="large"
        @click="getToken"
      >提交</van-button>
    </van-row>
    <van-dialog v-model="showPay" :show-confirm-button="false" style="padding:15px;width:80%">
      <div class="payTitle">
        <van-icon name="cross" @click="payBox()" class="close" />选择支付方式
      </div>
      <p class="num">
        ￥
        <span>{{total}}</span>
      </p>
      <van-radio-group v-model="payType" :border="false">
        <van-cell-group :border="false">
          <van-cell :border="false" clickable @click="payType = 2">
            <div slot="title" class="payType">
              <van-icon name="alipay" size=".18rem" class="iconMg" color="#108EE9" />支付宝支付
            </div>
            <van-radio slot="right-icon" :name="2" />
          </van-cell>
          <van-cell :border="false" clickable @click="payType = 1">
            <div slot="title" class="payType">
              <van-icon name="wechat" size=".18rem" class="iconMg" color="#41B035" />微信支付
            </div>
            <van-radio slot="right-icon" :name="1" />
          </van-cell>
          <van-cell :border="false" clickable @click="payType = 0">
            <div slot="title" class="payType">
              <van-icon name="gold-coin" size=".18rem" class="iconMg" color="#FFA700" />
              余额支付(￥{{lines}})
            </div>
            <van-radio slot="right-icon" :disabled="Math.floor(lines)<total" :name="0" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <van-button
        round
        style="width:100%;margin-top:15px"
        color="linear-gradient(to bottom, #6574FF, #7065FF)"
        @click="show=true"
      >确定</van-button>
    </van-dialog>
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
  </div>
</template>
<script>
export default {
  name: "openShop_1",
  data() {
    return {
      name: "",
      identity_number: "",
      disabled: true,
      showPay: false,
      show: false,
      loading: false,
      showKeyboard: true,
      payPwd: "",
      payType: 0,
      lines: 0,
      total: 0,
      imageUrl: "",
      url: this.$global.url,
      img_url: ""
    };
  },
  created() {
    let obj = JSON.parse(localStorage.getItem("data"));
    this.total = obj.quality;
    this.$axios({
      url: this.$global.url + "api/user/memberList" + ".html",
      method: "POST",
      data: this.$qs.stringify({
        id: localStorage.getItem("mid")
      })
    })
      .then(res => {
        if (res.data.code == 1) {
          this.lines = res.data.data.lines;
        } else {
          this.$notify({
            message: res.data.msg,
            type: "danger"
          });
        }
      })
      .catch(e => {
        this.$notify({
          message: "网络较差，请稍后重试",
          type: "danger"
        });
      });
  },
  methods: {
    //身份证上传
    upImgSuccess(res, file) {
      this.imageUrl = this.$global.imgUrl + res.src;
      this.img_url = res.src;
    },
    getToken() {
      // console.log(this.base);
      //限制图片宽高
      // 创建对象
      var img = new Image();

      // 改变图片的src
      img.src = this.imageUrl;

      // 判断是否有缓存
      if (img.complete) {
        // 打印
        // console.log(
        //   "from:complete : width:" + img.width + ",height:" + img.height
        // );
        if (img.width < 15 || img.height > 4096) {
          this.$notify({
            message: "图片尺寸不对，请重新上传！！",
            type: "danger"
          });
          return false;
        }
      } else {
        // 加载完成执行
        img.onload = function() {
          // 打印
          // console.log(
          //   "from:onload : width:" + img.width + ",height:" + img.height
          // );
          if (img.width < 15 || img.height > 4096) {
            this.$notify({
              message: "图片尺寸不对，请重新上传！！",
              type: "danger"
            });
            return false;
          }
        };
      }
      if (this.img_url == "") {
        this.$notify({
          message: "请上传身份证！",
          type: "danger"
        });
        return false;
      }
      this.$axios({
        url: this.$global.url + "api/common/account" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          img: this.img_url
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.$notify({
              message: res.data.msg,
              type: "success"
            });
            this.name = res.data.data.words_result.姓名.words;
            this.identity_number =
              res.data.data.words_result.公民身份号码.words;
            //上传头像
            this.upGoodsPhot();
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
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    //认证成功上传图片root/number/goodsPhot
    upGoodsPhot() {
      this.$axios({
        url: this.$global.url + "root/number/goodsPhot" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            mid: this.$global.getToken("mid"),
            img: this.img_url,
            name: this.name,
            identity: this.identity_number
          }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.$notify({
              message: res.data.msg,
              type: "success"
            });
            this.show=!this.show;
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
            message: "服务器错误",
            type: "danger"
          });
        });
    },
    //密码输入事件
    onInput(key) {
      this.payPwd = (this.payPwd + key).slice(0, 6);
      if (this.payPwd.length == 6) {
        this.show = false;
        this.loading = true;
        this.goOpenShop_2();
      }
    },
    payBox() {
      this.showPay = !this.showPay;
    },
    //删除密码
    onDelete() {
      this.payPwd = this.payPwd.slice(0, this.payPwd.length - 1);
    },
    check() {
      let regName = /^[\u4e00-\u9fa5]{2,8}$/;
      let regId = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
      this.disabled = true;
      if (!regName.test(this.name)) {
        this.$notify({
          message: "请输入2-4位中文姓名",
          type: "danger"
        });
        return false;
      } else if (!regId.test(this.identity_number)) {
        this.$notify({
          message: "请输入正确的身份证号",
          type: "danger"
        });
        return false;
      }
      this.disabled = false;
    },
    back() {
      this.$router.back(-1);
    },
    goOpenShop_2() {
      // let obj = {
      //   name: this.name,
      //   identity_number: this.identity_number
      // };
      // localStorage.setItem("data", JSON.stringify(obj));
      let obj = JSON.parse(localStorage.getItem("data"));
      obj.name = this.name;
      obj.identity_number = this.identity_number;
      obj.pay_pwd = this.payPwd;
      this.$axios({
        url: this.$global.url + "api/merch/addMerch" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: obj
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            localStorage.removeItem("data");
            this.$notify({
              message: res.data.msg,
              type: "success"
            });
            this.$router.push({ path: "/openShop_3" });
          } else {
            this.$notify({
              message: res.data.msg,
              type: "danger"
            });
            this.loading = false;
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.news {
  width: 100%;
  height: 100vh;
}
.main {
  padding: 10px 15px;
}
.title {
  font-size: 0.2rem;
  font-weight: 500;
  padding-bottom: 50px;
  font-weight: bold;
}
.main ul li {
  padding-bottom: 30px;
}
.main ul li p {
  font-size: 0.14rem;
  padding: 0 24px 15px;
  font-weight: bold;
}
.input {
  background: rgba(153, 153, 153, 0.2);
  border-radius: 25px;
  font-size: 0.14rem;
}
.btnGroup {
  padding: 0 15px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  position: absolute;
  bottom: 15px;
}
.text {
  font-size: 0.12rem;
  line-height: 0.17rem;
}
.payTitle {
  text-align: center;
  position: relative;
}
.close {
  position: absolute;
  top: 0;
  left: 0;
  line-height: 0.2rem;
}
.num {
  text-align: center;
  font-size: 0.22rem;
  font-weight: bold;
  padding: 15px 0;
}
.num span {
  font-size: 0.48rem;
}
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  width: 2.87rem;
  height: 1.78rem;
  margin: 0 auto;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 2.87rem;
  height: 1.78rem;
  line-height: 1.78rem;
  text-align: center;
}
.avatar {
  width: 2.87rem;
  height: 1.78rem;
  display: block;
}
</style>