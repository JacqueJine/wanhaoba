<template>
  <div class="bgColor">
    <div class="header">
      <van-nav-bar :title="title" :border="false" left-arrow @click-left="back()">
        <!-- <van-dropdown-menu slot="title">
          <van-dropdown-item v-model="title" :options="titleOption" />
        </van-dropdown-menu>-->
        <van-icon
          :name="require('../assets/common/sousuo.png')"
          slot="right"
          size=".20rem"
          color="#333"
          @click="onSearch"
        />
      </van-nav-bar>
    </div>
    <!-- <van-dropdown-menu>
      <van-dropdown-item v-model="value1" :options="option1" />
      <van-dropdown-item v-model="value2" :options="option2" />
      <van-dropdown-item v-model="value3" :options="option3" />
      <van-dropdown-item v-model="value4" :options="option4" />
    </van-dropdown-menu>-->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="(item,index) in list" :key="index">
          <div class="list">
            <div class="item" @click="goDetail(item.id,item.is_sell,item.is_out)">
              <van-image
                style="margin-right:10px;border:1px solid #eee"
                width=".85rem"
                height=".85rem"
                lazy-load
                radius="10px"
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
                  <van-col v-if="!tab" span="6" class="spe">/1小时</van-col>
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
</template>
<script>
export default {
  name: "ppx",
  data() {
    return {
      isLoading: false, //下拉刷新
      tab: 0,
      title: this.$route.query.title,
      imgurl: this.$global.imgUrl,
      value1: 0,
      value2: "a",
      value3: 0,
      value4: "a",
      option1: [
        { text: "综合", value: 0 },
        { text: "新款商品", value: 1 },
        { text: "活动商品", value: 2 }
      ],
      option2: [
        { text: "操作系统", value: "a" },
        { text: "好评排序", value: "b" },
        { text: "销量排序", value: "c" }
      ],
      option3: [
        { text: "客户端", value: 0 },
        { text: "新款商品", value: 1 },
        { text: "活动商品", value: 2 }
      ],
      option4: [
        { text: "待租", value: "a" },
        { text: "好评排序", value: "b" },
        { text: "销量排序", value: "c" }
      ],
      list: [],
      numlist: 0,
      loading: true,
      finished: false,
      page: 1
    };
  },
  created() {
    this.tab = this.$route.query.tab;
    this.getList();
  },
  methods: {
    //获取数据
    getList() {
      this.$axios({
        url: this.$global.url + "api/number/navigationGoods" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            app_id: this.$route.query.id,
            sell_type: this.$route.query.tab,
            page: this.page,
            limit: 10
          }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.loading = false;
            for (let i = 0; i < res.data.data.length; i++) {
              this.list.push(res.data.data[i]);
            }
            if (res.data.count <= res.data.count) {
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
          this.$notify({
            message: "网络较差，请稍后重试！",
            type: "danger"
          });
        });
    },
    back() {
      this.$router.back(-1);
    },
    onSearch() {
      this.$router.push({ path: "/search" });
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
    //列表更新
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        this.finished = false;
        if (this.numlist <= this.list.length) {
          return false;
        }
        this.page += 1;
        this.getList();
      }, 500);
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.list = [];
        this.page = 1;
        this.loading = true;
        this.finished = false;
        this.getList();
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
  /* padding: 15px; */
  /* border-bottom: 1px solid rgba(216, 216, 216, 0.2); */
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
