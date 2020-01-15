<template>
  <div class="mine">
    <div class="header">
      <div class="title">
        <span>我是买家</span>
        <van-button
          class="roleBtn"
          round
          color="rgba(255,255,255,0.2)"
          size="mini"
          @click="toSeller"
        >
          我是卖家
          <!-- <van-icon name="exchange" size="16px" style="padding:0 3px;" /> -->
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
        <router-link to="/message" class="h_img"></router-link>
        <div class="info">
          <p>
            {{user.user_name}}&nbsp;
            <span
              style="font-size:.12rem;color:rgba(255,255,255,.8)"
            >id:{{user.user_number}}</span>
          </p>
          <van-tag round color="#FFFFFF" text-color="#6771FF">{{role}}</van-tag>
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
      <van-grid-item :to="{path:'/sugar'}">
        <p class="num">{{user.candies}}</p>
        <p class="text">糖果</p>
      </van-grid-item>
      <van-grid-item to="/collect">
        <p class="num">{{user.collect_count}}</p>
        <p class="text">收藏</p>
      </van-grid-item>
    </van-grid>
    <div class="box">
      <van-cell
        title="账号订单"
        style="background: transparent;"
        value="全部"
        is-link
        @click="goOrder(6,'number')"
      ></van-cell>
      <van-grid :border="false" :column-num="4" style="border-radius:10px;overflow: hidden;">
        <van-grid-item
          v-for="(item,index) in orderTab"
          @click="goOrder(item.value,'number')"
          :key="index"
        >
          <van-icon :name="item.img" size=".33rem" :info="item.info" />
          <!-- <van-image lazy-load width=".33rem" height=".32rem" :src="item.img" /> -->
          <span class="typeText">{{item.title}}</span>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="box">
      <van-cell
        title="礼物订单"
        style="background: transparent;"
        value="全部"
        is-link
        @click="goOrder(6,'gift')"
      ></van-cell>
      <van-grid :border="false" :column-num="4" style="border-radius:10px;overflow: hidden;">
        <van-grid-item
          v-for="(item,index) in orderTab1"
          @click="goOrder(item.value,'gift')"
          :key="index"
        >
          <van-icon :name="item.img" size=".33rem" :info="item.info" />
          <span class="typeText">{{item.title}}</span>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="box">
      <van-cell title="我的工具" style="background: transparent;"></van-cell>
      <van-cell title="个人设置" is-link to="/set" style="border-radius:10px;overflow: hidden;"></van-cell>
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
      orderTab: [
        // { title: "待付款", img: require("../assets/mine/daifukuan.png") },

        {
          title: "租用中",
          img: require("../assets/mine/zuyongzhong.png"),
          value: 2,
          info: ""
        },
        {
          title: "已购买",
          img: require("../assets/mine/yigoumai.png"),
          value: 3,
          info: ""
        },
        {
          title: "已租用",
          img: require("./../../static/img/mine/yizuyong.png"),
          value: 4,
          info: ""
        },
        {
          title: "售后",
          img: require("./../../static/img/mine/shouhou.png"),
          value: 5,
          info: ""
        }
      ],
      orderTab1: [
        {
          title: "待发货",
          img: require("../assets/mine/daifukuan.png"),
          value: 0,
          info: ""
        },
        {
          title: "已发货",
          img: require("../assets/mine/daifukuan.png"),
          value: 1,
          info: ""
        },
        {
          title: "已购买",
          img: require("../assets/mine/yigoumai.png"),
          value: 3,
          info: ""
        },
        {
          title: "完成",
          img: require("../assets/mine/shouhou.png"),
          value: 4,
          info: ""
        }
      ],
      user: "",
      img: require("./../assets/index/touxiang.png"),
      head_img: "",
      role: "",
      is_seller: 0,
      imgurl: this.$global.imgUrl
    };
  },
  mounted() {
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
          this.$router.push("/index");
        });
      return false;
    }
    this.getMemberlist();
    this.getOrderCount();
    setTimeout(() => {
      if (localStorage.getItem("role") == "个人") {
        this.role = "普通用户";
      } else if (localStorage.getItem("role") == "商家") {
        this.role = "商家";
      }
    }, 2000);
  },
  methods: {
    // 账号订单
    goOrder(index, title) {
      this.$router.push({
        path: "/order",
        query: { id: index, is_seller: this.is_seller, title: title }
      });
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
            // 改变商家/个人的状态
            if (
              res.data.data.is_merch == 1 &&
              localStorage.getItem("role") != "商家"
            ) {
              localStorage.setItem("role", "商家");
            } else if (
              res.data.data.is_merch == 0 &&
              localStorage.getItem("role") != "个人"
            ) {
              localStorage.setItem("role", "个人");
            }
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
          type: 1
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            // 账号
            if (res.data.data.number_hire == 0) {
               this.orderTab[0].info = "";
            } else {
               this.orderTab[0].info = res.data.data.number_hire;
            }
            if (res.data.data.number_bought == 0) {
               this.orderTab[1].info = "";
            } else {
               this.orderTab[1].info = res.data.data.number_bought;
            }
            if (res.data.data.number_accomplish == 0) {
               this.orderTab[2].info = "";
            } else {
               this.orderTab[2].info = res.data.data.number_accomplish;
            }
            if (res.data.data.number_after == 0) {
               this.orderTab[3].info = "";
            } else {
               this.orderTab[3].info =  res.data.data.number_after;
            }
           
            //礼物
            if (res.data.data.gift_payment == 0) {
               this.orderTab1[0].info = "";
            } else {
               this.orderTab1[0].info = res.data.data.gift_payment;
            }
            if (res.data.data.gift_merch_shipped == 0) {
               this.orderTab1[1].info = "";
            } else {
               this.orderTab1[1].info = res.data.data.gift_merch_shipped;
            }
            if (res.data.data.gift_bought == 0) {
               this.orderTab1[2].info = "";
            } else {
               this.orderTab1[2].info = res.data.data.gift_bought;
            }
            if (res.data.data.gift_accomplish == 0) {
               this.orderTab1[3].info = "";
            } else {
               this.orderTab1[3].info = res.data.data.gift_accomplish;
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
    },

    //跳转卖家
    toSeller() {
      this.$router.push({ path: "/seller" });
      // // 0 不是商家不能跳转 1是商家
      // if (this.user.is_merch == 1) {
      //   this.$toast.fail("您还不是商家");
      // } else if (this.user.is_merch == 0) {

      // }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mine {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 50px;
  box-sizing: border-box;
  background: rgba(245, 245, 245, 1);
}
.header {
  background: url("../assets/mine/headerBg.png") no-repeat;
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
  padding: 15px;
}
.typeText {
  font-size: 0.12rem;
  line-height: 0.16rem;
  padding-top: 8px;
}
.h_img {
  width: 0.55rem;
  height: 0.55rem;
  position: absolute;
}
</style>