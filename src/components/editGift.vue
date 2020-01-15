<template>
  <div class="bgColor">
    <div class="header">
      <van-nav-bar :border="false" title="我要出售" left-arrow @click-left="back()">
        <!-- <van-icon slot="right" name="question-o" color="#444444" /> -->
      </van-nav-bar>
    </div>
    <div class="main">
      <van-cell-group class="cellGroup">
        <van-cell title="礼物分类" is-link :value="gift_class" @click="classPicker(1)" />
        <van-cell title="礼物名称" is-link :value="gift_name" @click="classPicker(2)" />
        <van-uploader
          v-model="fileList"
          class="imgList"
          :max-count="8"
          preview-size=".54rem"
          :after-read="afterRead"
          @delete="delImg"
          multiple
        />
      </van-cell-group>
      <p class="title paddingB10">购买信息</p>
      <van-cell-group class="cellGroup">
        <van-field
          v-model="form.price"
          type="number"
          label="出售价格："
          input-align="right"
          placeholder="请输入价格（元）"
        />
        <van-field label="出售数量：" input-align="right">
          <template slot="input">
            <van-stepper v-model="form.gift_number" />
          </template>
        </van-field>
        <van-field
          v-model="form.tel"
          label="联系方式"
          input-align="right"
          type="number"
          maxlength="11"
          placeholder="请输入常用手机号"
        />
      </van-cell-group>
      <!-- <p class="zhu">注：普通用户需向平台交总金额的1%。</p> -->
      <p class="groupTitle">
        <van-checkbox v-model="checked" checked-color="#108EE9">
          已阅读并同意
          <router-link to="#">《玩号吧服务协议》</router-link>
        </van-checkbox>
      </p>
      <van-button
        color="linear-gradient(to bottom,rgba(101,116,255,1) 0%,rgba(112,101,255,1) 100%)"
        round
        size="large"
        @click="addgift"
      >提交</van-button>
    </div>
    <!-- 礼物分类列表 -->
    <van-popup v-model="classShow" round position="bottom" :style="{ height: '50%' }">
      <van-picker
        show-toolbar
        cancel-button-text="取消"
        confirm-button-text
        @cancel="classShow=false"
        @confirm="changePicker"
        :columns="classList.name"
      ></van-picker>
    </van-popup>
    <van-dialog
      v-model="addshow"
      title="添加"
      show-cancel-button
      show-confirm-button
      @confirm="add()"
    >
      <van-field v-model="varname" maxlength="8" label="名称" placeholder="请输入名称" />
    </van-dialog>
    <!-- 支付 -->
    <van-dialog v-model="showPay" :show-confirm-button="false" style="padding:15px;">
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
        @click="showPopup"
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
  name: "sellGift",
  data() {
    return {
      value: "",
      checked: true,
      fileList: [],
      varname: "", //添加输入名称
      gift_class: "请选择",
      gift_name: "请选择",
      form: {
        mid: "",
        class_id: "",
        name_id: "",
        id: "",
        img: [],
        price: "",
        gift_number: 1,
        tel: "",
        goods_cash: 0
      },
      addshow: false, //添加弹窗
      addType: 1, //当前添加弹框类型 1添加礼物分类 2添加礼物名称,
      classShow: false, //礼物分类选框
      classList: {},
      // 支付参数
      showPay: false,
      total: "",
      payType: 0,
      lines: "",
      payPwd: "",
      showKeyboard: true,
      loading: false,
      show: false,
      onegoods: 0,
      gift: "",
      imgUrl: this.$global.imgUrl
    };
  },
  mounted() {
    this.form.mid = localStorage.getItem("mid");
    this.getGift();
    //获取余额
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
          this.onegoods = res.data.data.one_goods;
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
    setTimeout(() => {
      console.log(this.gift);
      this.form.id=this.gift.id,
      this.form.mid = this.gift.sell_mid;
      this.form.price = this.gift.price;
      this.form.gift_number = this.gift.gift_number;
      this.form.tel = this.gift.tel;
      this.form.goods_cash = this.gift.goods_cash;
      this.form.img=this.gift.img;
      //图片
      for (let i = 0; i < this.gift.img.length; i++) {
        this.fileList.push({
          url: this.imgUrl + this.gift.img[i]
        });
        
      }
      this.form.class_id = this.gift.class_id.id;
      this.gift_class = this.gift.class_id.gift_name;
      //获取礼物名称
      this.$axios({
        url: this.$global.url + "root/gift/giftNameList" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          class_id: this.gift.class_id.id
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].name == this.gift.name_id) {
                this.form.name_id = res.data.data[i].id;
                this.gift_name = res.data.data[i].name;
              }
            }
          } else {
            this.$message.error({
              message: res.data.msg,
              center: true
            });
          }
        })
        .catch(e => {
          console.log(e);
          this.$message.error({
            message: "网络较差，请稍后重试！",
            center: true
          });
        });
    }, 2000);
  },
  methods: {
    back() {
      this.$router.back(-1);
    },
    delImg(file, detail) {
      this.form.img.splice(detail.index, 1);
    },
    //图片上传
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      let fd = new FormData();
      fd.append("file", file.file);
      let requestConfig = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      this.$axios
        .post(
          this.$global.url + "root/common/uploadImg" + ".html",
          fd,
          requestConfig
        )
        .then(res => {
          if (res.data.code == 1) {
            this.form.img.push(res.data.src);
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
    classPicker(index) {
      this.addType = index;
      if (index == 2 && this.form.class_id == "") {
        this.$notify({
          message: "请选择礼物分类！！！",
          type: "danger"
        });
        return false;
      } else if (index == 1) {
        this.getClassList();
      } else {
        this.getClassList();
      }
      // this.classShow = true;
    },
    servicePicker(type) {},
    //获取分类列表
    getClassList() {
      let urlApi = "";
      let obj = {};
      if (this.addType == 1) {
        urlApi = "root/gift/classList";
        obj = {};
      } else if (this.addType == 2) {
        urlApi = "root/gift/giftNameList";
        obj.class_id = this.form.class_id;
      }
      this.$axios({
        url: this.$global.url + urlApi + ".html",
        method: "POST",
        data: this.$qs.stringify(obj)
      })
        .then(res => {
          if (res.data.code == 1) {
            this.classList.id = [];
            this.classList.name = [];
            if (this.addType == 1) {
              for (let i = 0; i < res.data.data.length; i++) {
                this.classList.id.push(res.data.data[i].id);
                this.classList.name.push(res.data.data[i].gift_name);
              }
            } else if (this.addType == 2) {
              for (let i = 0; i < res.data.data.length; i++) {
                this.classList.id.push(res.data.data[i].id);
                this.classList.name.push(res.data.data[i].name);
              }
            }
            this.classShow = true;
          } else if (res.data.code == 0) {
            // this.addshow = true;
            this.$notify({
              message: "暂无数据",
              type: "warning"
            });
          } else {
            this.$notify({
              message: res.data.data
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
    //添加
    add() {
      let urlApi = "";
      let obj = {};
      if (this.addType == 1) {
        urlApi = "root/gift/addClass";
        obj.gift_name = this.varname;
      } else if (this.addType == 2) {
        urlApi = "root/gift/giftNameAdd";
        obj = {
          class_id: this.form.class_id,
          name: this.varname
        };
      }
      this.$axios({
        url: this.$global.url + urlApi + ".html",
        method: "POST",
        data: this.$qs.stringify(obj)
      })
        .then(res => {
          if (res.data.code == 1) {
            this.$notify({
              message: res.data.msg,
              type: "success"
            });
            this.classShow = false;
            this.getClassList();
            this.varname = "";
          } else {
            this.$notify({
              message: res.data.msg,
              type: "danger"
            });
          }
        })
        .catch(e => {});
    },
    //获取值
    changePicker(value, index) {
      this.classShow = false;
      if (this.addType == 1) {
        this.form.class_id = this.classList.id[index];
        this.gift_class = value;
      } else if (this.addType == 2) {
        this.form.name_id = this.classList.id[index];
        this.gift_name = value;
      }
    },
    //添加礼物
    addgift() {
      let reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/; //金额 （保留两位小数）
      let regTel = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/; //手机号
      if (this.form.class_id == "") {
        this.$notify({
          message: "礼物分类不能为空！！！",
          type: "danger"
        });
      } else if (this.form.name_id == "") {
        this.$notify({
          message: "礼物名称不能为空！！！",
          type: "danger"
        });
      } else if (this.form.img == "") {
        this.$notify({
          message: "图片不能为空！！！",
          type: "danger"
        });
      } else if (this.form.price == "") {
        this.$notify({
          message: "出售价格不能为空！！！",
          type: "danger"
        });
      } else if (!reg.test(this.form.price)) {
        this.$notify({
          message: "请输入正确价格！！！",
          type: "danger"
        });
      } else if (this.form.gift_number == "") {
        this.$notify({
          message: "出售数量不能为空！！！",
          type: "danger"
        });
      } else if (this.form.tel == "") {
        this.$notify({
          message: "手机号不能为空！！！",
          type: "danger"
        });
      } else if (!regTel.test(this.form.tel)) {
        this.$notify({
          message: "手机号不正确！！！",
          type: "danger"
        });
        return false;
      } else if (!this.checked) {
        this.$notify({
          message: "请勾选《玩号吧服务协议》！！！",
          type: "danger"
        });
        return false;
      } else {
        this.giftAdd();
      }
    },
    //获取礼物详情
    getGift() {
      this.$axios({
        url: this.$global.url + "api/gift/giftGet" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          id: this.$route.query.id
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.gift = res.data.data;
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
    giftAdd() {
      this.$axios({
        url: this.$global.url + "root/gift/updateGift" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: this.form
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.$notify({
              message: "修改成功",
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
    },
    //普通用户需要支付一定的押金
    payBox() {
      this.showPay = !this.showPay;
    },
    //支付接口
    Pay() {
      this.$axios({
        url: this.$global.url + "root/number/goodsPay" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            mid: this.$global.getToken("mid"),
            payType: this.payType,
            price: this.total,
            pay_pwd: this.payPwd,
            goods: 1 //0 账号 1礼物
          }
        })
      })
        .then(res => {
          this.loading = false;
          if (res.data.code == 1) {
            this.showPay = false;
            this.giftAdd();
          } else {
            this.payPwd = "";
            this.$notify({
              message: res.data.msg,
              type: "danger"
            });
          }
        })
        .catch(e => {
          this.loading = false;
          this.payPwd = "";
          this.$notify({
            message: "网络较差，请稍后重试！",
            type: "danger"
          });
        });
    },
    //删除密码
    onDelete() {
      this.payPwd = this.payPwd.slice(0, this.payPwd.length - 1);
    },
    //密码输入事件
    onInput(key) {
      this.payPwd = (this.payPwd + key).slice(0, 6);
      if (this.payPwd.length == 6) {
        this.show = false;
        this.loading = true;
        this.Pay();
      }
    },
    //支付密码弹框
    showPopup() {
      if (!this.total > 0) {
        this.$notify({
          message: "总价格有误！！！",
          type: "danger"
        });
        return false;
      }
      if (this.payType == 0) {
        this.show = true;
      }
      // this.doOrder()
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bgColor {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
}
.header {
  padding: 7px 0;
  background: #fff;
}
.main {
  padding: 15px;
}
.cellGroup {
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 15px;
}
.title {
  font-size: 0.14rem;
  color: #666;
  padding: 15px 0 0 15px;
}
.imgList {
  padding: 15px 0 10px 15px;
}
.grid {
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  text-align: center;
  padding: 15px 0;
}
.option {
  font-size: 0.14rem;
  color: #666666;
}
.option p {
  display: flex;
  align-items: center;
  line-height: 0.2rem;
}
.typeText {
  color: rgba(51, 51, 51, 0.4);
  padding-top: 15px;
}
.paddingB10 {
  padding-bottom: 10px;
}
.label {
  display: flex;
  align-items: center;
}
.groupTitle {
  display: flex;
  font-size: 0.14rem;
  color: #424242;
  margin-bottom: 40px;
}
.groupTitle a {
  color: #108ee9;
}
.zhu {
  font-size: 0.12rem;
  margin-bottom: 0.1rem;
  color: red;
}
/* 支付样式 */
.count {
  width: 1.5rem;
  text-align: left;
  margin-left: 0.16rem;
  font-size: 0.14rem;
}
.count span {
  font-size: 0.16rem;
  color: red;
}
.payTitle {
  text-align: center;
  position: relative;
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
.payType {
  display: flex;
  line-height: 0.2rem;
}
.iconMg {
  margin-right: 5px;
}
.colorRed {
  color: #ff3131;
}
</style>
