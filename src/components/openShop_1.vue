<template>
  <div class="news">
    <van-nav-bar left-arrow :border="false" fixed @click-left="back()"></van-nav-bar>
    <div class="main">
      <p class="title">请完善您的店铺信息</p>
      <ul>
        <li style="text-align:center">
          <el-upload
            class="avatar-uploader"
            :action="url+'root/common/uploadImg.html'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="img" :src="imgurl+img" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="logo">添加店铺LOGO</p>
        </li>
        <li>
          <p>店铺名</p>
          <van-field class="input" v-model="title" maxlength="8" placeholder="请输入店铺名（最多8个字）" />
        </li>
        <li>
          <p>主营项目</p>
          <van-field class="input" v-model="category" placeholder="店铺经营类目" />
        </li>
        <li>
          <p>手机号认证</p>
          <van-field class="input" v-model="tel" maxlength="11" type="number" placeholder="请输入手机号" />
          <van-row class="code">
            <van-col span="14">
              <van-field
                class="input"
                type="number"
                maxlength="6"
                v-model="idNumber"
                placeholder="请输入验证码"
              />
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
          <p>质保金</p>
          <van-cell class="input" :title="quality" is-link @click="show=true" />
        </li>
      </ul>
    </div>
    <van-row class="btnGroup">
      <div class="text">
        <van-checkbox v-model="checked" @change="check">
          已阅读并同意
          <router-link to>《申请店铺开通协议》</router-link>
        </van-checkbox>
      </div>
      <van-button
        color="linear-gradient(to bottom,rgba(101,116,255,1) 0%,rgba(112,101,255,1) 100%)"
        round
        size="large"
        @click="check"
      >下一步</van-button>
    </van-row>
    <van-popup v-model="show" round position="bottom">
      <van-picker
        show-toolbar
        :default-index="0"
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>
<script>
export default {
  name: "openShop_2",
  data() {
    return {
      imgurl: this.$global.imgUrl,
      title: "",
      tel: "",
      show: false,
      category: "",
      quality: 1000,
      checked: true,
      disabled: true,
      img: "",
      columns: [1000, 2000, 3000, 4000, 5000],
      level_id: 1,
      url: this.$global.url,
      disableBtn: false,
      btnNum: 59,
      timer: null,
      idNumber: ""
    };
  },
  mounted() {
    document.getElementsByClassName("el-upload")[0].style.cssText =
      "background: rgba(216, 216, 216, 1);border-radius:50%";
  },
  methods: {
    onConfirm(value, index) {
      this.quality = value;
      this.level_id = index + 1;
      this.show = false;
    },
    onCancel() {
      this.show = false;
    },
    //倒计时
    countDown() {
      this.btnNum--;
      if (this.btnNum < 0) {
        clearInterval(this.timer);
        this.btnNum = 59;
        this.disableBtn = false;
      }
    },
    getCode() {
      if (!/^1[3456789]\d{9}$/.test(this.tel)) {
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
          phone: this.tel
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
    // 下一步
    check() {
      let regTel = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
      this.disabled = true;
      if (!this.img.length > 0) {
        this.$notify({
          message: "请上传店铺logo",
          type: "danger"
        });
        return false;
      } else if (!this.title) {
        this.$notify({
          message: "请输入店铺名称",
          type: "danger"
        });
        return false;
      } else if (!regTel.test(this.tel)) {
        this.$notify({
          message: "请输入正确的手机号",
          type: "danger"
        });
        return false;
      } else if (!this.idNumber) {
        this.$notify({
          message: "请输入验证码",
          type: "danger"
        });
        return false;
      } else if (!this.checked) {
        this.$notify({
          message: "请勾选申请店铺开通协议",
          type: "danger"
        });
        return false;
      } else if (this.idNumber) {
        this.$axios({
          url: this.$global.url + "api/login/verifyCode" + ".html",
          method: "POST",
          data: this.$qs.stringify({
            tel: this.tel,
            code: this.idNumber
          })
        })
          .then(res => {
            if (res.data.code == 1) {
              let obj = {
                mid: localStorage.getItem("mid"),
                logo: this.img,
                title: this.title,
                tel: this.tel,
                quality: this.quality,
                level_id: this.level_id,
                category: this.category,
                code: this.idNumber
              };
              localStorage.setItem("data", JSON.stringify(obj));
              this.$router.push({ path: "/openShop_2" });
            } else {
              this.$notify({
                message: res.data.msg,
                type: "danger"
              });
              return false;
            }
          })
          .catch(e => {
            this.$notify({
              message: "网络较差，请稍后重试！",
              type: "danger"
            });
            return false;
          });
      }
      this.disabled = false;
    },
    back() {
      this.$router.back(-1);
    },
    //上传头像图片
    handleAvatarSuccess(res, file) {
      this.img = res.src;
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$notify({
          message: "上传头像图片大小不能超过 2MB!",
          type: "danger"
        });
      }
      return isLt2M;
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
  padding: 50px 15px;
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
.code {
  padding-top: 15px;
}
.btnGroup {
  padding: 0 15px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 15px;
}
.text {
  font-size: 0.14rem;
  line-height: 0.2rem;
  padding: 5px 12px;
}
.text a {
  color: #108ee9;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px !important;
  position: relative;
  overflow: hidden;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #666666;
  width: 0.7rem;
  height: 0.7rem;
  line-height: 0.7rem;
  text-align: center;
}
.avatar {
  width: 0.7rem;
  height: 0.7rem;
  display: block;
}
/* .upload {
  width: 0.7rem;
  height: 0.7rem;
  background: rgba(216, 216, 216, 1);
  border-radius: 50%;
  vertical-align: middle;
  display: table-cell;
} */
/* .main ul .logo {
  padding-top: 10px;
  font-size: 0.14rem;
  color: #666666;
} */
</style>