<template>
  <div style="padding-top:60px">
    <van-nav-bar class="head" :border="false" fixed>
      <van-tabs
        slot="left"
        v-model="tab"
        :border="false"
        color="#6574FF"
        line-width=".14rem"
        @click="changeHao(tab)"
      >
        <van-tab title="租号"></van-tab>
        <van-tab title="买号"></van-tab>
      </van-tabs>
      <van-search
        slot="right"
        style="padding: 3px 0;"
        v-model="value"
        placeholder="请输入搜索内容"
        @click="onSearch"
        left-icon="none"
        shape="round"
        readonly
      />
    </van-nav-bar>
    <div class="main">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(item, index) in slide" :key="index">
          <van-image
            width="100%"
            height="195"
            lazy-load
            :src="imgurl+item.img"
            @click="toPage(item.url)"
          />
        </van-swipe-item>
        <!-- <img v-else width="100%" height="195" src alt="图片错误" /> -->
      </van-swipe>
      <van-loading v-if="!slide" />
      <van-grid :gutter="10" :column-num="5" :border="false">
        <van-grid-item v-for="(item,index) in type" :key="index" @click="goPpx(item.id)">
          <van-image lazy-load :src="item.logo" />
          <span class="typeText">{{item.title}}</span>
        </van-grid-item>
      </van-grid>
      <ul class="showBtn">
        <li style="margin-right:15px">
          <van-image
            width="100%"
            height=".75rem"
            lazy-load
            :src="require('../assets/index/jpsj.png')"
            radius="10px"
            @click="goMerchant()"
          />
        </li>
        <li>
          <van-image
            width="100%"
            height=".75rem"
            lazy-load
            :src="require('../assets/index/ppxlw.png')"
            radius="10px"
            @click="goPpxgift()"
          />
        </li>
      </ul>
      <van-row>
        <van-col span="15">
          <span
            v-for="(item,index) in btn"
            :key="index"
            :class="actBtn==index?'btn actBtn':'btn'"
            @click="changeBtn(index)"
          >{{item}}</span>
        </van-col>
      </van-row>
      <!-- 下拉刷新 -->
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <van-cell v-for="(item,index) in list" :key="index" style="padding:10px 0">
            <div class="list">
              <div class="item" @click="goDetail(item.id,item.is_sell,item.is_out)">
                <van-image
                  style="margin-right:10px"
                  width=".85rem"
                  height=".85rem"
                  lazy-load
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
                <div style="flex: 1;">
                  <van-row>
                    <van-col span="17" class="flexItem">
                      <van-tag
                        :color="item.mid=='平台'?'#7065FF':typeof(item.mid)=='object'?'#5AD27C':'#F1BF3D'"
                        class="tagRight"
                      >{{item.mid=='平台'?'平台':typeof(item.mid)=='object'?"商家":"个人"}}</van-tag>
                      <span
                        class="title"
                      >{{item.mid=='平台'?'平台自营':typeof(item.mid)=='object'?item.mid.title:item.mid}}</span>
                      <!-- 商家等级判断 -->
                      <van-icon
                        v-if="item.mid!='平台'&&item.mid.level_id==1"
                        name="star"
                        color="#FFA300"
                      />
                      <van-icon
                        v-else-if="item.mid!='平台'&&item.mid.level_id==2"
                        :name="require('../assets/merchant/yueliang.png')"
                      />
                      <van-icon
                        v-else-if="item.mid!='平台'&&item.mid.level_id==3"
                        :name="require('../assets/merchant/taiyang.png')"
                      />
                      <van-icon
                        v-else-if="item.mid!='平台'&&item.mid.level_id==4"
                        :name="require('../assets/merchant/huangguan.png')"
                      />
                      <van-icon
                        v-else-if="item.mid!='平台'&&item.mid.level_id==5"
                        :name="require('../assets/merchant/baoding.png')"
                      />
                      <van-image
                        v-if="typeof(item.mid)=='object'"
                        class="tag"
                        width=".15rem"
                        height=".15rem"
                        lazy-load
                        :src="require('../assets/index/bao.png')"
                      />
                      <van-image
                        v-if="typeof(item.mid)=='object'"
                        class="tag"
                        width=".15rem"
                        height=".15rem"
                        lazy-load
                        :src="require('../assets/index/shi.png')"
                      />
                      <van-image
                        v-if="typeof(item.mid)=='object'"
                        class="tag"
                        width=".15rem"
                        height=".15rem"
                        lazy-load
                        :src="require('../assets/index/shou.png')"
                      />
                    </van-col>
                    <van-col span="7" class="price">￥{{!tab?item.rent.price:item.price}}</van-col>
                  </van-row>
                  <van-row>
                    <van-col span="17" class="dec">{{item.title}}</van-col>
                    <van-col v-if="!tab" span="7" class="spe">/1小时</van-col>
                  </van-row>
                  <van-row v-if="!tab">
                    <van-col span="18">
                      <van-tag
                        color="rgba(153,153,153,0.1)"
                        text-color="rgba(51,51,51,0.4)"
                        class="tagRight"
                      >{{item.phone_id}}</van-tag>
                      <van-tag
                        color="rgba(153,153,153,0.1)"
                        text-color="rgba(51,51,51,0.4)"
                        class="tagRight"
                      >{{item.mintime}}小时起租</van-tag>
                      <van-tag
                        v-if="!item.cash_price"
                        color="rgba(153,153,153,0.1)"
                        text-color="rgba(51,51,51,0.4)"
                        class="tagRight"
                      >免押金</van-tag>
                    </van-col>
                    <van-col span="6" class="num">已租{{item.out_count}}次</van-col>
                  </van-row>
                  <van-row v-if="tab">
                    <van-col span="18">
                      <van-tag
                        color="rgba(153,153,153,0.1)"
                        text-color="rgba(51,51,51,0.4)"
                        class="tagRight"
                      >{{item.phone_id}}</van-tag>
                    </van-col>
                  </van-row>
                </div>
              </div>
            </div>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>

    <tabbar></tabbar>
  </div>
</template>

<script>
import tabbar from "./public/tabbar.vue";
export default {
  name: "index",
  components: {
    tabbar
  },
  data() {
    return {
      isLoading: false,
      tab: 0,
      value: "",
      actBtn: 0,
      btn: ["推荐", "皮皮蟹"],
      list: [],
      loading: true,
      finished: false,
      imgurl: this.$global.imgUrl,
      slide: "",
      type: [
        {
          title: "手游",
          id: 1,
          logo: require("../assets/index/shouyou.png")
        },
        {
          title: "端游",
          id: 2,
          logo: require("../assets/index/duanyou.png")
        },
        {
          title: "直播",
          id: 3,
          logo: require("../assets/index/zhibo.png")
        },
        {
          title: "语音",
          id: 4,
          logo: require("../assets/index/yuyin.png")
        },
        {
          title: "影视",
          id: 5,
          logo: require("../assets/index/yingshi.png")
        }
      ]
    };
  },
  mounted() {
    this.getIndexhot();
    this.slideShow();
  },
  methods: {
    onSearch() {
      this.$router.push({ path: "/search" });
    },
    changeBtn(i) {
      this.list = [];
      this.actBtn = i;
      this.loading = true;
      this.finished = false;
      if (i == 0) {
        this.getIndexhot();
      } else if (i == 1) {
        this.getPpxData();
      }
    },
    changeHao(i) {
      this.list = [];
      this.loading = true;
      this.finished = false;
      if (i == 0) {
        if (this.actBtn == 0) {
          this.getIndexhot();
        } else if (this.actBtn == 1) {
          this.getPpxData();
        }
      } else if (i == 1) {
        if (this.actBtn == 0) {
          this.getIndexhot();
        } else if (this.actBtn == 1) {
          this.getPpxData();
        }
      }
    },
    goMerchant() {
      this.$router.push({ path: "/merchant" });
    },
    goPpxgift() {
      this.$router.push({ path: "/ppxgift" });
    },
    goPpx(id) {
      this.$router.push({ path: "/ppx", query: { id: id, tab: this.tab } });
    },
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
      }
    },
    //获取皮皮蟹
    getPpxData() {
      this.$axios({
        url: this.$global.url + "api/number/ppxGoods" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          sell_type: this.tab
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.list = res.data.data;
            this.numlist = res.data.data.length;
            this.loading = false;
            this.finished = true;
          } else if (res.data.code == 0) {
            this.list = [];
            this.loading = false;
            this.finished = true;
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
          this.$notify({
            message: "网络较差，请稍后重试！",
            type: "danger"
          });
        });
    },
    //获取推荐
    getIndexhot() {
      this.$axios({
        url: this.$global.url + "api/number/indexHot" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          sell_type: this.tab
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.list = res.data.data;
            // 数据全部加载完成
            this.loading = false;
            this.finished = true;
          } else if (res.data.code == 0) {
            this.loading = false;
            this.finished = true;
            this.list = [];
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
          this.$notify({
            message: "网络较差，请稍后重试！",
            type: "danger"
          });
        });
    },
    //轮播图
    slideShow() {
      this.$axios({
        url: this.$global.url + "api/merch/slideshow" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          title: "slideshow"
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.slide = res.data.data;
          } else {
            this.slide = [];
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
    //轮播图跳转
    toPage(url) {
      this.$router.push(url);
    },
    //列表更新
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.list = [];
        this.loading = true;
        this.finished = false;
        if (this.tab == 0) {
          if (this.actBtn == 0) {
            this.getIndexhot();
          } else if (this.actBtn == 1) {
            this.getPpxData();
          }
        } else if (this.tab == 1) {
          if (this.actBtn == 0) {
            this.getIndexhot();
          } else if (this.actBtn == 1) {
            this.getPpxData();
          }
        }
        this.isLoading = false;
        this.$toast("刷新成功");
        // this.count++;
      }, 500);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {
  padding: 0 15px;
}
.typeText {
  font-size: 0.12rem;
  line-height: 0.17rem;
  margin-top: 8px;
}
.showBtn {
  display: flex;
  justify-content: space-between;
  margin: 10px 0 20px;
}
.showBtn li {
  flex: 1;
}
.van-grid-item__text {
  color: #333;
}
.btn {
  display: inline-block;
  height: 0.3rem;
  border-radius: 15px;
  line-height: 0.3rem;
  font-size: 0.12rem;
  padding: 0 10px;
}
.actBtn {
  color: #fff;
  background: linear-gradient(
    180deg,
    rgba(101, 116, 255, 1) 0%,
    rgba(112, 101, 255, 1) 100%
  );
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
  max-width: 35%;
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
  height: 0.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
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
  position: relative;
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
.van-list {
  margin-bottom: 50px;
}
</style>
