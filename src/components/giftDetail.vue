<template>
  <div>
    <div class="head">
      <p>
        <img src="./../assets/common/back.png" alt class="back" @click="back" />
      </p>
      <p>{{title}}</p>
      <p>交易过程请截图存证</p>
    </div>
    <div class="list">
      <ul>
        <li>
          <van-image
            lazy-load
            width="85px"
            height="85px"
            radius="10px"
            :src="gift.img==null?'':img+gift.img[0]"
          />
          <div class="cardInfo">
            <div class="info_2">
              <span class="title">{{gift.gift_name}}</span>
              <span class="time">{{gift.pay_time}}</span>
            </div>
            <div class="info_3">
              <b>￥{{gift.price}}</b>
              <span>{{gift.count}} 件</span>
            </div>
          </div>
        </li>
      </ul>
      <div class="detal">
        <van-cell-group style="border-radius:10px;overflow: hidden;">
          <van-cell title="游戏ID" :value="gift.game_number" value-class="color"></van-cell>
          <van-cell title="昵称" :value="gift.game_name" value-class="color"></van-cell>
          <van-cell
            title="性别"
            is-link
            :border="false"
            :value="gift.sex==0?'无':gift.sex==1?'男':'女'"
            value-class="color"
          ></van-cell>
        </van-cell-group>
      </div>
      <div class="explain">
        <p>购买说明</p>
        <p class="num">1：请输入正确的皮皮蟹ID, 昵称，性别，方便卖家通过皮皮蟹平台把礼 物送给您。</p>
        <p class="num">2：如果交易过程中遇到欺诈，欺骗等行为问题可以联系玩号吧客服进 行解决。客服核实后将进行严重处罚。</p>
        <p class="num">3：建议买家和卖家在礼物交易过程中全程截图，或录视频来留取凭证 保护自身权益。</p>
      </div>
    </div>
    <van-goods-action v-if="type==1" style="padding:10px">
      <van-goods-action-button
        color="linear-gradient(to bottom, #6574FF, #7065FF)"
        text="我已发货"
        @click="supply"
      />
    </van-goods-action>
    <van-goods-action v-else>
      <van-goods-action-icon v-if="fahuo">
        <p class="count" @click="memberStatus(2)">未收到货？</p>
      </van-goods-action-icon>
      <van-goods-action-button
        :disabled="!fahuo"
        :color="fahuo?'linear-gradient(to bottom, #6574FF, #7065FF)':'#999999'"
        style="width:1.79rem"
        text="确认收货"
        @click="memberStatus(4)"
      />
    </van-goods-action>
  </div>
</template>
<script>
export default {
  name: "giftDetail",
  data() {
    return {
      fahuo: false,
      gift: "",
      order_id: "",
      img: this.$global.imgUrl,
      title: "",
      type: 0 // 0买家 1买家
    };
  },
  mounted() {
    // gift.status  订单状态 0待付款，1商家已发货 ，2用户未收货，3已购买，4完成
    this.type = this.$route.query.type;
    this.order_id = this.$route.query.id;
    this.getGiftDetail();
  },
  methods: {
    back() {
      this.$router.back(-1);
    },
    //卖家供应
    supply() {
      this.$dialog
        .confirm({
          title: "您确定已发货了吗？",
          message: "虚假发货将会受到处罚！！！"
        })
        .then(() => {
          this.$axios({
            url: this.$global.url + "api/giftOrder/merchStatus" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              sell_mid: localStorage.getItem("mid"),
              gift_id: this.gift.id
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.title = "已发货";
                this.$notify({
                  message: "供货成功",
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
              this.$notify({
                message: "网络较差，请稍后重试！",
                type: "danger"
              });
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    //买家货物状态判断
    memberStatus(sta) {
      //2未收到货 4收到货
      let mes = "";
      let mes1 = "";
      if (sta == 2) {
        mes = "您确定未收到货吗？";
        mes1 = "虚假未收货将会受到处罚！！！";
      } else if (sta == 4) {
        mes = "";
        mes1 = "您确定已收到货了吗？";
      }
      this.$dialog
        .confirm({
          title: mes,
          message: mes1
        })
        .then(() => {
          this.$axios({
            url: this.$global.url + "api/giftOrder/memberStatus" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              buy_mid: localStorage.getItem("mid"),
              gift_id: this.gift.id,
              status: sta
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.$notify({
                  message: "提交成功",
                  type: "success"
                });
                if (sta == 2) {
                  this.$router.push({
                    path: "/giftSuccess",
                    query: { id: "", title: 6 }
                  });
                } else if (sta == 4) {
                  this.$router.push({
                    path: "/giftSuccess",
                    query: { id: "", title: 5 }
                  });
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
        })
        .catch(() => {
          // on cancel
        });
    },
    //订单详情
    getGiftDetail() {
      this.$axios({
        url: this.$global.url + "api/giftOrder/getOrder" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          order_id: this.order_id
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.gift = res.data.data;
            //判断是1卖家 0 买家
            if (this.type == 1) {
              if (this.gift.status == 3 || this.gift.status == 0) {
                this.title = "买家已付款，赶紧发货吧";
              } else if (this.gift.status == 1) {
                this.title = "已发货";
              } else if (this.gift.status == 2) {
                this.title = "已发货,但买家未收到货！！";
              }
            } else {
              if (this.gift.status == 1) {
                this.title = "卖家已发货";
                this.fahuo = true;
              } else if (this.gift.status == 3) {
                this.title = "等待卖家发货";
              }
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
            message: "网络较差，请稍后重试",
            type: "danger"
          });
        });
    }
  }
};
</script>
<style scoped>
.head {
  background: #696fff;
  color: white;
  padding: 0.15rem;
}
.list {
  padding: 0.15rem;
  padding-top: 0;
  margin-bottom: 0.6rem;
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
.info_3 {
  display: flex;
  justify-content: space-between;
  padding-top: 0.35rem;
}
.info_3 b {
  color: #ff3131;
  font-size: 15px;
  padding-right: 15px;
}
.time {
  font-size: 12px;
  color: rgba(51, 51, 51, 0.4);
}
.info_2 {
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  line-height: 30px;
}
.info_3 span {
  color: rgba(51, 51, 51, 0.4);
}
.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: bold;
}
.color {
  color: #333;
}
.back {
  width: 0.19rem;
  margin: 0.15rem 0 0.19rem;
}
.head > p:nth-of-type(2) {
  font-size: 0.2rem;
}
.head > p:nth-of-type(3) {
  font-size: 0.12rem;
  margin-top: 5px;
}
.explain {
  text-align: justify;
  margin-top: 0.15rem;
  font-size: 0.12rem;
}
.explain .num {
  margin-top: 0.1rem;
  text-indent: 0.15rem;
}
.count {
  text-align: right;
  margin-left: 0.16rem;
  font-size: 0.14rem;
  color: #333;
  margin-right: 0.2rem;
}
.van-goods-action {
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
}
</style>