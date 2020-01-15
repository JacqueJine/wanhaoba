<template>
  <div>
    <van-nav-bar title="实名认证" :border="false" left-arrow @click-left="back()" />
    <div class="up">
      <p class="mess">请上传身份证人像面</p>
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
      <van-button
        color="#6574FF"
        style="position:fixed;bottom:.2rem;left:5%;width:90%"
        size="large"
        @click="getToken"
      >确定</van-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imageUrl: "",
      url: this.$global.url,
      img_url: "",
      form: "",
      type: "",
      start_time: "",
      over_time: "",
      name: "",
      identity: ""
    };
  },
  mounted() {
    this.form = this.$route.query.form;
    this.type = this.$route.query.type;
    if (this.$route.query.type == "rent") {
      this.start_time = this.$route.query.start_time;
      this.over_time = this.$route.query.end_time;
    }
  },
  methods: {
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
              this.identity = res.data.data.words_result.公民身份号码.words;
              //上传头像
              this.upGoodsPhot();
            //卖东西
            if (this.type == "sell") {
              this.submit();
            } else if (this.type == "rent") {
              this.submit1();
            } else if (this.type == "sellGift") {
              this.submit2();
            }
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
    back() {
      this.$router.back(-1);
    },
    //出售
    submit() {
      this.form.rent_id = "";
      this.$axios({
        url: this.$global.url + "root/number/addGoods" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: this.form
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.$notify({
              type: "success",
              message: res.data.msg
            });
            this.$router.push({ path: "/numberSuccess" });
          }
        })
        .catch(e => {
          this.$notify({
            message: "网络较差，请稍后重试！",
            type: "danger"
          });
        });
    },
    //出租
    submit1() {
      this.form.price = this.form.buyout_price;
      this.$axios({
        url: this.$global.url + "root/number/addGoods" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: this.form
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            let rend = [
              {
                time_type: 1,
                price: this.form.hour,
                start_time: "",
                end_time: "",
                number_id: res.data.number_ID
              },
              {
                time_type: 2,
                price: this.form.night,
                start_time: this.start_time,
                end_time: this.over_time,
                number_id: res.data.number_ID
              },
              {
                time_type: 3,
                price: this.form.day,
                start_time: "",
                end_time: "",
                number_id: res.data.number_ID
              },
              {
                time_type: 4,
                price: this.form.week,
                start_time: "",
                end_time: "",
                number_id: res.data.number_ID
              }
            ];
            this.$axios({
              url: this.$global.url + "root/number/addRent" + ".html",
              method: "POST",
              data: this.$qs.stringify({
                data: rend
              })
            })
              .then(res => {
                if (res.data.code == 1) {
                  this.$notify({
                    type: "success",
                    message: res.data.msg
                  });
                  this.$router.push({ path: "/numberSuccess" });
                }
              })
              .catch(e => {
                this.$notify({
                  message: "网络较差，请稍后重试！",
                  type: "danger"
                });
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
    //出售礼物
    submit2() {
      this.$axios({
        url: this.$global.url + "root/gift/giftAdd" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: this.form
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.$notify({
              message: res.data.msg,
              type: "success"
            });
            this.$router.push({
              path: "/giftSuccess",
              query: { id: "", title: 2 }
            });
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
            identity: this.identity
          }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.$notify({
              message: res.data.msg,
              type: "success"
            });
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
    }
  }
};
</script>
<style scoped>
.up {
  padding: 0 0.1rem;
}
.mess {
  margin: 0.1rem 0;
  text-align: center;
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