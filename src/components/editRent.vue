<template>
  <div class="bgColor">
    <div class="header">
      <van-nav-bar :border="false" title="出租编辑" fixed left-arrow @click-left="back()"></van-nav-bar>
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
      <p class="title paddingB10">租金设置</p>
      <div class="grid">
        <van-grid :column-num="4" :border="false" square>
          <van-grid-item class="option">
            <p>时租</p>
            <span class="typeText">{{form.hour}}元</span>
          </van-grid-item>
          <van-grid-item class="option">
            <p>
              包夜
              <van-icon name="warning-o" />
            </p>
            <span class="typeText">{{form.night}}元</span>
          </van-grid-item>
          <van-grid-item class="option">
            <p>天租</p>
            <span class="typeText">{{form.day}}元</span>
          </van-grid-item>
          <van-grid-item class="option">
            <p>周租</p>
            <span class="typeText">{{form.week}}元</span>
          </van-grid-item>
        </van-grid>
        <van-button
          round
          size="small"
          @click="showKey = true"
          color="linear-gradient(to bottom, #6574FF, #7065FF)"
        >点击设置单价</van-button>
      </div>
      <p class="title paddingB10">包夜设置</p>
      <van-cell-group class="cellGroup paddingB10">
        <van-switch-cell
          v-model="form.night_rend"
          active-value="1"
          inactive-value="0"
          active-color="#696FFF"
          title="包夜时间可否时租"
        />
        <!-- @click="nightPicker(1)" @click="nightPicker(2)" -->
        <van-cell title="包夜开始时间" is-link :value="start_time" />
        <van-cell title="包夜结束时间" is-link :value="over_time" />
        <van-field
          v-model="form.night"
          label="租金"
          type="number"
          clearable
          input-align="right"
          placeholder="请输入单价"
        />
      </van-cell-group>
      <p class="title paddingB10">其他设置</p>
      <van-cell-group class="cellGroup paddingB10">
        <van-cell title="最短租用时间" is-link :value="form.mintime+'小时起'" @click="showPicker(2)" />
        <!-- 全天可租 -->
        <van-switch-cell
          v-model="all_rend"
          active-value="1"
          inactive-value="0"
          active-color="#696FFF"
          title="全天可租"
          @change="getAllDay"
        />
        <van-cell title="可租用开始时间" is-link :value="form.start_time" @click="timePicker(1)" />
        <van-cell title="可租用结束时间" is-link :value="form.over_time" @click="timePicker(2)" />
        <van-cell title="购买门槛" is-link :value="'信用分不低于'+form.buy_require" @click="showPicker(3)" />
        <van-field
          v-model="form.cash_price"
          label="押金"
          type="number"
          input-align="right"
          placeholder="请输入"
        />
        <van-switch-cell
          v-model="form.is_buyout"
          active-value="1"
          inactive-value="0"
          active-color="#696FFF"
          title="买断"
        />
        <van-field
          v-if="form.is_buyout==1"
          v-model="form.buyout_price"
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
      <!-- <p class="zhu">注：普通用户账号审核通过后平台自动扣除{{price}}元押金</p> -->
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
    <van-popup
      v-model="nightShow"
      :close-on-click-overlay="false"
      round
      position="bottom"
      :style="{ height: '35%' }"
    >
      <van-datetime-picker
        :filter="filter"
        :max-hour="maxHour"
        :min-hour="minHour"
        show-toolbar
        @cancel="nightShow=false"
        @confirm="getNight"
        type="time"
      />
    </van-popup>
    <van-popup
      v-model="timeShow"
      :close-on-click-overlay="false"
      round
      position="bottom"
      :style="{ height: '35%' }"
    >
      <van-datetime-picker show-toolbar @cancel="timeShow=false" @confirm="getTime" type="time" />
    </van-popup>
    <van-popup v-model="serviceShow" round position="bottom" :style="{ height: '40%' }">
      <van-picker
        show-toolbar
        cancel-button-text="取消"
        confirm-button-text
        @cancel="serviceShow=false"
        @confirm="changePicker"
        :columns="serviceList.name"
      ></van-picker>
    </van-popup>
    <van-popup v-model="phoneShow" round position="bottom" :style="{ height: '40%' }">
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
    <van-popup v-model="sexShow" round position="bottom" :style="{ height: '50%' }">
      <van-picker
        show-toolbar
        cancel-button-text
        confirm-button-text
        @cancel="sexShow=false"
        @confirm="changeSex"
        :columns="columns"
      />
    </van-popup>
    <van-popup v-model="showKey" round position="bottom">
      <van-cell-group style="padding:10px 0;">
        <van-field
          v-model="form.hour"
          label="时租"
          type="number"
          input-align="right"
          clearable
          placeholder="请输入单价"
        />
        <!-- <van-field
          v-model="form.night"
          label="包夜"
          type="number"
          input-align="right"
          clearable
          placeholder="请输入单价"
        />-->
        <van-field
          v-model="form.day"
          label="天租"
          type="number"
          input-align="right"
          clearable
          placeholder="请输入单价"
        />
        <van-field
          v-model="form.week"
          label="周租"
          type="number"
          input-align="right"
          clearable
          error-message
          placeholder="请输入单价"
        />
      </van-cell-group>
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
  name: "rent",
  data() {
    return {
      value: "",
      varname: "", //添加输入名称
      addshow: false, //添加框显示
      sexShow: false, //性别选框
      phoneShow: false, //系统选框
      serviceShow: false, //公共选择弹框
      timeShow: false,
      nightShow: false,
      showKey: false,
      checked: true,
      sexList: ["无", "男", "女"], //性别列表
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
      loginList: [], //登录方式
      loginall: [], //登录全方式
      gradeList: ["0", "60", "80", "90"], //购买门槛信誉分
      columns: [],
      price: "", //押金
      all_rend: 0, //是否全天可租
      form: {
        mid: "",
        app_id: "",
        buyout_price: "",
        phone_id: "",
        service_id: "",
        title: "",
        sell_type: 0,
        account_number: "",
        night_rend: 0,

        pwd: "",
        dan: "",
        level_name: "",
        sex: 0,
        is_buyout: 0,
        login_method: "",
        mintime: 1,

        hour: "",
        night: "",
        day: "",
        week: "",

        start_time: "",
        over_time: "",
        buy_require: 0,
        cash_price: "",
        tel: "",
        img: [],
        goods_cash: 0
      },
      timeType: 1,
      nightType: 1,
      addType: 0, //当前添加弹框类型 1系统 2区服 3段位
      picker: 1, //1 性别 2最短时间 3购买信誉分门槛
      maxHour: 23,
      minHour: 18,
      start_time: "",
      over_time: "",
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
      onegoods: 0,
      game: "",
      imgUrl: this.$global.imgUrl
    };
  },
  created() {
    this.getPhoneList();
    this.getNightTime();
    this.getPrice();
    this.getLoginList();
    this.getData();
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
  mounted() {
    setTimeout(() => {
      let game = this.game;
      console.log(game);
      this.form.id = game.id;
      this.form.mid = game.sell_mid;
      this.form.app_id = game.app_id.id;
      this.form.buyout_price = game.price;

      this.form.title = game.title;
      this.form.sell_type = game.sell_type;
      this.form.login_method = game.login_method;
      this.form.account_number = game.account_number;
      this.form.pwd = game.pwd;
      if (game.night_rend == 1) {
        this.form.night_rend = "1";
      }
      this.form.sex = game.sex;
      this.form.is_buyout = game.is_buyout;
      if (game.is_buyout == 1) {
        this.form.is_buyout = "1";
      }
      this.form.mintime = game.mintime;
      this.form.start_time = game.start_time;
      this.form.over_time = game.over_time;
      this.form.cash_price = game.cash_price;
      this.form.goods_cash = game.goods_cash;
      this.form.buyout_price = game.buyout_price;
      //判断是否全天租
      if (game.start_time == "00:00" && game.over_time == "23:59") {
        this.all_rend = "1";
      }

      //购买门槛
      if (game.buy_require == "0") {
        this.form.buy_require = 0;
      } else if (game.buy_require == "60") {
        this.form.buy_require = 60;
      } else if (game.buy_require == "80") {
        this.form.buy_require = 80;
      } else if (game.buy_require == "90") {
        this.form.buy_require = 90;
      }
      this.form.cash_price = game.cash_price;
      this.form.tel = game.tel;
      this.form.img = game.img;
      // this.form.time = game.time;
      //图片
      for (let i = 0; i < game.img.length; i++) {
        this.fileList.push({
          url: this.imgUrl + game.img[i]
        });
      }
      //租 时、夜、天、周
      for (let i = 0; i < game.rent.length; i++) {
        if (game.rent[i].time_type == 1) {
          this.form.hour = game.rent[i].price;
        } else if (game.rent[i].time_type == 2) {
          this.form.night = game.rent[i].price;
        } else if (game.rent[i].time_type == 3) {
          this.form.day = game.rent[i].price;
        } else if (game.rent[i].time_type == 4) {
          this.form.week = game.rent[i].price;
        }
      }
      //性别
      if (game.sex == 0) {
        this.sexName = "无";
      } else if (game.sex == 1) {
        this.sexName = "男";
      } else {
        this.sexName = "女";
      }
      //绑定操作系统
      for (let i = 0; i < this.phoneList.name.length; i++) {
        if (game.phone_id == this.phoneList.name[i]) {
          this.form.phone_id = this.phoneList.id[i];
          this.phoneName = game.phone_id;
        }
      }
      //绑定大区
      this.$axios({
        url: this.$global.url + "root/number/serviceList" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          app_id: this.form.app_id,
          phone_id: this.form.phone_id
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            for (let i = 0; i < res.data.data.length; i++) {
              if (game.service_id == res.data.data[i].name) {
                this.form.service_id = res.data.data[i].id;
                this.serviceName = game.service_id;
              }
            }
          }
        })
        .catch(e => {
          this.$notify({
            message: "网络较差，请稍后重试！",
            type: "danger"
          });
        });
      //绑定登录方式
      for (let i = 0; i < this.loginall.length; i++) {
        if (this.loginall[i].id == game.login_method) {
          this.loginName = this.loginall[i].name;
        }
      }
      //获取段位,爵位列表
      for (let i = 0; i < 2; i++) {
        this.$axios({
          url: this.$global.url + "root/number/levelList" + ".html",
          method: "POST",
          data: this.$qs.stringify({
            app_id: this.form.app_id,
            level_type: i
          })
        })
          .then(res => {
            if (res.data.code == 1) {
              if (i == 0) {
                if (game.dan == null) {
                  this.duanName = "无";
                  this.form.dan = 0;
                } else {
                  for (let i = 0; i < res.data.data.length; i++) {
                    if (res.data.data[i].level_name == game.dan) {
                      this.duanName = game.dan;
                      this.form.dan = res.data.data[i].id;
                    }
                  }
                }
              } else {
                if (game.level_name == null) {
                  this.levelName = "无";
                  this.form.level_name = 0;
                } else {
                  for (let i = 0; i < res.data.data.length; i++) {
                    if (res.data.data[i].level_name == game.level_name) {
                      this.levelName = game.level_name;
                      this.form.level_name = res.data.data[i].id;
                    }
                  }
                }
              }
              //0段位  1爵位
            } else if (res.data.code == 0) {
              if (i == 0) {
                this.duanName = "无";
                this.form.dan = 0;
              } else {
                this.levelName = "无";
                this.form.level_name = 0;
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
    }, 2500);
  },
  methods: {
    submit() {
      let obj = {};
      for (let i in this.form) {
        if (
          i != "hour" &&
          i != "night" &&
          i != "day" &&
          i != "week" &&
          i != "time"
        ) {
          obj[i] = this.form[i];
        }
      }
      obj.price = this.form.buyout_price;
      obj.rent = [
        {
          time_type: 1,
          price: this.form.hour,
          start_time: "",
          end_time: "",
          rent_id: this.game.rent[0].id
        },
        {
          time_type: 2,
          price: this.form.night,
          start_time: this.start_time,
          end_time: this.over_time,
          rent_id: this.game.rent[1].id
        },
        {
          time_type: 3,
          price: this.form.day,
          start_time: "",
          end_time: "",
          rent_id: this.game.rent[2].id
        },
        {
          time_type: 4,
          price: this.form.week,
          start_time: "",
          end_time: "",
          rent_id: this.game.rent[3].id
        }
      ];
      this.$axios({
        url: this.$global.url + "root/number/updateGoods" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: obj
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.$notify({
              message: res.data.msg,
              type: "success"
            });
            this.$router.go(-1);
          }
        })
        .catch(e => {
          this.$notify({
            message: "网络较差，请稍后重试！",
            type: "danger"
          });
        });
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
    //设置全天可租
    getAllDay(checked) {
      if (checked == 1) {
        this.form.start_time = "00:00";
        this.form.over_time = "23:59";
      } else {
        this.form.start_time = "";
        this.form.over_time = "";
      }
    },
    //获取账号信息
    getData() {
      this.$axios({
        url: this.$global.url + "api/number/getGoods" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          id: this.$route.query.id,
          mid: this.$route.query.sell_mid
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.game = res.data.data;
          } else if (res.data.code == 0) {
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
    //验证
    check() {
      let reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/; //金额 （保留两位小数）
      let regTel = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/; //手机号
      let startTime = new Date("2018-1-1 " + this.start_time); // 开始时间
      let endTime = new Date("2018-1-2 " + this.over_time);
      let num = Math.floor((endTime - startTime) / 1000 / 60); // 分钟
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
      } else if (!this.form.dan && !this.form.level_name) {
        this.$notify({
          message: "请选择段位/爵位！！！",
          type: "danger"
        });
        return false;
      } else if (
        !reg.test(this.form.hour) ||
        !reg.test(this.form.night) ||
        !reg.test(this.form.day) ||
        !reg.test(this.form.week)
      ) {
        this.$notify({
          message: "请填写正确的租金！！！",
          type: "danger"
        });
        return false;
      } else if (!this.form.start_time || !this.form.over_time) {
        this.$notify({
          message: "请选择开始和结束时间段！！！",
          type: "danger"
        });
        return false;
      } else if (!this.form.cash_price) {
        this.$notify({
          message: "请填写押金！！！",
          type: "danger"
        });
        return false;
      } else if (!reg.test(this.form.cash_price)) {
        this.$notify({
          message: "押金必填且不可为0",
          type: "danger"
        });
        return false;
      } else if (this.form.is_buyout == 1 && !this.form.buyout_price) {
        this.$notify({
          message: "请输入出售价格！！！",
          type: "danger"
        });
        return false;
      } else if (!this.start_time || !this.over_time) {
        this.$notify({
          message: "请选择包夜开始和结束时间！！！",
          type: "danger"
        });
        return false;
      } else if (num < 600) {
        this.$notify({
          message: "包夜时间不得低于10个小时！！！",
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
      } else {
        this.submit();
      }
    },
    //选择时间
    getTime(value) {
      if (this.timeType == 1) {
        this.form.start_time = value;
      } else {
        this.form.over_time = value;
      }
      this.timeShow = false;
    },
    //包夜时间间隔
    filter(type, options) {
      if (type === "minute") {
        return options.filter(option => option % 15 === 0);
      }
      return options;
    },
    //包夜选择时间
    getNight(value) {
      if (this.nightType == 1) {
        this.start_time = value;
      } else {
        this.over_time = value;
      }
      this.nightShow = false;
    },
    //时间选择
    timePicker(type) {
      if (this.all_rend == 1) {
        return false;
      }
      this.timeType = type;
      this.timeShow = true;
    },
    //包夜时间选择
    nightPicker(type) {
      this.nightType = type;
      if (type == 1) {
        this.maxHour = 23;
        this.minHour = 18;
      } else {
        this.maxHour = 9;
        this.minHour = 6;
      }
      this.nightShow = true;
    },
    //公共获取选择列表
    servicePicker(type) {
      this.addType = type;
      this.serviceList = {};
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
                  type: "danger"
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
        console.log(this.form.login_method);
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
    //获取包夜时间
    getNightTime() {
      this.$axios({
        url: this.$global.url + "root/number/nightList" + ".html",
        method: "POST"
      })
        .then(res => {
          if (res.data.code == 1) {
            this.start_time = res.data.data[0];
            this.over_time = res.data.data[1];
          } else {
            this.$notify({
              message: "网络较差，请稍后重试！",
              type: "danger"
            });
          }
          // this.form.phone = res.data;
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            message: "网络较差，请稍后重试！",
            type: "danger"
          });
        });
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
            this.$notify({
              message: res.data.msg,
              type: "danger"
            });
          }
          // this.form.phone = res.data;
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            message: "网络较差，请稍后重试！",
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
            goods: 0
          }
        })
      })
        .then(res => {
          this.loading = false;
          if (res.data.code == 1) {
            this.showPay = false;
            // this.submit();
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
