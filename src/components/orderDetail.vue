<template>
  <div class="news">
    <van-nav-bar left-arrow :border="false" class="head" fixed @click-left="back()">
      <van-icon slot="left" name="arrow-left" color="#fff" size="19px" />
      <span slot="title" class="headTitle">
        <van-icon name="checked" size="30px" color="#fff" />交易成功
      </span>
    </van-nav-bar>
    <div class="header">
      <van-cell
        class="headerCell"
        :border="false"
        :title="data.goods_title"
        style="font-size:.16rem;"
      />
      <van-cell
        class="headerCell"
        :border="false"
        :title="app.app_name"
        :icon="imgUrl+app.app_logo"
      >
        <van-image
          width=".15rem"
          height=".15rem"
          lazy-load
          :src="require('../assets/index/bao.png')"
        />
        <van-image
          width=".15rem"
          height=".15rem"
          lazy-load
          :src="require('../assets/index/shi.png')"
        />
        <van-image
          width=".15rem"
          height=".15rem"
          lazy-load
          :src="require('../assets/index/shou.png')"
        />
      </van-cell>
    </div>
    <div class="cellBox">
      <p class="groupTitle" slot="title">订单详情</p>
      <van-cell-group :border="false" class="account">
        <div class="num">
          <van-cell class="cellBg" :border="false">
            <van-row>
              <van-col span="8" class="label">账号：</van-col>
              <van-col span="16" class="cellValue">{{data.account_number}}</van-col>
            </van-row>
          </van-cell>
          <van-cell class="cellBg" :border="false">
            <van-row>
              <van-col span="8" class="label">密码：</van-col>
              <van-col span="16" class="cellValue">{{data.pwd}}</van-col>
            </van-row>
          </van-cell>
        </div>
        <van-cell :border="false">
          <van-row>
            <van-col span="6" class="label">下单时间：</van-col>
            <van-col span="18" class="cellValue">{{data.pay_time}}</van-col>
          </van-row>
        </van-cell>
        <van-cell :border="false">
          <van-row>
            <van-col span="6" class="label">订单编号：</van-col>
            <van-col span="18" class="cellValue">{{data.order_sn}}</van-col>
          </van-row>
        </van-cell>
        <p v-if="!data.type" class="countDown bgBlue">
          租用中倒计时：
          <van-count-down class="time" :time="data.count_down" />
        </p>
      </van-cell-group>
    </div>
    <div class="cellBox">
      <p class="groupTitle" slot="title">账号详情</p>
      <van-cell-group class="cellRadius">
        <van-cell>
          <van-row>
            <van-col span="6" class="label">游戏区服：</van-col>
            <van-col span="18" class="cellValue">{{data.service}}</van-col>
          </van-row>
        </van-cell>
        <van-cell>
          <van-row>
            <van-col span="6" class="label">段位等级：</van-col>
            <van-col span="18" class="cellValue">{{data.dan?data.dan:'无'}}</van-col>
          </van-row>
        </van-cell>
        <van-cell>
          <van-row>
            <van-col span="6" class="label">爵位等级：</van-col>
            <van-col span="18" class="cellValue">{{data.level_name?data.level_name:'无'}}</van-col>
          </van-row>
        </van-cell>
      </van-cell-group>
    </div>
    <div>
      <van-goods-action>
        <!-- <span class="money">
          合计
          <b>￥50</b>
        </span>-->
        <van-goods-action-button
          :disabled="data.status==5"
          :color="type?'#be99ff':'#7232dd'"
          :text="data.status!=5?'售后':'售后中'"
          @click="shouHou"
        />
        <van-goods-action-button
          v-if="data.type==0 && data.status!=4 && data.status!=5"
          color="#696fff"
          text="续费"
          @click="xufei"
        />
        <!-- <van-goods-action-button v-if="type" color="#7232dd" text="删除" @click="delOrder" /> -->
      </van-goods-action>
    </div>
  </div>
</template>
<script>
export default {
  name: "orderDetail",
  data() {
    return {
      imgUrl: this.$global.imgUrl,
      data: {},
      app: {},
      time: 30 * 60 * 60 * 1000, //无用
      type: true
    };
  },
  created() {
    if (this.$route.query.type) {
      this.type = false;
    }
    this.getData();
  },
  methods: {
    //售后
    shouHou() {
      this.$dialog
        .confirm({
          title: "售后",
          message:
            "确定要售后吗，您将无法查看订单详情，可选择截图保存，售后您可以联系卖家或平台为您处理问题！！！"
        })
        .then(() => {
          this.$axios({
            url: this.$global.url + "api/numberOrder/orderStatus" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              order_id: this.data.id
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.$notify({
                  message: res.data.msg,
                  type: "success"
                });
                this.$router.push({
                  path: "/order",
                  query: { id: 5, is_seller: 0, title: "number" }
                });

                // this.getData();
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
    },
    back() {
      this.$router.back(-1);
    },
    getData() {
      this.$axios({
        url: this.$global.url + "api/numberOrder/getOrder" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          order_id: this.$route.query.id
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.data = res.data.data;
            this.app = res.data.data.app;
          } else if (res.data.code == 0) {
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
    //用户续费
    xufei() {
      this.$router.push({
        path: "/confirmOrder",
        query: {
          id: this.data.number_id,
          order_id: this.data.id,
          sell_mid: this.data.sell_mid,
          mid: this.data.buy_mid,
          type: "续费"
        }
      });
    },
    //删除订单
    delOrder() {
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
              goods: "number",
              order_id: this.data.id
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.$notify({
                  message: res.data.msg,
                  type: "success"
                });
                this.back();
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.news {
  width: 100%;
  min-height: 100vh;
  background: rgba(245, 245, 245, 1);
  margin-top: 0.5rem;
}
.head {
  background: #6574ff;
  height: 0.5rem;
}
.headTitle {
  font-size: 0.2rem;
  color: #fff;
}
.header {
  background: linear-gradient(
    180deg,
    rgba(101, 116, 255, 1) 0%,
    rgba(112, 101, 255, 1) 100%
  );
  margin-bottom: 0.25rem;
}
.headerCell {
  background: transparent;
  color: #fff;
}
.cell {
  margin-top: 10px;
}
.cellTitle {
  display: flex;
  align-items: center;
}
.cellBg {
  background: rgba(51, 51, 51, 0.1);
  border-radius: 25px;
  margin-bottom: 15px;
}
.info {
  margin: 20px 15px 10px;
}
.grid {
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}
.cellBox {
  margin: 0 15px 20px;
}
.cellRadius {
  border-radius: 10px;
  overflow: hidden;
}
.label {
  font-size: 0.14rem;
  color: rgba(51, 51, 51, 0.4);
}
.account .cellValue {
  font-size: 0.14rem;
}
.cellValue {
  font-size: 0.12rem;
}
.groupTitle {
  font-size: 0.14rem;
  font-weight: bold;
  padding: 0 15px 10px;
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
.num {
  padding: 0.25rem 0.16rem 0;
}
.account {
  border-radius: 10px;
  overflow: hidden;
}
.money {
  width: 1.2rem;
  padding: 0 30px 0 15px;
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 0.12rem;
  color: rgba(51, 51, 51, 0.4);
}
.money b {
  font-size: 0.16rem;
  color: #ff3131;
}
.countDown {
  width: 2.15rem;
  height: 0.31rem;
  font-size: 0.14rem;
  color: #ffffff;
  line-height: 0.31rem;
  text-align: center;
  border-radius: 5px;
  margin: 0.15rem auto;
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
</style>