<template>
  <div class="news">
    <van-nav-bar title="确认下单" left-arrow :border="false" fixed @click-left="back()">
      <div slot="right">
        <span>疑难解答</span>
        <van-icon name="warning-o" color="#333333" size=".16rem" />
      </div>
    </van-nav-bar>
    <van-cell :value="data.title" style="font-size:0.16rem" />
    <van-cell :title="app_id.app_name" :icon="imgurl+app_id.app_logo">
      <van-image
        width=".15rem"
        height=".15rem"
        lazy-load
        :src="require('../assets/index/bao.png')"
      />
      <van-image
        width=".15rem"
        height=".15rem"
        lazy-load
        :src="require('../assets/index/shi.png')"
      />
      <van-image
        width=".15rem"
        height=".15rem"
        lazy-load
        :src="require('../assets/index/shou.png')"
      />
      <div v-if="data.sell_type!=1" slot="label">
        <span>起租：{{data.mintime}}小时</span>
        <span>押金：{{data.cash_price!=0?data.cash_price:'免押金'}}</span>
      </div>
    </van-cell>
    <div class="info">
      <ul v-if="data.sell_type!=1">
        <li
          v-for="(item,index) in rent_id"
          :key="index"
          @click="change(index)"
          :class="selected==index?'active':''"
        >
          <span>{{index==0?'时租':index==1?'包夜':index==2?'天租':index==3?'周租':''}}</span>
          <p>{{item.price}}</p>
        </li>
      </ul>
    </div>
    <div class="cellBox">
      <van-cell-group v-if="data.sell_type!=1" class="cellRadius">
        <van-cell>
          <van-row>
            <van-col span="6" class="label">可租时间：</van-col>
            <van-col span="18" class="cellValue">{{data.start_time}}-{{data.over_time}}</van-col>
          </van-row>
        </van-cell>
        <van-cell v-if="!selected">
          <van-row>
            <van-col span="10" class="label">租赁时长（小时）：</van-col>
            <van-col span="14" class="cellValue" style="text-align:right">
              <van-stepper
                v-model="num"
                @change="addup"
                integer
                :min="data.mintime"
                max="24"
                input-width=".30rem"
                button-size=".22rem"
              />
            </van-col>
          </van-row>
        </van-cell>
        <van-cell>
          <van-row>
            <van-col span="6" class="label">租金：</van-col>
            <van-col span="18" class="cellValue colorRed">{{rent*num}}</van-col>
          </van-row>
        </van-cell>
        <van-cell v-if="type!='续费'">
          <van-row>
            <van-col span="6" class="label">押金：</van-col>
            <van-col
              span="18"
              class="cellValue colorRed"
            >{{data.cash_price!=0?data.cash_price:'免押金'}}</van-col>
          </van-row>
        </van-cell>
      </van-cell-group>
      <p class="zhu" v-if="data.sell_type!=1">注：续费不需要再交押金</p>
      <p class="groupTitle">
        <van-checkbox v-model="checked" checked-color="#108EE9">
          已阅读并同意
          <router-link to="#">《玩号吧服务协议》</router-link>
        </van-checkbox>
      </p>
    </div>
    <van-goods-action>
      <span class="money">
        合计
        <b>￥{{total}}</b>
      </span>
      <van-goods-action-button
        color="linear-gradient(to bottom, #6574FF, #7065FF)"
        @click="checkOrder"
        text="确认"
      />
    </van-goods-action>
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
  name: "confirmOrder",
  data() {
    return {
      num: 1,
      showPay: false,
      lines: "",
      imgurl: this.$global.imgUrl,
      payType: 0,
      selected: 0,
      data: {},
      app_id: "",
      rent: "",
      total: 0,
      checked: true,
      loading: false,
      show: false,
      showKeyboard: true,
      payPwd: "",
      order_id: "",
      rent_id: [
        {
          price: ""
        },
        {
          price: ""
        },
        {
          price: ""
        },
        {
          price: ""
        }
      ],
      xufei: {
        mid: "",
        pay_pwd: "",
        price: "",
        rent_type: 1,
        hour: "",
        number_id: "",
        pay_type: "", // 0:余额  1:微信  2:支付宝
        order_id: "", //				订单ID
        sell_mid: "" //		int				商家ID
      },
      type: ""
    };
  },
  created() {
    this.type = this.$route.query.type;
    if (this.$route.query.type == "续费") {
      this.xufei.number_id = this.$route.query.id;
      this.xufei.order_id = this.$route.query.order_id;
      this.xufei.sell_mid = this.$route.query.sell_mid;
      this.xufei.mid = this.$route.query.mid;
    }
    this.getData();
    // console.log(this.data);
    setTimeout(() => {
      console.log(this.data.sell_type);
    }, 3000);
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
    //出售支付
    sellPay() {
      this.$axios({
        url: this.$global.url + "api/numberOrder/outPayOrder" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            mid: localStorage.getItem("mid"),
            sell_mid: this.data.sell_mid,
            pay_pwd: this.payPwd,
            price: this.total,
            cash_price: this.data.cash_price,
            number_id: this.data.id,
            pay_type: this.payType,
            order_id: this.order_id
          }
        })
      })
        .then(res => {
          this.loading = false;
          if (res.data.code == 1) {
            this.showPay = false;
            this.$notify({
              message: res.data.msg,
              type: "success"
            });
            localStorage.setItem("pay", JSON.stringify(res.data.data));
            this.goPaySuccess();
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
    //出租支付
    rentPay() {
      this.$axios({
        url: this.$global.url + "api/numberOrder/payOrder" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            mid: localStorage.getItem("mid"),
            sell_mid: this.data.sell_mid,
            pay_pwd: this.payPwd,
            price: this.total,
            cash_price: this.data.cash_price,
            rent_type: this.rent_id[this.selected].time_type,
            number_id: this.data.id,
            hour: this.num,
            pay_type: this.payType,
            order_id: this.order_id
          }
        })
      })
        .then(res => {
          this.loading = false;
          this.payPwd = "";
          if (res.data.code == 1) {
            this.showPay = false;
            this.$notify({
              message: res.data.msg,
              type: "success"
            });
            localStorage.setItem("pay", JSON.stringify(res.data.data));
            this.goPaySuccess();
          } else {
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
    //续费支付
    xufeiPay() {
      this.xufei.hour = this.num;
      this.xufei.pay_type = this.payType;
      this.$axios({
        url: this.$global.url + "api/numberOrder/payRenew" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: this.xufei
        })
      })
        .then(res => {
          this.loading = false;
          this.payPwd = "";
          if (res.data.code == 1) {
            this.showPay = false;
            this.$notify({
              message: res.data.msg,
              type: "success"
            });
            this.$router.push({
              path: "/orderDetail",
              query: { id: this.xufei.order_id, type: 1 }
            });
          } else {
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
    //密码输入事件
    onInput(key) {
      this.payPwd = (this.payPwd + key).slice(0, 6);
      this.xufei.pay_pwd = this.payPwd;
      if (this.payPwd.length == 6) {
        this.show = false;
        this.loading = true;
        if (this.data.sell_type) {
          this.sellPay();
        } else if (this.$route.query.type == "续费") {
          this.xufeiPay();
        } else {
          this.rentPay();
        }
      }
    },
    //删除密码
    onDelete() {
      this.payPwd = this.payPwd.slice(0, this.payPwd.length - 1);
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
    },
    //下单
    doOrder() {
      let rent_type = 0;
      if (!this.data.sell_type) {
        rent_type = this.rent_id[this.selected].time_type;
      }
      this.$axios({
        url: this.$global.url + "api/numberOrder/createOrder" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            mid: localStorage.getItem("mid"),
            sell_mid: this.data.sell_mid,
            price: this.total,
            type: this.data.sell_type,
            remark: "",
            cash_price: this.data.cash_price,
            rent_type: rent_type,
            number_id: this.data.id,
            hour: this.num
          }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.order_id = res.data.order_id;
            this.showPay = true;
            // this.showPopup();
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
    checkOrder() {
      if (!this.checked) {
        this.$notify({
          message: "请勾选相关协议！！！",
          type: "danger"
        });
        return false;
      }
      if (this.$route.query.type == "续费") {
        this.showPay = true;
      } else {
        this.doOrder();
      }

      // this.showPay = true;
    },
    //合计金额
    addup() {
      if (!this.data.sell_type) {
        if (this.selected) {
          if (this.$route.query.type == "续费") {
            this.total = (this.rent * 100 * 1) / 100;
          } else {
            this.total =
              (this.rent * 100 * 1 + this.data.cash_price * 100 * 1) / 100;
          }
        } else if (this.$route.query.type == "续费") {
          this.total = (this.rent * 100 * this.num) / 100;
          this.xufei.price = this.total;
        } else {
          this.total =
            (this.rent * 100 * this.num + this.data.cash_price * 100 * 1) / 100;
        }
      } else {
        this.total = this.data.price;
      }
    },
    getData() {
      this.$axios({
        url: this.$global.url + "api/number/getGoods" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          id: this.$route.query.id,
          mid: localStorage.getItem("mid")
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.data = res.data.data;
            this.app_id = res.data.data.app_id;
            if (this.$route.query.type == 1) {
              this.data.sell_type = 1;
              this.data.cash_price = 0;
            }
            if (this.data.sell_type != 1) {
              this.rent_id = res.data.data.rent;
              this.num = this.data.mintime;
              this.rent = this.rent_id[this.selected].price;
            } else {
              this.rent = res.data.data.price;
            }
            this.addup();
          } else if (res.data.code == 0) {
            this.data = [];
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
            message: "网络较差，请稍后重试1",
            type: "danger"
          });
        });
    },
    back() {
      this.$router.back(-1);
    },
    //支付方式框
    payBox() {
      this.showPay = !this.showPay;
    },
    //选择租用方式
    change(index) {
      this.selected = index;
      this.rent = this.rent_id[this.selected].price;
      this.num = 1;
      this.addup();
      this.xufei.rent_type = index + 1;
    },
    goPaySuccess() {
      this.$router.push({
        path: "/paySuccess",
        query: { id: this.data.sell_type }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.news {
  width: 100%;
  height: 90vh;
  background: rgba(245, 245, 245, 1);
  margin-top: 60px;
}
.cell {
  margin-top: 10px;
}
.cellTitle {
  display: flex;
  align-items: center;
}
.tagMargin {
  border-radius: 5px;
  margin: 0 5px 0 10px;
}
.info {
  margin: 20px 15px 10px;
}
.info ul {
  overflow: hidden;
  background: #fff;
  border-radius: 10px;
}
.info ul li {
  width: 25%;
  height: 0.86rem;
  float: left;
  padding: 15px;
  border-radius: 10px;
  box-sizing: border-box;
  text-align: center;
}
.info ul li span {
  font-size: 0.14rem;
  color: rgba(51, 51, 51, 0.6);
}
.info ul li p {
  font-size: 0.13rem;
  font-weight: 500;
  padding-top: 10px;
  color: rgba(51, 51, 51, 1);
}
.info .active {
  background: #6673ff;
  color: #fff;
}
.info .active p {
  color: #fff;
}
.info .active span {
  color: rgba(255, 255, 255, 0.6);
}
.cellBox {
  margin: 0 15px 20px;
}
.cellRadius {
  border-radius: 10px;
  overflow: hidden;
}
.label {
  font-size: 0.12rem;
  color: rgba(51, 51, 51, 0.4);
}
.cellValue {
  font-size: 0.12rem;
}
.tagRight {
  padding: 0.15em 0.3em;
}
.money {
  width: 1.2rem;
  padding: 0 30px 0 15px;
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 0.12rem;
}
.money b {
  font-size: 0.16rem;
  color: #ff3131;
}
.groupTitle {
  display: flex;
  font-size: 0.14rem;
  padding-top: 10px;
  color: #424242;
}
.groupTitle a {
  color: #108ee9;
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
.zhu {
  font-size: 0.12rem;
  margin-top: 0.1rem;
  color: red;
}
</style>