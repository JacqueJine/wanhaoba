<template>
  <div class="set">
    <van-nav-bar title="个人信息" left-arrow @click-left="onClickLeft" />
    <div class="box">
      <van-cell-group style="border-radius:10px;overflow: hidden;">
        <van-cell :border="false">
          <template slot="title" class="fen">
            <span>头像</span>
            <div>
              <el-upload
                class="avatar-uploader"
                :action="url+'root/common/uploadImg.html'"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="user.img" :src="imgurl+user.img" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </template>
        </van-cell>
        <van-field
          v-model="user.user_name"
          label="昵称"
          maxlength="12"
          input-align="right"
          placeholder="请输入"
        />
        <van-cell title="手机号" :value="user.tel"></van-cell>
        <van-field v-model="user.wechat" label="微信号" input-align="right" placeholder="请输入" />
        <van-field
          v-model="user.qq_number"
          type="number"
          label="QQ号"
          input-align="right"
          placeholder="请输入"
        />
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
      // fileList: [{ url: "" }],
      url: this.$global.url,
      imgurl: this.$global.imgUrl,
      user: {
        user_name: "",
        tel: "",
        wechat: "",
        qq_number: "",
        img: ""
      }
    };
  },
  mounted() {
    this.getMemberlist();
  },
  methods: {
    //上传头像图片
    handleAvatarSuccess(res, file) {
      this.user.img = res.src;
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
    },
    submit() {
      this.$axios({
        url: this.$global.url + "api/user/memberUpdate" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          mid: localStorage.getItem("mid"),
          data: {
            user_name: this.user.user_name,
            img: this.user.img,
            qq_number: this.user.qq_number,
            wechat: this.user.wechat
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
    check() {
      let wxreg = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/;
      let qq = /^[1-9]\d{4,9}$/;
      if (!this.user.img) {
        this.$notify({
          message: "请上传头像",
          type: "danger"
        });
        return false;
      } else if (!this.user.user_name) {
        this.$notify({
          message: "昵称不能为空",
          type: "danger"
        });
        return false;
      } else if (!this.user.wechat) {
        this.$notify({
          message: "请输入微信号",
          type: "danger"
        });
        return false;
      } else if (!this.user.qq_number) {
        this.$notify({
          message: "请输入QQ号",
          type: "danger"
        });
        return false;
      }
      this.submit();
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
            // this.fileList[0].url = this.$global.imgUrl + res.data.data.img;
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
  width: 90%;
  position: fixed;
  bottom: 15px;
  left: 15px;
  border-radius: 100px;
  background: #6574ff;
}
input {
  text-align: right;
  border: none;
  outline: none;
}
::-webkit-input-placeholder {
  text-align: right;
}
.van-cell__title {
  display: flex;
  justify-content: space-between;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 0.25rem;
  height: 0.25rem;
  line-height: 0.25rem;
  text-align: center;
}
.avatar {
  width: 0.25rem;
  height: 0.25rem;
  display: block;
}
</style>