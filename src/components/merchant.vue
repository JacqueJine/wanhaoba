<template>
  <div class="bgColor">
    <div class="header">
      <van-nav-bar title="金牌商家" :border="false" left-arrow @click-left="back()">
        <van-tag v-if="role!='商家'" type="success" slot="right" @click="goOpenShop()">我要开店</van-tag>
      </van-nav-bar>
    </div>
    <van-grid :border="false" :column-num="3" style="font-size:14px;">
      <van-grid-item v-for="(item,index) in merchType" :key="index">
        <span @click="changType(item,index)">
          {{item.name}}
          <van-icon :name="item.img" />
        </span>
      </van-grid-item>
      <!-- <van-grid-item>
        <span>
          销量
          <van-icon :name="require('../assets/merchant/moren.png')" />
        </span>
      </van-grid-item>
      <van-grid-item>
        <span>
          新店
          <van-icon :name="require('../assets/merchant/up.png')" />
        </span>
      </van-grid-item>-->
    </van-grid>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="(item,index) in listMerch" class="vanlist" :key="index">
          <div class="list">
            <ul>
              <li>
                <div>
                  <van-image
                    lazy-load
                    width="70px"
                    height="70px"
                    radius="10px"
                    :src="imgurl+item.logo"
                  />
                </div>
                <div class="cardInfo">
                  <h3>{{item.title}}</h3>
                  <div class="info">
                    <span class="cardColor">
                      等级：
                      <van-icon v-if="item.level_id==1" name="star" color="#FFA300" />
                      <van-icon
                        v-else-if="item.level_id==2"
                        :name="require('../assets/merchant/yueliang.png')"
                      />
                      <van-icon
                        v-else-if="item.level_id==3"
                        :name="require('../assets/merchant/taiyang.png')"
                      />
                      <van-icon
                        v-else-if="item.level_id==4"
                        :name="require('../assets/merchant/huangguan.png')"
                      />
                      <van-icon
                        v-else-if="item.level_id==5"
                        :name="require('../assets/merchant/baoding.png')"
                      />
                    </span>
                    <span class="cardColor">销量：{{item.sales}}</span>
                    <van-button
                      round
                      size="small"
                      style="float:right"
                      color="linear-gradient(to bottom, #6574FF, #7065FF)"
                      :to="{path:'/shopDetail',query:{shop:item.mid}}"
                    >进店</van-button>
                  </div>
                  <p>
                    <van-tag round color="rgba(51,51,51,0.1)" text-color="rgba(51,51,51,0.6)">账号买卖</van-tag>
                    <van-tag round color="rgba(51,51,51,0.1)" text-color="rgba(51,51,51,0.6)">账号租赁</van-tag>
                  </p>
                  <div class="item">
                    <span>主营项目：</span>
                    <b>{{item.category}}</b>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
export default {
  name: "merchant",
  data() {
    return {
      isLoading: false,
      listMerch: [],
      imgurl: this.$global.imgUrl,
      loading: false,
      finished: false,
      page: 1,
      limit: 10,
      numlist: 0,
      role: "商家",
      merchType: [
        {
          name: "等级",
          value: "level_id",
          status: 1,
          img: require("../assets/merchant/up.png")
        },
        {
          name: "销量",
          value: "seles",
          status: 0,
          img: require("../assets/merchant/moren.png")
        },
        {
          name: "新店",
          value: "add_time",
          status: 0,
          img: require("../assets/merchant/moren.png")
        }
      ],
      status: 1, //1倒叙 0正序
      type: "level_id" //level_id店铺段位  seles店铺销量 add_time新店
    };
  },
  created() {
    this.role = localStorage.getItem("role");
    this.getListMerch();
  },
  methods: {
    back() {
      this.$router.push({ path: "/index" });
    },
    //开店是否开过店
    goOpenShop() {
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
      this.$axios({
        url: this.$global.url + "api/merch/merchExist" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          mid: this.$global.getToken("mid")
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.$notify({
              message: res.data.msg,
              type: "danger"
            });
          } else if (res.data.code == 0) {
            this.$router.push({ path: "/openShop_1" });
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
    },
    //店铺列表
    getListMerch() {
      this.$axios({
        url: this.$global.url + "root/merch/list" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          page: this.page,
          limit: 10,
          status: 1,
          order: {
            status: this.status,
            type: this.type
          }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.loading = false;
            for (let i = 0; i < res.data.data.length; i++) {
              this.listMerch.push(res.data.data[i]);
            }
            if (res.data.count <= this.listMerch.length) {
              this.finished = true;
            } else {
              this.finished = false;
            }
            this.numlist = res.data.count;
          } else if (res.data.code == 0) {
            this.listMerch = [];
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
            message: "网络较差，请稍后重试！!!!",
            type: "danger"
          });
        });
    },
    // 排序
    changType(item, index) {
      for (let i = 0; i < this.merchType.length; i++) {
        this.merchType[i].img = require("../assets/merchant/moren.png");
      }
      this.type = item.value;
      this.listMerch = [];
      this.page = 1;
      this.loading = true;
      this.finished = false;
      if (item.status == 0) {
        item.status = 1;
        this.status = 1;
        item.img = require("../assets/merchant/up.png");
      } else if (item.status == 1) {
        item.status = 0;
        this.status = 0;
        item.img = require("../assets/merchant/down.png");
      }
      this.getListMerch();
    },
    //列表更新
    onLoad() {
      this.finished = false;
      if (this.numlist <= this.listMerch.length) {
        return false;
      }
      this.page += 1;
      this.getListMerch();
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.listMerch = [];
        this.page = 1;
        this.loading = true;
        this.finished = false;
        this.getListMerch();
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
  min-height: 100vh;
  background: #f5f5f5;
}
.header {
  padding: 7px 0;
  background: #fff;
}
.van-cell {
  background: transparent;
}
.list {
  margin-bottom: 10px;
  background: #fff;
}
.list li {
  padding: 15px 15px 12px;
  border-radius: 10px;
  display: flex;
}
.cardInfo {
  font-size: 12px;
  padding-left: 10px;
  flex: 1;
}
.cardInfo h3 {
  font-size: 16px;
}
.cardColor {
  color: rgba(51, 51, 51, 0.4);
  margin-right: 5px;
}
.info {
  overflow: hidden;
  line-height: 30px;
}
.item {
  padding-top: 4px;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.item span {
  color: rgba(51, 51, 51, 0.6);
}
</style>
