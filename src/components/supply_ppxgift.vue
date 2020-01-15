<template>
  <div class="buy_ppxgift">
    <van-nav-bar title="订单信息" left-arrow @click-left="back()"></van-nav-bar>
    <div class="list">
      <ul>
        <li>
          <van-image
            lazy-load
            width="85px"
            height="85px"
            radius="10px"
            :src="require('../assets/merchant/tou.png')"
          />
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
              <!-- <p>供应 <van-stepper v-model="value" min="1" :max="gift.ask_sum" /> 件</p> -->
            </div>
            <!-- <p style="display:flex;align-tiems:center"></p> -->
            <div class="info_4">
              供应 <van-stepper v-model="value" min="1" :max="gift.ask_sum" /> 件
            </div>
          </div>
        </li>
      </ul>
      <!-- <div class="detal">
        <van-cell-group style="border-radius:10px;overflow: hidden;">
          <van-cell title="游戏ID" :value="gift.askuser_id"></van-cell>
          <van-cell title="昵称" :value="gift.askuser_name"></van-cell>
          <van-cell title="性别" is-link :border="false" :value="gift.askuser_sex==0?'无':gift.askuser_sex==1?'男':'女'"></van-cell>
        </van-cell-group>
      </div>-->
      <div class="explain">
        <p>供应说明</p>
        <p class="num">1：</p>
        <p class="num">2：</p>
        <p class="num">3：</p>
      </div>
      <van-goods-action>
        <van-goods-action-button
          color="linear-gradient(to bottom, #6574FF, #7065FF)"
          text="提交订单"
          @click="goPaySuccess"
        />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
export default {
  name: "buy_ppxgift",
  data() {
    return {
      gift: [],
      value:"",
    };
  },
  mounted() {
    this.goDetail();
  },
  methods: {
    back() {
      this.$router.back(-1);
    },
    goPaySuccess() {
      // 创建供货订单
      this.$axios({
        url: this.$global.url + "api/giftOrder/createOrder" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            mid: this.gift.mid.mid,
            sell_mid: localStorage.getItem("mid"),
            price: this.gift.price,
            is_buy: 2,
            remark: "",
            gift_id: this.gift.id,
            game_number: this.gift.askuser_id,
            game_name: this.gift.askuser_name,
            game_sex: this.gift.askuser_sex,
            count: this.value,
            // pay_type: this.payType
          }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.$router.push({
              path: "/giftSuccess",
              query: { title: 1, id: this.gift.id }
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
          } else if (res.data.code == 0) {
            this.gift = [];
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
          console.log(e);
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
.info_4 {
  display: flex;
  justify-content:flex-end;
  align-items: center;
  padding-top: 0.05rem;
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
.explain .num {
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
.close {
  position: absolute;
  top: 0;
  left: 0;
  line-height: 0.2rem;
}
.payTitle {
  text-align: center;
  position: relative;
}
.num1 {
  text-align: center;
  font-size: 0.22rem;
  font-weight: bold;
  padding: 15px 0;
}
.num1 span {
  font-size: 0.48rem;
}
.van-goods-action {
  padding: 7px 15px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
}
</style>