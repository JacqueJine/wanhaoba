<template>
  <div class="order">
    <van-nav-bar :border="false" title="账号置顶" left-arrow @click-left="back()" />
    <div class="item">
      <div class="itemInfo">
        <van-image
          class="infoImg"
          width=".85rem"
          height=".85rem"
          lazy-load
          radius="10px"
          :src="imgUrl+data.img[0]"
        />
        <div class="info">
          <li class="infoTitle">
            <van-tag
              v-if="!type"
              :color="data.sell_type?'#FF3131':'#696FFF'"
              class="tagRight"
            >{{data.sell_type?'出售':'出租'}}</van-tag>
            <van-tag
              v-if="type"
              :color="data.type?'#FF3131':'#696FFF'"
              class="tagRight"
            >{{data.type?'出售':'求购'}}</van-tag>
            <!-- <span>{{title==='number'?item.title:item.name_id}}</span> -->
            <span>{{!type?data.title:data.name_id}}</span>
          </li>
          <li class="tag" v-if="!type">
            <van-tag color="rgba(153,153,153,0.1)" text-color="rgba(51,51,51,0.4)">{{data.phone_id}}</van-tag>
            <van-tag
              v-if="!data.sell_type"
              color="rgba(153,153,153,0.1)"
              text-color="rgba(51,51,51,0.4)"
            >{{data.mintime}}小时起租</van-tag>
            <van-tag
              v-if="!data.cash_price"
              color="rgba(153,153,153,0.1)"
              text-color="rgba(51,51,51,0.4)"
            >免押金</van-tag>
          </li>
          <li class="total">
            <b v-if="!type">￥{{!data.sell_type?data.rent.price:data.price}}</b>
            <b v-if="type">￥{{data.price}}</b>
            <!-- <span>/1天</span> -->
            <span class="num1" v-if="type">{{data.type?data.ask_sum:data.gift_number}}件</span>
            <span class="num1" v-if="!type">已售{{data.out_count}}次</span>
          </li>
        </div>
      </div>
      <!-- <div v-if="!type&&!data.sell_type" class="itemBtn">
        <p class="countDown bgBlue">
          出售中倒计时：
          <van-count-down class="time" :time="time" />
        </p>
      </div>-->
      <div class="main">
        <p>搜索靠前 · 优先展示 · 推荐展示 · 加快出售</p>
        <ul>
          <li
            v-for="(item,index) in list"
            :class="active==index?'lion':'linone'"
            :key="index"
            @click="select(index,item)"
          >
            <p>{{item.day}}</p>
            <p class="money">售价{{item.money}}元</p>
          </li>
        </ul>
      </div>
      <van-goods-action>
        <van-goods-action-icon>
          <p class="count">
            合计：
            <span>￥{{count}}</span>
          </p>
        </van-goods-action-icon>
        <van-goods-action-button
          @click="showPay=true"
          color="linear-gradient(to bottom, #6574FF, #7065FF)"
          text="支付"
        />
      </van-goods-action>
    </div>
    <van-dialog v-model="showPay" :show-confirm-button="false" style="padding:15px;">
      <div class="payTitle">
        <van-icon name="cross" @click="showPay=false" class="close" />选择支付方式
      </div>
      <p class="num">
        ￥
        <span>{{count}}</span>
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
            <van-radio slot="right-icon" :disabled="Math.floor(lines)<count" :name="0" />
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
  name: "orderStatus",
  data() {
    return {
      time: 30 * 60 * 60 * 1000,
      imgUrl: this.$global.imgUrl,
      list: [
        { day: "1天", money: '10.00' },
        { day: "2天", money: '18.00' },
        { day: "3天", money: '25.00' },
        { day: "5天", money: '42.00' },
        { day: "7天", money: '60.00' },
        { day: "10天", money: '80.00' }
      ],
      count: '10.00',
      data: {},
      active: 0,
      type: 0,
      showPay: false,
      show: false,
      loading: false,
      showKeyboard: true,
      lines: "",
      payPwd: "",
      payType: 0
    };
  },
  created() {
    this.data = JSON.parse(localStorage.getItem("topGoods"));
    if (this.$route.query.title != "number") {
      this.type = 1;
    }
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
    //密码输入事件
    onInput(key) {
      this.payPwd = (this.payPwd + key).slice(0, 6);
      if (this.payPwd.length == 6) {
        this.show = false;
        this.loading = true;
        this.pay();
      }
    },
    //删除密码
    onDelete() {
      this.payPwd = this.payPwd.slice(0, this.payPwd.length - 1);
    },
    showPopup() {
      // 当支付方式为余额时弹出自定义密码框
      if (this.payType == 0) {
        this.show = true;
      }
    },
    //支付接口
    pay() {
      this.$axios({
        url: this.$global.url + "api/number/isStick" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            mid: localStorage.getItem("mid"),
            pay_pwd: this.payPwd,
            price: this.count,
            goods: this.type ? "gift" : "number",
            goods_id: this.data.id
          }
        })
      })
        .then(res => {
          this.loading = false;
          this.payPwd = "";
          if (res.data.code == 1) {
            this.showPay=false
            this.$notify({
              message: res.data.msg,
              type: "success",
              duration: 1000
            });
            this.back()
          } else {
            this.$notify({
              message: res.data.msg,
              type: "danger",
              duration: 1000
            });
          }
        })
        .catch(e => {
           this.loading=false
           this.payPwd = "";
          this.$notify({
            message: "网络较差，请稍后重试",
            type: "danger",
            duration: 1000
          });
        });
    },
    back() {
      this.$router.back(-1);
    },
    select(index, item) {
      this.active = index;
      this.count = item.money;
    }
  }
};
</script>
<style scoped>
.main {
  padding: 0.15rem;
}
.main > p {
  text-align: center;
}
.main > ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 0.44rem;
}
.main > ul > li {
  text-align: center;
  width: 1.09rem;
  height: 0.54rem;
  border-radius: 10px;
  margin-bottom: 10px;
}
.linone {
  border: 1px solid rgba(51, 51, 51, 0.1);
}
.lion {
  color: #696fff;
  background: rgba(105, 111, 255, 0.2);
  border: 1px solid transparent;
}
.main > ul > li p {
  line-height: 0.28rem;
}
.main > ul > li .money {
  color: #696fff;
  font-size: 0.12rem;
}
.item {
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 15px;
  background: #fff;
}
.itemInfo {
  padding: 0.15rem 0.15rem;
  display: flex;
}
.info {
  flex: 1;
  padding-left: 0.15rem;
}
.infoImg {
  border: 1px solid rgba(51, 51, 51, 0.1);
  box-sizing: border-box;
}
.infoTitle {
  font-size: 0.13rem;
  font-weight: 600;
  color: #333333;
  line-height: 0.2rem;
  height: 0.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.total {
  font-size: 0.11rem;
  color: #999;
}
.total b {
  font-size: 0.15rem;
  color: #ff3131;
}
.num1 {
  float: right;
  line-height: 0.2rem;
}
.tag {
  padding: 0.03rem 0;
}
.itemBtn {
  padding: 0 0.15rem 0.15rem 1rem;
  text-align: right;
}
.countDown {
  width: 100%;
  height: 0.31rem;
  font-size: 0.14rem;
  color: #ffffff;
  line-height: 0.31rem;
  text-align: center;
  border-radius: 5px;
  margin-bottom: 0.15rem;
}
.bgRed {
  background: #ff3131;
}
.bgBlue {
  background: #696fff;
}
.time {
  color: #ffffff;
  display: inline;
}
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
</style>