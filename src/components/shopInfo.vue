<template>
  <div class="bgColor">
    <div class="header">
      <van-nav-bar :border="false" title="商家保障" left-arrow @click-left="back()">
        <!-- <van-tag type="success" slot="right" @click='goOpenShop()'>我要开店</van-tag> -->
        <!-- <span slot="right">保存</span> -->
      </van-nav-bar>
    </div>
    <div class="main">
      <ul>
        <li>
          <van-image lazy-load width=".70rem" height=".70rem" radius="10px" :src="imgurl+logo" />
          <div class="cardInfo">
            <h3>
              {{shop.title}}
              <van-icon name="share" color="#333" />
            </h3>
            <div class="info">
              <van-icon name="warning" size=".15rem" style="margin-right:5px" />等级：
              <van-icon v-if="shop.level_id==1" name="star" color="#FFA300" />
              <van-icon
                v-else-if="shop.level_id==2"
                :name="require('../assets/merchant/yueliang.png')"
              />
              <van-icon
                v-else-if="shop.level_id==3"
                :name="require('../assets/merchant/taiyang.png')"
              />
              <van-icon
                v-else-if="shop.level_id==4"
                :name="require('../assets/merchant/huangguan.png')"
              />
              <van-icon
                v-else-if="shop.level_id==5"
                :name="require('../assets/merchant/baoding.png')"
              />
            </div>
          </div>
        </li>
        <li>
          <van-row class="row">
            <van-col span="12">实名认证</van-col>
            <van-col class="textRight" span="12">
              <van-image
                width=".43rem"
                height=".17rem"
                lazy-load
                :src="require('../assets/common/yirenzheng.png')"
              />
            </van-col>
          </van-row>
        </li>
        <li>
          <van-row class="row">
            <van-col span="12">手机认证</van-col>
            <van-col class="textRight" span="12">
              <van-image
                width=".43rem"
                height=".17rem"
                lazy-load
                :src="require('../assets/common/yirenzheng.png')"
              />
            </van-col>
          </van-row>
        </li>
        <li>
          <van-row class="row">
            <van-col span="12">质保金</van-col>
            <van-col class="textRight" span="12">{{shop.quality}}元</van-col>
          </van-row>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
// import tabbar from "./public/tabbar.vue";
export default {
  name: "merchant",

  data() {
    return {
      shop: "",
      imgurl: this.$global.imgUrl,
      logo: ""
    };
  },
  mounted() {
    this.getShop();
    // this.shop = this.$route.query.shop;
    // setTimeout(() => {
    //   this.logo = this.$route.query.shop.logo;
    // }, 2000);
  },
  methods: {
    back() {
      if (this.$route.query.type == 1) {
        this.$router.push({
          path: "/shopDetail",
          query: { shop: this.shop.mid }
        });
      } else {
        this.$router.push({
          path: "/seller",
        });
      }
    },
    getShop() {
      this.$axios({
        url: this.$global.url + "api/merch/getMerch" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          mid: this.$route.query.shop
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.shop = res.data.data;
            this.logo = res.data.data.logo;
          } else {
            this.$notify({
              message: res.data.msg,
              type: "danger"
            });
          }
        })
        .catch(e => {
          this.$notify({
            message: "网络较差，请稍后重试！!!!",
            type: "danger"
          });
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bgColor {
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
}
.header {
  padding: 7px 0;
  background: #fff;
}
.main {
  padding: 15px;
}
.main li {
  padding: 15px 15px 12px;
  background: #fff;
  border-radius: 10px;
  display: flex;
  margin-bottom: 15px;
}
.cardInfo {
  font-size: 0.12rem;
  padding-left: 10px;
  flex: 1;
}
.cardInfo h3 {
  font-size: 0.14rem;
  line-height: 0.35rem;
}
.info {
  line-height: 0.35rem;
  display: flex;
  align-items: center;
}
.textRight {
  text-align: right;
}
.row {
  width: 100%;
  font-size: 0.14rem;
}
</style>
