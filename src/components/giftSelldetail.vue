<template>
  <div>
    <div class="head">
      <p>
        <img src="./../assets/common/back.png" alt class="back" @click="back" />
      </p>
      <p>买家已付款，赶紧去发货吧</p>
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
            :src="require('../assets/merchant/tou.png')"
          />
          <div class="cardInfo">
            <div class="info_2">
              <span class="title">小章鱼</span>
              <span class="time">1分钟前</span>
            </div>
            <div class="info_3">
              <b>￥15</b>
              <span>1 件</span>
            </div>
          </div>
        </li>
      </ul>
      <div class="detal">
        <van-cell-group style="border-radius:10px;overflow: hidden;">
          <van-cell title="游戏ID" value="123" value-class="color"></van-cell>
          <van-cell title="昵称" value="234" value-class="color"></van-cell>
          <van-cell title="性别" is-link :border="false" value="男" value-class="color"></van-cell>
        </van-cell-group>
      </div>
      <div class="explain">
        <p>购买说明</p>
        <p class="num">1：请输入正确的皮皮蟹ID, 昵称，性别，方便卖家通过皮皮蟹平台把礼 物送给您。</p>
        <p class="num">2：如果交易过程中遇到欺诈，欺骗等行为问题可以联系玩号吧客服进 行解决。客服核实后将进行严重处罚。</p>
        <p class="num">3：建议买家和卖家在礼物交易过程中全程截图，或录视频来留取凭证 保护自身权益。</p>
      </div>
    </div>
    <van-goods-action>
      <van-goods-action-button
        color="linear-gradient(to bottom, #6574FF, #7065FF)"
        style="width:1.79rem"
        text="我已发货"
        @click="show=!show"
      />
    </van-goods-action>
    <van-popup v-model="show">
      <div class="popup_">
        <p>您确定已发货了吗？</p>
        <p>虚假发货将会受到处罚</p>
        <div>
            <van-button style="width:1.25rem;margin-right:5px" size="small" round color="#FF7B7B" @click="show=!show">取消</van-button>
            <van-button style="width:1.25rem" size="small" round color="#696FFF">取消</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
export default {
  name: "giftDetail",
  data() {
    return {
      show: false
    };
  },
  mounted() {},
  methods: {
    back() {
      this.$router.back(-1);
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
.van-goods-action {
  padding: 7px 15px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
}
.popup_{
    width:3rem;
    height:1.5rem;
    padding:15px 20px;
    text-align:center;
    box-sizing: border-box;
}
.popup_>p:nth-of-type(1){
    font-size: 18px;
    margin:7px 0 5px 0;
}
.popup_>p:nth-of-type(2){
    font-size: 12px;
}
.popup_>div{
    margin-top:25px;
}
</style>