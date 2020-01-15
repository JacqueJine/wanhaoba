<template>
  <div class="bgColor">
    <div class="header">
      <van-nav-bar title="皮皮蟹" :border="false" left-arrow @click-left="back()">
        <van-icon name="plus" slot="right" @click="plus()" size="19px" color="#333" />
      </van-nav-bar>
      <van-search
        placeholder="请输入搜索内容"
        v-model="search"
        left-icon="none"
        shape="round"
        @search="onSearch"
      />
      <div v-show="showPlus" class="plus">
        <p @click="sell_(1)">我要出售</p>
        <p @click="sell_(2)">我要求购</p>
      </div>
    </div>
    <div class="head">
      <van-tabs
        v-model="tab"
        color="#6574FF"
        :border="false"
        line-width="14px"
        style="flex:2"
        @click="changetab"
      >
        <van-tab title="出售"></van-tab>
        <van-tab title="求购"></van-tab>
      </van-tabs>
      <div class="screen">
        <van-tag
          color="#cdf1d7"
          text-color="#5AD27C"
          @click="show=true"
          style="margi-top:10px;"
          size="large"
        >筛选</van-tag>
      </div>
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="(item,index) in list" class="vanlist" :key="index">
          <div class="list">
            <ul>
              <li>
                <van-image
                  lazy-load
                  width="85px"
                  height="85px"
                  radius="10px"
                  :src="item.img==null?'':img+item.img[0]"
                />
                <div class="cardInfo">
                  <div class="info_1">
                    <div>
                      <van-tag
                        :color="item.mid=='平台'?'#7065FF':typeof(item.mid)=='object'?'#5AD27C':'#F1BF3D'"
                        class="tagRight"
                      >{{item.mid=='平台'?'平台':typeof(item.mid)=='object'?"商家":"个人"}}</van-tag>
                      <b>{{item.mid=='平台'?'平台自营':typeof(item.mid)=='object'?item.mid.title:item.mid}}</b>
                    </div>
                    <span>{{item.add_time}}</span>
                  </div>
                  <!-- <div class="info_1" v-if="item.mid!=='平台'">
                  <div>
                    <van-tag color="#F2A638" style="border-radius:5px;padding: .15em .4em;">个人</van-tag>
                    <b>个人信誉：100</b>
                  </div>
                  <span>2019-01-12</span>
                  </div>-->
                  <van-row class="info_2">
                    <van-col span="16" class="title">{{item.name_id}}</van-col>
                    <van-col span="8" class="btn">
                      <van-button
                        :disabled="tab==0&&item.gift_number==0 || tab==1&&item.ask_sum==0"
                        :span="8"
                        round
                        size="small"
                        color="linear-gradient(to bottom, #6574FF, #7065FF)"
                        @click="buy_(item.id)"
                      >{{buy}}</van-button>
                    </van-col>
                  </van-row>
                  <div class="info_3">
                    <b>￥{{item.price}}</b>
                    <span
                      v-if="tab==0&&item.gift_number==0 || tab==1&&item.ask_sum==0"
                    >{{tab==0&&item.gift_number==0?'已售空':tab==1&&item.ask_sum==0?'已供应':''}}</span>
                    <span v-else>{{sell}} {{tab==0?item.gift_number:item.ask_sum}} 件</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
    <van-popup v-model="show" round position="bottom">
      <div class="spe">
        <li>
          <p class="speTitle">礼包分类</p>
          <div class="btnGroup">
            <van-button
              :class="active==index?'speBtn1':'speBtn'"
              :color="active==index?'#696FFF':'rgba(153,153,153,0.2)'"
              size="small"
              v-for="(item,index) in classList"
              :key="index"
              round
              @click="getGift(item.id,index)"
            >{{item.gift_name}}</van-button>
          </div>
        </li>
        <li>
          <p class="speTitle">选择礼物</p>
          <div class="btnGroup">
            <van-button
              :class="active1==index?'speBtn1':'speBtn'"
              :color="active1==index?'#696FFF':'rgba(153,153,153,0.2)'"
              size="small"
              v-for="(item,index) in giftList"
              :key="index"
              round
              @click="active1=index"
            >{{item.name}}</van-button>
          </div>
        </li>
        <li>
          <p class="speTitle">选择商家</p>
          <div class="btnGroup">
            <van-button
              :class="active2==index?'speBtn1':'speBtn'"
              size="small"
              :color="active2==index?'#696FFF':'rgba(153,153,153,0.2)'"
              round
              v-for="(item,index) in shop"
              :key="index"
              @click="active2=index"
            >{{item.name}}</van-button>
          </div>
        </li>
        <van-row style="padding-top:10px">
          <van-col span="8">
            <van-button style="width:100%" color="#5AD27C" round @click="reset">重置</van-button>
          </van-col>
          <van-col offset="2" span="14">
            <van-button style="width:100%" color="#696FFF" round @click="submit">确定</van-button>
          </van-col>
        </van-row>
      </div>
    </van-popup>
  </div>
</template>
<script>
// import tabbar from "./public/tabbar.vue";
export default {
  name: "ppxgift",
  // components: {
  //   tabbar
  // },
  data() {
    return {
      isLoading: false,
      search: "",
      tab: 0,
      show: false,
      showPlus: false,
      loading: false,
      finished: false,
      list: [],
      classList: [],
      giftList: [],
      buy: "购买",
      sell: "剩余",
      img: this.$global.imgUrl,
      numlist: 0,
      page: 1,
      limit: 10,
      shop: [
        { name: "个人", value: 1 },
        { name: "商家", value: 2 },
        { name: "平台", value: 0 }
      ],
      active: -1,
      active1: -1,
      active2: -1,
      class_id: "",
      name_id: "",
      merch: ""
    };
  },
  mounted() {
    this.getGiftlist();
    this.getClassList();
  },
  methods: {
    back() {
      this.$router.back(-1);
    },
    plus() {
      this.showPlus = !this.showPlus;
    },
    changetab() {
      this.active = -1;
      this.active1 = -1;
      this.active2 = -1;
      this.class_id = "";
      this.name_id = "";
      this.merch = "";
      this.search = "";
      this.page = 1;
      this.list = [];
      this.loading = true;
      this.finished = false;
      this.getGiftlist();
    },
    //获取礼物商品
    getGiftlist() {
      this.$axios({
        url: this.$global.url + "api/gift/giftList" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            type: this.tab,
            page: this.page,
            limit: 10,
            search: this.search,
            class_id: this.class_id,
            name_id: this.name_id,
            merch: this.merch
          }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            if (this.tab == 0) {
              this.buy = "购买";
              this.sell = "剩余";
            } else if (this.tab == 1) {
              this.buy = "供应";
              this.sell = "求购";
            }
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
            this.$notify({
              message: "暂无数据！",
              type: "warning",
              duration: 700
            });
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
          console.log(e);
          this.$notify({
            message: "网络较差，请稍后重试！",
            type: "danger"
          });
        });
    },
    //获取礼物名称
    getGift(itemid, index) {
      this.active = index;
      this.$axios({
        url: this.$global.url + "root/gift/giftNameList" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          class_id: itemid
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.giftList = res.data.data;
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
    //出售或求购
    sell_(type) {
      //判断是否登录
      if (!this.$global.getToken("mid")) {
        this.$dialog
          .confirm({
            message: "您还没有登录，去登陆？"
          })
          .then(() => {
            this.$router.push("/login_regis/login");
          })
          .catch(() => {
            // on cancel
          });
        return false;
      }
      if (type == 1) {
        this.$router.push("/sellGift");
      } else if (type == 2) {
        this.$router.push("/buyGift");
      }
    },
    //购买或供应
    buy_(itemid) {
      // 判断是否登录
      if (!this.$global.getToken("mid")) {
        this.$dialog
          .confirm({
            message: "您还没有登录，去登陆？"
          })
          .then(() => {
            this.$router.push("/login_regis/login");
          })
          .catch(() => {
            // on cancel
          });
        return false;
      }
      //购买
      if (this.tab == 0) {
        this.$router.push({ path: "/buy_ppxgift", query: { id: itemid } });
      }
      //供应
      else if (this.tab == 1) {
        this.$dialog
          .confirm({
            message: "确定供应吗"
          })
          .then(() => {
            // on confirm
            this.$router.push({
              path: "/supply_ppxgift",
              query: { id: itemid }
            });
          })
          .catch(() => {
            // on cancel
          });
      }
    },
    //获取礼物分类
    getClassList() {
      this.$axios({
        url: this.$global.url + "root/gift/classList" + ".html",
        method: "POST"
      })
        .then(res => {
          if (res.data.code == 1) {
            this.classList = res.data.data;
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
    //重置
    reset() {
      this.giftList = [];
      this.search = "";
      this.active = -1;
      this.active1 = -1;
      this.active2 = -1;
      this.class_id = "";
      this.name_id = "";
      this.merch = "";
    },
    //筛选
    submit() {
      this.search = "";
      if (this.active != -1) {
        this.class_id = this.classList[this.active].id;
      } else {
        this.class_id = "";
      }
      if (this.active1 != -1) {
        this.name_id = this.giftList[this.active1].id;
      } else {
        this.name_id = "";
      }
      if (this.active2 != -1) {
        this.merch = this.shop[this.active2].value;
      } else {
        this.merch = "";
      }
      this.list = [];
      this.page = 1;
      this.loading = true;
      this.finished = false;
      this.show = false;
      this.getGiftlist();
    },
    //搜索
    onSearch() {
      this.page = 1;
      this.list = [];
      this.active = -1;
      this.active1 = -1;
      this.active2 = -1;
      this.class_id = "";
      this.name_id = "";
      this.merch = "";
      this.loading = true;
      this.finished = false;
      this.getGiftlist();
    },
    //列表更新
    onLoad() {
      this.finished = false;
      if (this.numlist <= this.list.length) {
        return false;
      }
      this.page += 1;
      this.getGiftlist();
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.list = [];
        this.page = 1;
        this.loading = true;
        this.finished = false;
        this.getGiftlist();
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
  height: 100vh;
}
.header {
  padding: 7px 0;
  background: #fff;
}
.head {
  display: flex;
  margin-bottom: 10px;
}
.screen {
  flex: 3;
  background: #fff;
  text-align: right;
  padding: 0 15px;
  line-height: 44px;
}
.list li {
  background: #fff;
  border-radius: 10px;
  display: flex;
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
}
.info_1 b {
  padding-left: 5px;
  font-weight: 400;
  color: rgba(51, 51, 51, 0.8);
}
.info_2 {
  font-size: 13px;
  font-weight: bold;
  line-height: 30px;
}
.btn {
  text-align: right;
}
.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.info_3 {
  padding-top: 5px;
}
.info_3 b {
  color: #ff3131;
  font-size: 15px;
  padding-right: 15px;
}
.info_3 span {
  color: rgba(51, 51, 51, 0.4);
}
.info_4 {
  text-align: right;
}
.tagRight {
  padding: 0.15em 0.3em;
  padding: 0.15em 0.3em;
}
.spe {
  padding: 20px 20px 15px;
}
.speTitle {
  font-size: 14px;
  color: #333;
  list-style: 20px;
  padding-bottom: 15px;
  font-weight: bold;
}
.speBtn {
  color: rgba(51, 51, 51, 0.4) !important;
  border: none !important;
  margin: 0 10px 10px 0;
}
.speBtn1 {
  border: none !important;
  margin: 0 10px 10px 0;
}
.activeBtn {
  background: #696fff;
  color: #fff !important;
}
.plus {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.21);
  position: absolute;
  z-index: 2;
  top: 55px;
  right: 10px;
  font-size: 14px;
}
.plus a {
  color: #999;
}
.plus p {
  padding: 10px 20px;
}
</style>
