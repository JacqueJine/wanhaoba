<template>
  <div class="order">
    <van-nav-bar
      :border="false"
      title="订单信息"
      left-arrow
      @click-left="back()"
      style="position:fixed;top:0;width:100%;"
    />
    <van-tabs
      v-model="activeName"
      :border="false"
      line-width="15px"
      color="#6C6AFF"
      @click="changeTab"
    >
      <van-tab v-for="(item,index) in tab" :title="item.name" :name="item.value" :key="index">
        <div v-if="activeName === 0" class="main">
          <div v-for="(item,index) in giftOrder" :key="index">
            <van-panel class="item">
              <div class="itemInfo">
                <van-image
                  class="infoImg"
                  width=".85rem"
                  height=".85rem"
                  lazy-load
                  radius="10px"
                  :src="item.img==null?'':img+item.img[0]"
                />
                <div class="info">
                  <li class="infoTitle">
                    <van-tag
                      :color="item.is_buy?'#5ad27c':'#FF3131' "
                      class="tagRight"
                    >{{item.is_buy?"求购":"出售"}}</van-tag>
                    <span>{{item.gift_name}}</span>
                  </li>
                  <li class="total">
                    <b>￥{{item.price}}</b>
                    <span class="num">{{item.count}}件</span>
                  </li>
                </div>
              </div>
              <div slot="footer" class="itemBtn">
                <van-button plain size="small" style="margin-right:10px" round type="danger" @click="delOrder(item.id)">删除</van-button>
                <van-button plain size="small" round color="#696FFF" @click="toPay(item.id)">付款</van-button>
              </div>
            </van-panel>
          </div>
        </div>
        <div v-else-if="activeName === 3" class="main">
          <!-- 礼物 -->
          <div v-for="(item,index) in giftOrder" :key="index">
            <van-panel class="item">
              <div class="itemInfo">
                <van-image
                  class="infoImg"
                  width=".85rem"
                  height=".85rem"
                  lazy-load
                  radius="10px"
                  :src="img+item.img[0]"
                />
                <div class="info">
                  <li class="infoTitle">
                    <van-tag
                      :color="item.is_buy?'#5ad27c':'#FF3131' "
                      class="tagRight"
                    >{{item.is_buy?"求购":"出售"}}</van-tag>
                    <span>{{item.gift_name}}</span>
                  </li>
                  <li class="total">
                    <b>￥{{item.price}}</b>
                    <span class="num">{{item.count}}件</span>
                  </li>
                </div>
              </div>
              <div slot="footer" class="itemBtn">
                <van-button plain size="small" style="margin-right:10px" round type="danger" @click="delOrder(item.id)">删除</van-button>
                <van-button plain size="small" round color="#696FFF" @click="lookDetail(item.id)">查看</van-button>
              </div>
            </van-panel>
          </div>
        </div>
        <div v-else-if="activeName === 4" class="main">
          <div v-for="(item,index) in giftOrder" :key="index">
            <van-panel class="item">
              <div class="itemInfo">
                <van-image
                  class="infoImg"
                  width=".85rem"
                  height=".85rem"
                  lazy-load
                  radius="10px"
                  :src="img+item.img[0]"
                />
                <div class="info">
                  <li class="infoTitle">
                    <van-tag
                      :color="item.is_buy?'#5ad27c':'#FF3131' "
                      class="tagRight"
                    >{{item.is_buy?"求购":"出售"}}</van-tag>
                    <span>{{item.gift_name}}</span>
                  </li>
                  <li class="total">
                    <b>￥{{item.price}}</b>
                    <span class="num">{{item.count}}件</span>
                  </li>
                </div>
              </div>
              <div slot="footer" class="itemBtn">
                <van-button plain size="small" style="margin-right:10px" round type="danger" @click="delOrder(item.id)">删除</van-button>
                <!-- <van-button plain size="small" round color="#F2A638">售后</van-button> -->
              </div>
            </van-panel>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: "MineOrder",
  data() {
    return {
      activeName: 0,
      tab: [
        { name: "待付款", value: 0 },
        { name: "已购买", value: 3 },
        { name: "完成", value: 4 }
      ],
      time: 30 * 60 * 60 * 1000,
      giftOrder: [],
      img: this.$global.imgUrl,
      is_seller: 0
    };
  },
  mounted() {
    this.activeName = this.$route.query.value;
    this.is_seller = this.$route.query.is_seller;
    this.getGiftOrder();
    document.getElementsByClassName("van-tabs__wrap")[0].style.cssText =
      "position: fixed;width: 100%;top: 46px;z-index: 20;";
  },
  methods: {
    back() {
      this.$router.back(-1);
    },
    changeTab() {
      this.getGiftOrder();
    },
    //去付款
    toPay(itemid) {
      
    },
    //查看订单详情
    lookDetail(item) {
      this.$router.push({ path: "/giftDetail", query: { id: item } });
    },
    getGiftOrder() {
      this.giftOrder = [];
      this.$axios({
        url: this.$global.url + "api/giftOrder/orderList" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          mid: this.$global.getToken("mid"),
          goods: "gift",
          status: this.activeName,
          is_seller: this.is_seller
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.giftOrder = res.data.data;
          } else if (res.data.code == 0) {
            this.giftOrder = [];
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
    },
    //删除订单
    delOrder(id) {
      this.$dialog
        .confirm({
          title: "删除",
          message: "确定要删除吗？此过程不可逆！！！"
        })
        .then(() => {
          this.$axios({
            url: this.$global.url + "api/giftOrder/delOrder" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              goods: "gift",
              order_id: id
            })
          })
            .then(res => {
              if (res.data.code == 1) {
               this.getGiftOrder();
                this.$notify({
                  message: res.data.msg,
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
    }
  }
};
</script>
<style scoped>
.order {
  width: 100%;
  min-height: 100vh;
  background: rgba(245, 245, 245, 1);
}
.main {
  padding: 0.15rem;
}
.item {
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 15px;
}
.itemInfo {
  padding: 0 0.15rem;
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
}
.title {
  display: flex;
  align-items: center;
}
.name {
  color: rgba(51, 51, 51, 0.8);
  font-size: 0.11rem;
  padding: 0 0.05rem;
}
.total {
  margin-top: 0.5rem;
  font-size: 0.11rem;
  color: #999;
}
.total b {
  font-size: 0.15rem;
  color: #ff3131;
}
.num {
  float: right;
  line-height: 0.2rem;
}
.tag {
  padding: 0.03rem 0;
}
.itemBtn {
  padding-top: 0.15rem;
  padding-left: 1rem;
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

.main {
  padding-top: 105px;
}
</style>