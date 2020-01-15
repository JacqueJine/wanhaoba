<template>
  <div class="buy_ppxgift" v-if="gift">
    <van-nav-bar title="订单信息" left-arrow @click-left="back()"></van-nav-bar>
    <div class="list">
      <ul>
        <li>
          <van-image lazy-load width=".85rem" height=".85rem" radius="10px" :src="image==null?'':img+image[0]" />
          <div class="cardInfo">
            <div class="info_1">
              <div>
                <van-tag
                  :color="gift.mid=='平台'?'#7065FF':typeof(gift.mid)=='object'?'#5AD27C':'#F1BF3D'"
                  class="tagRight"
                >{{gift.mid=='平台'?'平台':typeof(gift.mid)=='object'?"商家":"个人"}}</van-tag>
                <b>{{gift.mid=='平台'?'平台自营':typeof(gift.mid)=='object'?gift.mid.name:gift.mid}}</b>
              </div>
              <span>{{gift.addTime}}</span>
            </div>
            <div class="info_2">
              <p class="title">{{gift.name_id}}</p>
            </div>
            <div class="info_3">
              <b>￥{{gift.price}}</b>
              <span>剩余 {{gift.gift_number}} 件</span>
            </div>
          </div>
        </li>
      </ul>
      <div class="detal">
        <van-cell-group style="border-radius:10px;overflow: hidden;">
          <van-cell title="游戏ID">
            <template slot="default">
              <input type="text" placeholder="请输入" v-model="game_id" />
            </template>
          </van-cell>
          <van-cell title="昵称">
            <template slot="default">
              <input type="text" placeholder="请输入" v-model="name" />
            </template>
          </van-cell>
          <van-cell title="性别" is-link :border="false" :value="sex.value" @click="showPop"></van-cell>
        </van-cell-group>
      </div>
      <div class="explain">
        <p>购买说明</p>
        <p class="num1">1：请输入正确的皮皮蟹ID, 昵称，性别，方便卖家通过皮皮蟹平台把礼 物送给您。</p>
        <p class="num1">2：如果交易过程中遇到欺诈，欺骗等行为问题可以联系玩号吧客服进 行解决。客服核实后将进行严重处罚。</p>
        <p class="num1">3：建议买家和卖家在礼物交易过程中全程截图，或录视频来留取凭证 保护自身权益。</p>
      </div>
      <van-goods-action>
        <van-goods-action-icon>
          <p class="count">
            合计：
            <span>￥{{gift.price}}</span>
          </p>
        </van-goods-action-icon>
        <van-goods-action-button
          color="linear-gradient(to bottom, #6574FF, #7065FF)"
          text="支付"
          @click="pay"
        />
      </van-goods-action>
    </div>
    <van-popup v-model="showSex" position="bottom" :style="{ height: '30%' }">
      <van-picker
        show-toolbar
        :default-index="0"
        @cancel="onCancel"
        :columns="columns"
        @confirm="onConfirm"
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
  name: "buy_ppxgift",
  data() {
    return {
      gift: "",
      game_id: "",
      name: "",
      sex: {
        value: "无",
        type: 0
      },
      columns: ["无", "男", "女"],
      showSex: false,
      showPay: false,
      radio: 1,
      lines: "",
      total: 0,
      show: false,
      payPwd: "",
      showKeyboard: true,
      img: this.$global.imgUrl,
      payType: 0,
      loading: false,
      image: [],
      order_id:"",
    };
  },
  mounted() {
    this.goDetail();
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
    //支付接口
    giftPay() {
      this.$axios({
        url: this.$global.url + "api/giftOrder/giftPayOrder" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            mid: localStorage.getItem("mid"),
            sell_mid: this.gift.sell_mid,
            pay_pwd: this.payPwd,
            price: this.total,
            pay_type: this.payType,
            order_id: this.order_id,
            gift_id:this.$route.query.id,
            count:1,
          }
        })
      })
        .then(res => {
          this.loading = false;
          if (res.data.code == 1) {
            this.showPay = false;
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
        this.giftPay();
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
    },
    back() {
      this.$router.back(-1);
    },
    onConfirm(value, index) {
      this.sex.value = value;
      this.sex.type = index;
      this.showSex = !this.showSex;
    },
    onCancel() {
      this.showSex = !this.showSex;
    },
    showPop() {
      this.showSex = !this.showSex;
    },
    // 创建礼物购买订单
    pay() {
      this.total = this.gift.price;
      if (this.game_id == "") {
        this.$notify({
          message: "游戏id不能为空！！",
          type: "danger"
        });
        return false;
      } else if (this.name == "") {
        this.$notify({
          message: "游戏昵称不能为空！！",
          type: "danger"
        });
        return false;
      } else {
        this.$axios({
          url: this.$global.url + "api/giftOrder/createOrder" + ".html",
          method: "POST",
          data: this.$qs.stringify({
            data: {
              mid: localStorage.getItem("mid"),
              price: this.gift.price,
              is_buy: 0,
              remark: "",
              gift_id: this.$route.query.id,
              game_number: this.game_id,
              game_name: this.name,
              game_sex: this.sex.type,
              count: 1,
              sell_mid: this.gift.sell_mid
            }
          })
        })
          .then(res => {
            if (res.data.code == 1) {
              this.showPay = !this.showPay;
              this.order_id=res.data.gift_id;
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
    },
    payBox() {
      this.showPay = !this.showPay;
    },
    goPaySuccess() {
      this.$router.push({ path: "/giftSuccess", query:{id:this.order_id,title:3}});
    },
    //获取单个礼物详情
    goDetail() {
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
            this.image = res.data.data.img;
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
.buy_ppxgift {
  background: rgba(245, 245, 245, 1);
  min-height: 100vh;
}
.list {
  padding: 0.15rem;
}
.list li {
  background: #fff;
  border-radius: 10px;
  display: flex;
  padding: 0.15rem;
}
.cardInfo {
  font-size: 12px;
  padding-left: 10px;
  flex: 1;
}
.info_1 {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  align-items: center;
}
.info_1 b {
  padding-left: 5px;
  font-weight: 400;
  color: rgba(51, 51, 51, 0.8);
}

.info_3 {
  display: flex;
  justify-content: space-between;
  padding-top: 0.05rem;
}
.info_3 b {
  color: #ff3131;
  font-size: 15px;
  padding-right: 15px;
}
.info_2 {
  font-size: 13px;
  font-weight: bold;
  line-height: 30px;
}
.info_3 span {
  color: rgba(51, 51, 51, 0.4);
}
.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
input {
  border: none;
  text-align: right;
  width: 100%;
}
.detal,
.explain {
  text-align: justify;
  margin-top: 0.15rem;
}
.explain .num1 {
  margin-top: 0.1rem;
  text-indent: 0.15rem;
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