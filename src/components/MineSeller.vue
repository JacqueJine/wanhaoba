<template>
  <div class="mine">
    <div class="header">
      <div class="title">
        <span>我是卖家</span>
        <van-button class="roleBtn" round color="rgba(255,255,255,0.2)" size="mini" to="/mine">
          我是买家
          <i class="van-icon van-icon-exchange van-button__icon"></i>
        </van-button>
      </div>
      <div class="user">
        <van-image
          lazy-load
          width=".55rem"
          height=".55rem"
          style="margin:2px"
          :src="head_img==null?img:imgurl+head_img"
        />
        <div class="info">
          <p>
            {{user.user_name}}&nbsp;
            <span
              style="font-size:.12rem;color:rgba(255,255,255,.8)"
            >id:{{user.user_number}}</span>
          </p>
          <van-tag round color="#FFFFFF" text-color="#FE945A">{{role}}</van-tag>
          <span
            class="credit"
            v-if="user.merch"
          >等级：{{user.merch.level_id==1?'星星':user.merch.level_id==2?'月亮':user.merch.level_id==3?'太阳':user.merch.level_id==2?'皇冠':'宝鼎'}}</span>
          <span class="credit" v-else>信誉分：{{user.credit}}</span>
        </div>
      </div>
    </div>
    <van-grid :border="false" :column-num="3" style="flex-wrap: nowrap;">
      <van-grid-item :to="{path:'/residue',query:{lines:user.lines}}">
        <p class="num">{{user.lines}}</p>
        <p class="text">余额</p>
      </van-grid-item>
      <van-grid-item :to="{path:'/sugar',query:{candies:user.candies}}">
        <p class="num">{{user.candies}}</p>
        <p class="text">糖果</p>
      </van-grid-item>
      <van-grid-item to="/collect">
        <p class="num">{{user.collect_count}}</p>
        <p class="text">收藏</p>
      </van-grid-item>
    </van-grid>
    <div v-if="role=='普通用户'" class="box">
      <van-image lazy-load :src="require('../assets/mine/seller.png')" @click="toOpenshop" />
    </div>
    <div class="box">
      <!-- <router-link to="/order"> -->
      <van-cell
        title="订单信息"
        value="全部"
        @click="goOrder(6)"
        is-link
        style="background: transparent;"
      ></van-cell>
      <!-- </router-link> -->
      <van-grid :border="false" :column-num="4" style="border-radius:10px;overflow: hidden;">
        <van-grid-item v-for="(item,index) in order_list" :key="index" @click="goOrder(item.value)">
          <van-icon :name="item.img" size=".33rem" :info="item.info" />
          <span class="typeText">{{item.title}}</span>
        </van-grid-item>
      </van-grid>
      <van-grid
        :border="false"
        :column-num="5"
        class="last"
        style="border-radius:10px;overflow: hidden;"
      >
        <van-grid-item
          v-for="(item,index) in orderStatus"
          :key="index"
          @click="goOrderStatus(index)"
        >
          <van-icon :name="item.img" size=".33rem" :info="item.info" />
          <span class="typeText">{{item.title}}</span>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="box">
      <van-cell title="我的工具" style="background: transparent;"></van-cell>
      <div class="tool">
        <van-cell
          title="卖家服务"
          is-link
          style="border-radius:10px;overflow: hidden;"
          :to="'/shopInfo?shop='+mid+'&type=2'"
        ></van-cell>
        <van-cell title="设置" is-link style="border-radius:10px;overflow: hidden;" to="/set"></van-cell>
      </div>
    </div>
    <tabbar></tabbar>
  </div>
</template>
<script>
import tabbar from "./public/tabbar.vue";
export default {
  name: "mine",
  components: {
    tabbar
  },
  data() {
    return {
      order_list: [
        // {
        //   img: "./../../static/img/mine/daifukuan.png",
        //   title: "待付款",
        //   value: 0
        // },
        {
          img: "./../../static/img/mine/zuyongzhong.png",
          title: "出租中",
          value: 2,
          info: ""
        },
        {
          img: "./../../static/img/mine/yishouchu.png",
          title: "已售出",
          value: 3,
          info: ""
        },
        {
          title: "已租用",
          img: require("../assets/mine/yigoumai.png"),
          value: 4,
          info: ""
        },
        {
          img: "./../../static/img/mine/shouhou.png",
          title: "售后",
          value: 5,
          info: ""
        }
      ],
      orderStatus: [
        {
          img: "./../../static/img/mine/yishangjia.png",
          title: "已上架",
          info: ""
        },
        {
          img: "./../../static/img/mine/yixiajia.png",
          title: "已下架",
          info: ""
        },
        {
          img: "./../../static/img/mine/daishenhe.png",
          title: "待审核",
          info: ""
        },
        {
          img: "./../../static/img/mine/weitongguo.png",
          title: "未通过",
          info: ""
        },
        {
          img: "./../../static/img/mine/edit.png",
          title: "改密码",
          info: ""
        }
      ],
      user: "",
      head_img: "",
      role: "普通用户",
      is_seller: 1,
      mid: "",
      img: require("./../assets/index/touxiang.png"),
      imgurl: this.$global.imgUrl
    };
  },
  mounted() {
    this.getMemberlist();
    this.getOrderCount();
    this.mid = localStorage.getItem("mid");
    if (localStorage.getItem("role") == "个人") {
      this.role = "普通用户";
    } else if (localStorage.getItem("role") == "商家") {
      this.role = "商家";
    }
  },
  methods: {
    //页面跳转 传输数据
    goOrder(index) {
      this.$router.push({
        path: "/order",
        query: { id: index, is_seller: this.is_seller, title: "number" }
      });
    },
    goOrderStatus(index) {
      this.$router.push({
        path: "/orderStatus",
        query: { id: index, is_seller: this.is_seller }
      });
    },
    //去开店
    toOpenshop() {
      this.$router.push("/openShop_1");
    },
    //获取用户详情
    getMemberlist() {
      this.$axios({
        url: this.$global.url + "api/user/memberList" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          id: this.$global.getToken("mid")
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.user = res.data.data;
            this.head_img = res.data.data.img;
          } else if (res.data.code == 0) {
            this.user = [];
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
          console.log(e);
          this.$notify({
            message: "网络较差，请稍后重试！",
            type: "danger"
          });
        });
    },
    //订单统计
    getOrderCount() {
      this.$axios({
        url: this.$global.url + "api/numberOrder/orderCount" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          mid: this.$global.getToken("mid"),
          type: 0
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            // 订单
            if (res.data.data.number_hire == 0) {
              this.order_list[0].info = "";
            } else {
              this.order_list[0].info = res.data.data.number_hire;
            }
            if (res.data.data.number_bought == 0) {
              this.order_list[1].info = "";
            } else {
              this.order_list[1].info = res.data.data.number_bought;
            }
            if (res.data.data.number_accomplish == 0) {
              this.order_list[2].info = "";
            } else {
              this.order_list[2].info = res.data.data.number_accomplish;
            }
            if (res.data.data.number_after == 0) {
              this.order_list[3].info = "";
            } else {
              this.order_list[3].info = res.data.data.number_after;
            }

            //状态
            if (res.data.data.sum_putaway == 0) {
              this.orderStatus[0].info = "";
            } else {
              this.orderStatus[0].info = res.data.data.sum_putaway;
            }
            if (res.data.data.sum_out == 0) {
              this.orderStatus[1].info = "";
            } else {
              this.orderStatus[1].info = res.data.data.sum_out;
            }
            if (res.data.data.sum_audit == 0) {
              this.orderStatus[2].info = "";
            } else {
              this.orderStatus[2].info = res.data.data.sum_audit;
            }
            if (res.data.data.sum_pass == 0) {
              this.orderStatus[3].info = "";
            } else {
              this.orderStatus[3].info = res.data.data.sum_pass;
            }
            if (res.data.data.is_out == 0) {
              this.orderStatus[4].info = "";
            } else {
              this.orderStatus[4].info = res.data.data.is_out;
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mine {
  width: 100%;
  min-height: 100vh;
  background: rgba(245, 245, 245, 1);
}
.header {
  background: url("../assets/mine/header_bg.png") no-repeat;
  background-size: 100% 100%;
}
.title {
  font-size: 0.2rem;
  color: #fff;
  background: transparent;
  padding: 8px 0 8px 15px;
  display: flex;
  justify-content: space-between;
}
.roleBtn {
  padding: 0 10px;
  border: none;
  margin: 3px 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.user {
  display: flex;
  padding: 15px;
}
.info {
  padding-left: 10px;
  line-height: 0.28rem;
  flex: 1;
  color: #ffffff;
}
.info p {
  font-size: 0.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.credit {
  font-size: 0.12rem;
  padding-left: 5px;
}
.num {
  font-size: 0.2rem;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 0.28rem;
}
.text {
  font-size: 0.12rem;
  color: rgba(51, 51, 51, 0.6);
  line-height: 0.17rem;
}
.box {
  padding: 15px 15px 0;
}
.typeText {
  font-size: 0.12rem;
  line-height: 0.16reme;
  padding-top: 8px;
}
.last {
  margin-top: 15px;
}
.tool {
  margin-bottom: 50px;
  background: #fff;
  border-radius: 10px;
}
</style>