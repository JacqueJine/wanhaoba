<template>
  <div class="bgColor">
    <div class="header">
      <van-nav-bar :border="false" title="出售" fixed left-arrow @click-left="back()"></van-nav-bar>
    </div>
    <div class="main">
      <van-cell-group class="cellGroup">
        <p class="title">商品标题</p>
        <van-field v-model="form.title" maxlength="20" placeholder="请输入商品标题" />
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
      <van-cell-group class="cellGroup">
        <van-cell title="操作系统" is-link :value="phoneName" @click="phonePicker" />
        <van-cell title="选择大区" is-link :value="serviceName" @click="servicePicker(2)" />
      </van-cell-group>
      <p class="title paddingB10">游戏详情</p>
      <van-cell-group class="cellGroup">
        <van-cell title="登录方式" is-link :value="loginName" @click="showPicker(4)" />
        <van-field
          v-model="form.account_number"
          label="游戏账号"
          input-align="right"
          maxlength="20"
          placeholder="请输入"
        />
        <van-field
          v-model="form.pwd"
          label="游戏密码"
          input-align="right"
          maxlength="24"
          placeholder="请输入"
        />
        <van-cell title="段位等级" is-link :value="duanName" @click="servicePicker(3)" />
        <van-cell title="爵位等级" is-link :value="levelName" @click="servicePicker(4)" />
        <van-cell title="游戏性别" is-link :value="sexName" @click="showPicker(1)" />
      </van-cell-group>
      <p class="title paddingB10">其他设置</p>
      <van-cell-group class="cellGroup">
        <van-field
          v-model="form.price"
          label="出售价格"
          type="number"
          input-align="right"
          placeholder="请输入出售价格"
        />
      </van-cell-group>
      <p class="title paddingB10">联系</p>
      <van-cell-group class="cellGroup">
        <van-field
          v-model="form.tel"
          label="联系方式"
          input-align="right"
          type="number"
          maxlength="11"
          placeholder="请输入常用手机号"
        />
      </van-cell-group>
      <p class="zhu">注：普通用户账号审核通过后平台自动扣除{{price}}元押金</p>
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
        @click="check"
      >提交</van-button>
    </div>
    <van-popup v-model="serviceShow" round position="bottom" :style="{ height: '50%' }">
      <van-picker
        show-toolbar
        cancel-button-text="取消"
        confirm-button-text
        @cancel="serviceShow=false"
        @confirm="changePicker"
        :columns="serviceList.name"
      ></van-picker>
    </van-popup>
    <van-popup v-model="phoneShow" round position="bottom" :style="{ height: '35%' }">
      <van-picker
        show-toolbar
        cancel-button-text="取消"
        confirm-button-text
        @cancel="phoneShow=false"
        @confirm="changePicker"
        :columns="phoneList.name"
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
    <van-popup v-model="sexShow" round position="bottom" :style="{ height: '35%' }">
      <van-picker
        show-toolbar
        cancel-button-text
        confirm-button-text
        @cancel="sexShow=false"
        @confirm="changeSex"
        :columns="columns"
      />
    </van-popup>
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
  name: "sell",
  data() {
    return {
      value: "",
      varname: "", //添加输入名称
      addshow: false, //添加框显示
      sexShow: false, //性别选框
      phoneShow: false, //系统选框
      serviceShow: false, //公共选择弹框
      checked: true,
      sexList: ["无", "男", "女"], //性别列表
      loginList: [], //登录方式
      loginall: [], //登录全方式
      fileList: [], //图片缓存列表
      phoneList: {}, //系统列表对象（name列表，id列表）
      serviceList: {}, //公共列表对象（name列表，id列表）
      phoneName: "请选择", //系统展示回显选中名称
      serviceName: "请选择", //区服展示回显选中名称
      duanName: "请选择", //段位展示回显选中名称
      levelName: "请选择", //爵位展示回显选中名称
      sexName: "请选择", //性别展示回显选中名称
      loginName: "请选择",
      mintimeList: [1, 2], //最短时间
      gradeList: ["0", "60", "80", "90"], //购买门槛信誉分
      columns: [],
      form: {
        mid: "",
        app_id: "",
        price: "",
        phone_id: "",
        service_id: "",
        title: "",
        sell_type: 1,
        login_method: 3,
        account_number: "",
        pwd: "",
        dan: "",
        level_name: "",
        sex: 0,
        is_buyout: 0,
        mintime: 1,
        start_time: "",
        over_time: "",
        buy_require: 0,
        cash_price: 0,
        night_rend: "",
        tel: "",
        img: [],
        buyout_price: 0,
        goods_cash: 0
      },
      addType: 0, //当前添加弹框类型 1系统 2区服 3段位
      picker: 1, //1 性别 2最短时间 3购买信誉分门槛,
      price: "", //押金 接口获取
      // 支付参数
      showPay: false,
      total: "",
      payType: 0,
      lines: "",
      payPwd: "",
      showKeyboard: true,
      loading: false,
      show: false,
      duanPrice: 0,
      levelPrice: 0,
      onegoods: 0
    };
  },
  created() {
    this.form.app_id = this.$route.query.id;
    this.form.mid = localStorage.getItem("mid");
    this.getPhoneList();
    this.getPrice();
    this.getLoginList();
    //获取余额  是否第一次发布商品
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
  },
  methods: {
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
    //验证
    check() {
      let reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/; //金额 （保留两位小数）
      let regTel = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/; //手机号
      if (!this.form.title) {
        this.$notify({
          message: "请填写商品标题！！！",
          type: "danger"
        });
        return false;
      } else if (this.form.img.length < 1) {
        this.$notify({
          message: "请上传图片！！！",
          type: "danger"
        });
        return false;
      } else if (!this.form.phone_id) {
        this.$notify({
          message: "请选择操作系统！！！",
          type: "danger"
        });
        return false;
      } else if (!this.form.service_id) {
        this.$notify({
          message: "请选择所在大区！！！",
          type: "danger"
        });
        return false;
      } else if (this.form.account_number == "") {
        this.$notify({
          message: "账号不能为空！！！",
          type: "danger"
        });
        return false;
      } else if (this.form.pwd == "") {
        this.$notify({
          message: "密码不能为空！！！",
          type: "danger"
        });
        return false;
      } else if (/[\u4E00-\u9FA5]/g.test(this.form.account_number)) {
        this.$notify({
          message: "账号不能含有中文！！！",
          type: "danger"
        });
        return false;
      } else if (/[\u4E00-\u9FA5]/g.test(this.form.pwd)) {
        this.$notify({
          message: "密码不能含有中文！！！",
          type: "danger"
        });
        return false;
      } else if (!this.form.dan) {
        this.$notify({
          message: "请选择段位！！！",
          type: "danger"
        });
        return false;
      } else if (!this.form.level_name) {
        this.$notify({
          message: "请选择爵位！！！",
          type: "danger"
        });
        return false;
      } else if (!this.form.price) {
        this.$notify({
          message: "请输入账号价格！！！",
          type: "danger"
        });
        return false;
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
      }
      //判断不是商家需要交钱
      else if (this.$global.getToken("role") != "商家") {
        //出售号交多少
        if (this.onegoods == 1) {
          this.$dialog
            .confirm({
              title: "提示",
              message: "您可以选择上传身份证实名认证，免一次商品费用"
            })
            .then(() => {
              this.$router.push({
                path: "/idcarde",
                query: { form: this.form, type: "sell" }
              });
            })
            .catch(() => {
              this.$dialog
                .confirm({
                  // title: "标题",
                  message:
                    "普通用户账号审核通过后平台自动扣除" + this.price + "元押金"
                })
                .then(() => {
                  this.form.goods_cash = this.price;
                  this.submit();
                })
                .catch(() => {
                  // on cancel
                });
            });
        } else {
          this.$dialog
            .confirm({
              // title: "标题",
              message:
                "普通用户账号审核通过后平台自动扣除" + this.price + "元押金"
            })
            .then(() => {
              this.form.goods_cash = this.price;
              this.submit();
            })
            .catch(() => {
              // on cancel
            });
        }
      } else {
        // this.total = (this.duanPrice * 100 + this.levelPrice * 100) / 100;
        // 商家为0
        // this.form.goods_cash = 0;
        // if (this.total <= 0) {
        //   this.$notify({
        //     message: "爵位和段位不可选全选无！！",
        //     type: "danger"
        //   });
        //   return false;
        // }
        this.submit();
      }
    },
    //获取登录方式列表
    getLoginList() {
      this.$axios({
        url: this.$global.url + "root/number/loginList" + ".html",
        method: "POST"
      })
        .then(res => {
          if (res.data.code == 1) {
            for (let i = 0; i < res.data.data.length; i++) {
              this.loginList.push(res.data.data[i].name);
            }
            this.loginall = res.data.data;
          } else if (res.data.code == 0) {
            this.$message.info({
              message: "暂无数据！"
            });
          }
        })
        .catch(e => {
          this.$message.error({
            message: "网络较差，请稍后重试！"
          });
        });
    },
    //公共获取选择列表
    servicePicker(type) {
      this.addType = type;
      let api = "";
      let obj = {};
      if (type == 2) {
        api = "root/number/serviceList";
        obj = {
          app_id: this.form.app_id,
          phone_id: this.form.phone_id
        };
      } else if (type == 3) {
        api = "root/number/levelList";
        obj = {
          app_id: this.form.app_id,
          level_type: 0
        };
      } else if (type == 4) {
        api = "root/number/levelList";
        obj = {
          app_id: this.form.app_id,
          level_type: 1
        };
      }
      if (type == 2 && this.form.phone_id == "") {
        this.$notify({
          message: "请选择操作系统！！！",
          type: "danger"
        });
      } else {
        this.$axios({
          url: this.$global.url + api + ".html",
          method: "POST",
          data: this.$qs.stringify(obj)
        })
          .then(res => {
            if (type == 2) {
              this.serviceList.id = [];
              this.serviceList.name = [];
            } else {
              this.serviceList.id = ["0"];
              this.serviceList.name = ["无"];
              this.serviceList.price = [0];
              this.serviceShow = true;
            }
            if (res.data.code == 1) {
              for (let i = 0; i < res.data.data.length; i++) {
                this.serviceList.id.push(res.data.data[i].id);
                if (type == 2) {
                  this.serviceList.name.push(res.data.data[i].name);
                } else {
                  this.serviceList.name.push(res.data.data[i].level_name);
                  this.serviceList.price.push(
                    Number(res.data.data[i].level_price)
                  );
                }
              }
              this.serviceShow = true;
            } else if (res.data.code == 0) {
              if (type == 2) {
                // this.addshow = true;
                this.$notify({
                  message: "暂无数据",
                  type: "warning"
                });
              }
            }
          })
          .catch(e => {
            this.$notify({
              message: "网络较差，请稍后重试！",
              type: "danger"
            });
          });
      }
    },
    phonePicker() {
      this.addType = 1;
      this.phoneShow = true;
    },
    //获取押金
    getPrice() {
      this.$axios({
        url: this.$global.url + "root/number/listCash" + ".html",
        method: "POST"
      })
        .then(res => {
          if (res.data.code == 1) {
            this.price = res.data.data;
          } else {
            this.$message.error({
              message: res.data.msg,
              center: true
            });
          }
          // this.form.phone = res.data;
        })
        .catch(e => {
          console.log(e);
          this.$message.error({
            message: "网络较差，请稍后重试！",
            center: true
          });
        });
    },
    //添加系统
    add() {
      let urlApi = "";
      let obj = {};
      if (this.addType == 1) {
        urlApi = "root/number/addPhone";
        obj.name = this.varname;
      } else if (this.addType == 2) {
        urlApi = "root/number/addService";
        obj = {
          data: {
            app_id: this.form.app_id,
            phone_id: this.form.phone_id,
            name: this.varname
          }
        };
      } else if (this.addType == 3) {
        urlApi = "root/number/levelAdd";
        obj = {
          data: {
            app_id: this.form.app_id,
            level_type: 0,
            level_name: this.varname
          }
        };
      } else if (this.addType == 4) {
        urlApi = "root/number/levelAdd";
        obj = {
          data: {
            app_id: this.form.app_id,
            level_type: 1,
            level_name: this.varname
          }
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
            if (this.addType == 1) {
              this.phoneShow = false;
              this.getPhoneList();
            } else {
              this.serviceShow = false;
              this.servicePicker(this.addType);
            }
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
    changeSex(value, index) {
      if (this.picker == 1) {
        this.sexName = value;
        this.form.sex = index;
      } else if (this.picker == 2) {
        this.form.mintime = value;
      } else if (this.picker == 3) {
        this.form.buy_require = value;
      } else if (this.picker == 4) {
        this.loginName = value;
        this.form.login_method = this.loginall[index].id;
      }
      this.sexShow = false;
    },
    showPicker(type) {
      this.picker = type;
      if (type == 1) {
        this.columns = this.sexList;
      } else if (type == 2) {
        this.columns = this.mintimeList;
      } else if (type == 3) {
        this.columns = this.gradeList;
      } else if (type == 4) {
        this.columns = this.loginList;
      }
      this.sexShow = !this.sexShow;
    },
    //公共选中
    changePicker(value, index) {
      if (this.addType == 1) {
        this.form.phone_id = this.phoneList.id[index];
        this.form.service_id = "";
        this.phoneName = value;
        this.serviceName = "请选择";
        this.phoneShow = false;
      } else if (this.addType == 2) {
        this.form.service_id = this.serviceList.id[index];
        this.serviceName = value;
      } else if (this.addType == 3) {
        this.form.dan = this.serviceList.id[index];
        this.duanName = value;
        this.duanPrice = this.serviceList.price[index];
      } else if (this.addType == 4) {
        this.form.level_name = this.serviceList.id[index];
        this.levelName = value;
        this.levelPrice = this.serviceList.price[index];
      }
      this.serviceShow = false;
    },
    //获取区服列表
    getPhoneList() {
      this.addType = 1;
      this.$axios({
        url: this.$global.url + "root/number/phoneList" + ".html",
        method: "POST"
      })
        .then(res => {
          if (res.data.code == 1) {
            this.phoneList.id = [];
            this.phoneList.name = [];
            for (let i = 0; i < res.data.data.length; i++) {
              this.phoneList.id.push(res.data.data[i].id);
              this.phoneList.name.push(res.data.data[i].name);
            }
          } else if (res.data.code == 0) {
            // this.addshow = true;
            this.$notify({
              message: "暂无数据",
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
    back() {
      this.$router.back(-1);
    },
    //普通用户需要支付一定的金额
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
            goods: 0 //0 账号 1礼物
          }
        })
      })
        .then(res => {
          this.loading = false;
          if (res.data.code == 1) {
            this.showPay = false;
            this.submit();
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
  background: #f5f5f5;
}
.header {
  background: #fff;
}
.main {
  padding: 15px;
  margin-top: 50px;
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
  font-size: 14px;
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
  margin-bottom: 140px;
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
