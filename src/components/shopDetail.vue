<template>
  <div>
    <van-sticky>
      <div class="header">
        <!-- <img class="bg" :src="imgurl+logo" alt="背景" /> -->
        <!-- <div class="drag"> -->
        <van-nav-bar class="navBar" left-arrow @click-left="back()" :border="false">
          <van-search
            slot="title"
            left-icon="none"
            style="height:.46rem;"
            background="transparent"
            v-model="search"
            @search="onSearch"
            @blur="onBlur"
            placeholder="请输入搜索关键词"
            shape="round"
          ></van-search>
          <van-icon
            slot="right"
            :name="require('../assets/shop/fenxiang.png')"
            color="#fff"
            size=".20rem"
          />
        </van-nav-bar>
        <div class="shopInfo">
          <van-image
            width=".50rem"
            height=".50rem"
            lazy-load
            :src="imgurl+shop.logo"
            radius="10px"
          />
          <div class="infoBox">
            <div class="info_1">
              {{shop.title}}
              <span style="float:right" @click="goShopInfo()">
                <van-icon size=".18rem" :name="require('../assets/index/bao.png')" />
                <van-icon size=".18rem" :name="require('../assets/index/shou.png')" />
                <van-icon size=".18rem" :name="require('../assets/index/shi.png')" />
              </span>
            </div>
            <div class="info_2">
              等级：
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
              &nbsp;&nbsp;销量：{{shop.sales}}
            </div>
          </div>
        </div>
        <van-row>
          <van-col span="16">
            <van-dropdown-menu class="pullDown">
              <van-dropdown-item
                class="option"
                v-model="value1"
                :options="option1"
                @change="changeTab"
              />
              <van-dropdown-item
                class="option"
                v-model="value2"
                :options="option2"
                @change="changeTab"
              />
            </van-dropdown-menu>
          </van-col>
          <van-col
            span="8"
            style="height:.50rem;line-height:.50rem;text-align:center;font-size:.15rem;"
            @click="sortPrice"
          >
            价格
            <van-icon :name="img" />
          </van-col>
        </van-row>
        <!-- </div> -->
      </div>
    </van-sticky>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="(item,index) in list" class="vanlist" :key="index">
          <div class="list" @click="goDetail(item.id,item.is_sell,item.is_out)">
            <div class="item">
              <div class="imgGroup">
                <van-image
                  width=".85rem"
                  height=".85rem"
                  lazy-load
                  radius="15px"
                  :src="imgurl+item.img[0]"
                />
                <div class="chuzu" v-if="item.is_out&&item.is_out != 2">
                  <p>出租中</p>
                  <p>倒计时</p>
                  <p>
                    <van-count-down :time="item.count_down" style="color:#FFF" />
                  </p>
                </div>
                <div class="chuzu" v-if="item.is_sell&&item.is_out != 2">
                  <p>已出售</p>
                </div>
                <div class="chuzu" v-if="item.is_out == 2">
                  <p>账号改密中</p>
                </div>
                <van-image
                  class="icon"
                  width=".35rem"
                  height=".24rem"
                  lazy-load
                  v-if="item.phone_id=='ios'"
                  :src="require('../assets/shop/ios.png')"
                />
                <van-image
                  class="icon"
                  width=".35rem"
                  height=".24rem"
                  lazy-load
                  v-if="item.phone_id=='安卓'"
                  :src="require('../assets/shop/and.png')"
                />
              </div>
              <div style="flex: 1;">
                <van-row>
                  <van-col span="16" class="dec">{{item.title}}</van-col>
                  <van-col span="8">
                    <p class="price">￥{{item.price}}</p>
                    <p class="spe" v-if="item.sell_type==0">/1小时</p>
                  </van-col>
                </van-row>
                <van-row>
                  <van-col span="18">
                    <van-tag
                      color="rgba(153,153,153,0.1)"
                      text-color="rgba(51,51,51,0.4)"
                      class="tagRight"
                    >{{item.login_method==1?'QQ':item.login_method==2?'微信':'账号密码'}}登陆</van-tag>
                    <van-tag
                      color="rgba(153,153,153,0.1)"
                      text-color="rgba(51,51,51,0.4)"
                      class="tagRight"
                      v-if="item.sell_type==0"
                    >{{item.mintime}}小时起租</van-tag>
                    <van-tag
                      v-if="!item.cash_price&&item.sell_type==0"
                      color="rgba(153,153,153,0.1)"
                      text-color="rgba(51,51,51,0.4)"
                      class="tagRight"
                    >免押金</van-tag>
                  </van-col>
                  <van-col span="6" class="num" v-if="item.sell_type==0">已租{{item.out_count}}次</van-col>
                </van-row>
              </div>
            </div>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
export default {
  name: "shopDetail",
  data() {
    return {
      isLoading: false,
      value1: 0,
      value2: "",
      option1: [
        { text: "出租", value: 0 },
        { text: "出售", value: 1 },
        { text: "出租（买断）", value: 3 }
      ],
      option2: [],
      loading: false,
      finished: false,
      list: [],
      imgurl: this.$global.imgUrl,
      logo: "",
      shop: "",
      img: require("../assets/merchant/down.png"),
      sort: "",
      search: "",
      page: 1,
      numlist: 0,
      price: 0
    };
  },
  created() {
    // this.name = this.$route.query.name;
    // this.level_id = this.$route.query.level_id;
    // this.shop = this.$route.query.shop;
    this.getScreenApp();
    setTimeout(() => {
      this.getMerchGoods();
    }, 1500);
  },
  methods: {
    back() {
      this.$router.push({ path: "/merchant" });
    },
    goShopInfo() {
      this.$router.push({
        path: "/shopInfo",
        query: { shop: this.shop.mid, type: 1 }
      });
    },
    //店铺商品
    getMerchGoods() {
      this.$axios({
        url: this.$global.url + "api/merch/merchGoods" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          mid: this.$route.query.shop,
          page: this.page,
          limit: 10,
          search: this.search,
          screen: {
            sell_type: this.value1,
            app_id: this.value2,
            price: this.price
          }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.shop = res.data.merch;
            this.loading = false;
            for (let i = 0; i < res.data.data.length; i++) {
              this.list.push(res.data.data[i]);
            }
            if (res.data.count <= this.list.length) {
              this.finished = true;
            } else {
              this.finished = false;
            }
            this.numlist = res.data.count;
          } else if (res.data.code == 0) {
            this.list = [];
            this.loading = false;
            this.finished = true;
          } else {
            this.$notify({
              message: res.data.msg,
              type: "danger"
            });
          }
        })
        .catch(e => {
          if (this.$route.path == "/shopDetail") {
            this.$notify({
              message: "网络较差，请稍后重试！",
              type: "danger"
            });
          }
        });
    },
    //切换下拉
    changeTab() {
      this.list = [];
      this.loading = true;
      this.finished = false;
      this.page = 1;
      this.getMerchGoods();
    },
    //店铺所属App名称
    getScreenApp() {
      this.$axios({
        url: this.$global.url + "api/merch/screenApp" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          mid: this.$route.query.shop
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            for (let i = 0; i < res.data.data.length; i++) {
              this.option2.push({
                text: res.data.data[i].app_name,
                value: res.data.data[i].id
              });
            }
            this.value2 = this.option2[0].value;
          } else if (res.data.code == 0) {
          } else {
            this.$notify({
              message: res.data.msg,
              type: "danger"
            });
          }
        })
        .catch(e => {
          if (this.$route.path == "/shopDetail") {
            this.$notify({
              message: "网络较差，请稍后重试！",
              type: "danger"
            });
          }
        });
    },
    //已售
    goDetail(id, isSell, is_out) {
      if (isSell) {
        this.$notify({
          message: "该商品已出售！",
          type: "danger"
        });
      } else if (is_out == 2) {
        this.$notify({
          message: "该账号正在改密中！",
          type: "danger"
        });
      } else {
        this.$router.push({ path: "/goodsDetail", query: { id: id } });
        this.$router.go(0);
      }
    },
    //价格排序
    sortPrice() {
      this.list = [];
      this.loading = true;
      this.finished = false;
      this.page = 1;
      if (this.price == 0) {
        this.price = 1;
        this.img = require("../assets/merchant/up.png");
      } else {
        this.price = 0;
        this.img = require("../assets/merchant/down.png");
      }
      this.getMerchGoods();
    },
    //搜索
    onSearch() {
      this.list = [];
      this.loading = true;
      this.finished = false;
      this.page = 1;
      this.getMerchGoods();
    },
    //搜索失去焦点如果为空重新加载数据
    onBlur() {
      if (this.search == "") {
        this.list = [];
        this.loading = true;
        this.finished = false;
        this.page = 1;
        this.getMerchGoods();
      }
    },
    //列表更新
    onLoad() {
      this.finished = false;
      if (this.numlist <= this.list.length) {
        return false;
      }
      this.page += 1;
      this.getMerchGoods();
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.list = [];
        this.loading = true;
        this.finished = false;
        this.page = 1;
        this.getMerchGoods();
        this.isLoading = false;
        this.$toast("刷新成功");
      }, 500);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bgColor {
  width: 100%;
}
.header {
  width: 100%;
  height: 1.76rem;
  padding-top: 7px;
  position: relative;
  overflow: hidden;
  background: url("./../assets/common/shop.png") no-repeat center center;
  background-size: 100% 100%;
}

.navBar {
  background: transparent;
}
.pullDown {
  background: transparent;
  color: #fff !important;
}
.pullDown::after {
  border: none;
}
.option {
  color: #fff !important;
}
.shopInfo {
  padding: 15px;
  display: flex;
}
.infoBox {
  padding-left: 10px;
  flex: 1;
}
.info_1 {
  font-size: 0.18rem;
  line-height: 0.28rem;
  color: #fff;
}
.info_2 {
  font-size: 0.12rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 0.16rem;
  padding-top: 5px;
}
.van-nav-bar .van-icon {
  color: #fff;
}
.flexItem {
  display: flex;
  align-items: center;
}
.title {
  font-size: 0.12rem;
  line-height: 0.22rem;
  color: rgba(51, 51, 51, 0.8);
  padding: 0 3px;
  max-width: 45%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tag {
  margin-left: 2px;
}
.tagRight {
  padding: 0.15em 0.3em;
  border-radius: 5px;
}
.price {
  text-align: right;
  color: #ff3131;
  line-height: 0.21rem;
  font-weight: bold;
  font-size: 0.15rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dec {
  font-size: 0.13rem;
  line-height: 0.2rem;
  font-weight: bold;
  height: 0.6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.spe {
  text-align: right;
  color: #999999;
  font-size: 0.12rem;
}
.num {
  color: rgba(51, 51, 51, 0.6);
  line-height: 0.21rem;
  font-size: 0.12rem;
  text-align: right;
}
.item {
  display: flex;
  padding-bottom: 20px;
}
.imgGroup {
  position: relative;
  margin-right: 10px;
  width: 0.85rem;
  height: 0.85rem;
}
.icon {
  position: absolute;
  bottom: 0;
  left: 0;
}
.van-ellipsis {
  color: #fff;
}
.van-dropdown-menu__title::after {
  border-color: transparent transparent #8e83ee #8e83ee;
}
.chuzu {
  position: absolute;
  top: 0;
  left: 0;
  width: 0.85rem;
  height: 0.85rem;
  border: 1px solid transparent;
  border-radius: 10px;
  background: rgba(51, 51, 51, 0.8);
  color: #fff;
  text-align: center;
  font-size: 0.12rem;
}

.chuzu p:nth-child(1) {
  padding-top: 0.1rem;
  font-size: 0.14rem;
}
</style>
