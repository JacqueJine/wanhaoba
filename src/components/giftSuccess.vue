<template>
  <div class="success">
    <p>
      <van-icon name="checked" color="#696fff" size="1rem" />
    </p>
    <p class="tishi">{{type==1?"供应成功":type==0?"求购成功":type==2?"出售成功":type==3?"购买成功":type==6?"提交成功":""}}</p>
    <p
      class="ti"
    >{{type==1?"请查看订单，给买家发礼物":type==3?"等待卖家发货，请关注皮皮蟹内礼物":type==0 || type==2?"等待平台审核,请在礼物管理-->待审核页面查看进度,发布宝贝之后客服会在3小时之内给您来电":type==6?"等待卖家审核":""}}</p>
    <p v-if="type==1 || type==3" @click="toGiftDetail">查看订单</p>
    <van-goods-action>
      <van-goods-action-button
        color="linear-gradient(to bottom, #6574FF, #7065FF)"
        text="返回首页"
        to="/index"
      />
    </van-goods-action>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: "",
      type: 0, //0求购成功 1供应成功 2出售成功 3购买成功 5收货成功  6未收到货
      sell_type: 0, //0 买家  1卖家
      gift_id: ""
    };
  },
  mounted() {
    this.type = this.$route.query.title;
    this.gift_id = this.$route.query.id;
    if (this.$route.query.title == 0 || this.$route.query.title == 3) {
      this.sell_type = 0;
    } else if (this.$route.query.title == 1) {
      this.sell_type = 1;
    }
  },
  methods: {
    toGiftDetail() {
      this.$router.push({
        path: "/giftDetail",
        query: { id: this.gift_id, type: this.sell_type }
      });
    }
  }
};
</script>
<style scoped>
.success {
  text-align: center;
  padding:0 .20rem;
}
p:nth-of-type(1) {
  padding: 0.9rem 0 0.4rem;
}
.tishi {
  font-size: 0.2rem;
}
.ti {
  font-size: 0.12rem;
  color: rgba(51, 51, 51, 0.6);
  margin-top: 10px;
}
.van-goods-action {
  bottom: 15px;
}
</style>