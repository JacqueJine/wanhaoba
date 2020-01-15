<template>
  <div class="news" v-if="data">
    <van-nav-bar title="商品详情" left-arrow :border="false" fixed @click-left="back()">
      <div @click="tishi" slot="right">
        <span>疑难解答</span>
        <van-icon name="warning-o" color="#333333" size=".16rem" />
      </div>
    </van-nav-bar>
    <van-swipe :autoplay="3000" @change="onChange">
      <van-swipe-item v-for="(item, index) in images" :key="index">
        <van-image width="100%" height="195" lazy-load :src="imgurl+item" @click="showimg" />
      </van-swipe-item>
      <div
        class="custom-indicator"
        slot="indicator"
        v-if="data.img"
      >{{ current + 1 }}/{{images.length}}</div>
      <img v-else width="100%" height="195" src alt="图片错误" />
    </van-swipe>
    <van-cell :value="data.title" style="font-size:.16rem" />
    <van-cell :title="app_id.app_name" :icon="imgurl+app_id.app_logo">
      <van-image
        v-if="typeof(data.mid)=='object'"
        width=".15rem"
        height=".15rem"
        lazy-load
        :src="require('../assets/index/bao.png')"
      />
      <van-image
        v-if="typeof(data.mid)=='object'"
        width=".15rem"
        height=".15rem"
        lazy-load
        :src="require('../assets/index/shi.png')"
      />
      <van-image
        v-if="typeof(data.mid)=='object'"
        width=".15rem"
        height=".15rem"
        lazy-load
        :src="require('../assets/index/shou.png')"
      />
      <div v-if="data.sell_type!=1" slot="label">
        <span>起租：{{data.mintime}}小时</span>
        <span>押金：{{data.cash_price!=0?data.cash_price:'免押金'}}</span>
      </div>
    </van-cell>
    <van-cell class="cell" style="font-size:.14rem" :value="data.mid!='平台'?'信誉分：'+data.credit:''" :is-link="data.mid!='平台'">
      <div slot="title" class="cellTitle">
        <van-icon
          size="20px"
          :name="data.mid=='平台'?require('./../assets/common/mess (2).png'):typeof(data.mid)=='object'?imgurl+data.mid.logo:require('./../assets/index/touxiang.png')"
        />
        <van-tag
          :color="data.mid=='平台'?'#7065FF':typeof(data.mid)=='object'?'#5AD27C':'#F1BF3D'"
          class="tagRight tagMargin"
          style="min-width:.3rem"
        >{{data.mid=='平台'?'平台':typeof(data.mid)=='object'?'商家':'个人'}}</van-tag>
        <span>{{data.mid=='平台'?'平台自营':typeof(data.mid)=='object'?data.mid.title:data.mid}}</span>
      </div>
    </van-cell>
    <div class="info">
      <van-grid v-if="data.sell_type!=1" :column-num="4" :border="false" square class="grid">
        <van-grid-item class="option">
          <p>时租</p>
          <span class="typeText">{{rent_id[0].price}}</span>
        </van-grid-item>
        <van-grid-item class="option">
          <p>包夜</p>
          <span class="typeText">{{rent_id[1].price}}</span>
        </van-grid-item>
        <van-grid-item class="option">
          <p>天租</p>
          <span class="typeText">{{rent_id[2].price}}</span>
        </van-grid-item>
        <van-grid-item class="option">
          <p>周租</p>
          <span class="typeText">{{rent_id[3].price}}</span>
        </van-grid-item>
      </van-grid>
    </div>
    <div v-if="data.sell_type!=1" class="cellBox">
      <van-cell-group class="cellRadius">
        <van-cell>
          <van-row>
            <van-col span="6" class="label">包夜时段</van-col>
            <van-col span="18" class="cellValue">{{rent_id[1].start_time+'-'+rent_id[1].end_time}}</van-col>
          </van-row>
        </van-cell>
      </van-cell-group>
    </div>
    <div v-if="data.sell_type!=1" class="cellBox">
      <van-cell-group class="cellRadius">
        <van-cell>
          <van-row>
            <van-col span="6" class="label">可租时间：</van-col>
            <van-col span="18" class="cellValue">{{data.start_time}}-{{data.over_time}}</van-col>
          </van-row>
        </van-cell>
        <van-cell>
          <van-row>
            <van-col span="6" class="label">起租方式：</van-col>
            <van-col span="18" class="cellValue">{{data.mintime}}小时起租</van-col>
          </van-row>
        </van-cell>
      </van-cell-group>
    </div>
    <div class="cellBox">
      <p class="groupTitle" slot="title">账号详情</p>
      <van-cell-group class="cellRadius">
        <van-cell>
          <van-row>
            <van-col span="6" class="label">登录方式：</van-col>
            <van-col span="18" class="cellValue">{{login}}</van-col>
          </van-row>
        </van-cell>
        <van-cell>
          <van-row>
            <van-col span="6" class="label">游戏性别：</van-col>
            <van-col span="18" class="cellValue">{{data.sex==1?'男':data.sex==2?'女':'无'}}</van-col>
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
        <van-cell>
          <van-row>
            <van-col span="6" class="label">操作系统：</van-col>
            <van-col span="18" class="cellValue">{{data.phone_id}}</van-col>
          </van-row>
        </van-cell>
        <van-cell>
          <van-row>
            <van-col span="6" class="label">所在大区：</van-col>
            <van-col span="18" class="cellValue">{{data.service_id}}</van-col>
          </van-row>
        </van-cell>
        <!-- <van-cell>
          <van-row>
            <van-col span="6" class="label">服务器：</van-col>
            <van-col span="18" class="cellValue"></van-col>
          </van-row>
        </van-cell>-->
        <!-- <van-cell>
          <van-row>
            <van-col span="6" class="label">详细描述：</van-col>
            <van-col span="18" class="cellValue"></van-col>
          </van-row>
        </van-cell>-->
      </van-cell-group>
    </div>
    <div v-if="data.sell_type!=1" class="cellBox">
      <p class="groupTitle" slot="title">账号要求</p>
      <van-cell-group class="cellRadius">
        <van-cell>
          <van-row>
            <van-col span="6" class="label">购买门槛：</van-col>
            <van-col
              span="18"
              class="cellValue"
            >{{data.buy_require!='0'?'不得低于'+data.buy_require+'分':'无'}}</van-col>
          </van-row>
        </van-cell>
      </van-cell-group>
    </div>
    <div class="cellBox" style="margin-bottom:0">
      <p class="groupTitle" slot="title">推荐账号</p>
    </div>
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
    <div>
      <p v-if="data.is_buyout" class="tip" @click="goBuyout">
        <span>我要买断：￥{{data.buyout_price}}</span>
        <van-icon name="arrow" />
      </p>
      <van-goods-action>
        <van-goods-action-icon @click="collectGoods">
          <van-icon slot="icon" :name="collect?'like':'like-o'" :color="collect?'red':''" />
        </van-goods-action-icon>
        <van-goods-action-button
          :color="data.is_sell?'#D8D8D8':'linear-gradient(to bottom, #6574FF, #7065FF)'"
          :disabled="(data.is_out==1&&data.reserve!='未预约')"
          @click="goConfirmOrder()"
          :text="data.is_out&&data.reserve=='未预约'?'预约':data.is_out&&data.reserve!='未预约'?'已预约':'立即下单'"
        />
        <!-- <van-goods-action-button
          v-if="data.reserve=='未预约'&&data.is_out"
          :color="data.is_sell?'#D8D8D8':'linear-gradient(to bottom, #6574FF, #7065FF)'"
          @click="goConfirmOrder()"
          :text="data.is_out?'预约':'立即下单'"
        />-->
      </van-goods-action>
    </div>
  </div>
</template>
<script>
import { ImagePreview } from "vant";
export default {
  name: "goodsDetail",
  data() {
    return {
      current: 0,
      imgurl: this.$global.imgUrl,
      images: [],
      data: "",
      info: [
        { title: "登录方式：", value: "QQ登录 账号密码登录" },
        { title: "游戏性别：", value: "女" },
        { title: "段位等级：", value: "王者" },
        { title: "爵位等级：", value: "国王" },
        { title: "操作系统：", value: "通用" },
        { title: "客户端：", value: "通用" },
        { title: "所在大区：", value: "女" },
        { title: "服务器：", value: "通用" },
        {
          title: "详细描述：",
          value: "描述内容描述内容描述内容描述内容描述内容"
        }
      ],
      tab: 0,
      list: [],
      loading: false,
      finished: false,
      app_id: "",
      rent_id: [
        {
          price: ""
        },
        {
          price: ""
        },
        {
          price: ""
        },
        {
          price: ""
        }
      ],
      collect: false,
      // 图片预览
      img_: [],
      loginList: [],
      login: "无"
    };
  },
  created() {
    this.getData();
    this.getIndexhot();
    this.getLogin();
    setTimeout(() => {
      for (let i = 0; i < this.loginList.length; i++) {
        if (this.loginList[i].id == this.data.login_method) {
          this.login = this.loginList[i].name;
        }
      }
    }, 1500);
  },

  mounted() {},
  methods: {
    tishi() {
      this.$dialog
        .alert({
          title: "提示",
          message:
            "成为商家可显示保（质保金）、实（实名认证）、手（手机号认证）等更多权限，使店铺更加尊贵，使商品更有保障！"
        })
        .then(() => {
          // on close
        });
    },
    goBuyout() {
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
      //出租中不可买断
      if (this.data.is_out == 1) {
        this.$toast("出租中不可买断！");
        return false;
      }
      this.$router.push({
        path: "/confirmOrder",
        query: { id: this.$route.query.id, type: 1 }
      });
      // this.$router.go(0);
    },
    back() {
      this.$router.back(-1);
    },
    onChange(index) {
      this.current = index;
    },
    showimg() {
      ImagePreview({
        images: this.img_,
        startPosition: this.current
      });
    },
    goConfirmOrder() {
      // 判断时间段内是否可以出租
      let d = new Date();
      let h = d.getHours();
      let m = d.getMinutes();
      h < 10 ? (h = "0" + h) : h;
      m < 10 ? (m = "0" + m) : m;
      //获取系统时，
      let nowtime = h + ":" + m;
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
      //出租中可预约
      if (this.data.is_out) {
        if (this.data.is_reserve) {
          this.$toast("不可重复预约！");
        } else {
          //预约
          this.$axios({
            url: this.$global.url + "api/user/addReserve" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              number_id: this.$route.query.id,
              mid: localStorage.getItem("mid")
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.getData();
                this.$toast("已预约！");
              } else if (res.data.code == 0) {
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
      //已出售
      else if (this.data.is_sell) {
        this.$toast("暂无商品！");
      } else {
        if (this.data.sell_type == 0) {
          if (
            !this.time_range(this.data.start_time, this.data.over_time, nowtime)
          ) {
            return false;
          }
        }
        this.$router.push({
          path: "/confirmOrder",
          query: { id: this.$route.query.id }
        });
      }
    },
    //判断时间段函数
    time_range(beginTime, endTime, nowTime) {
      var strb = beginTime.split(":");
      if (strb.length != 2) {
        return false;
      }

      var stre = endTime.split(":");
      if (stre.length != 2) {
        return false;
      }

      var strn = nowTime.split(":");
      if (stre.length != 2) {
        return false;
      }
      var b = new Date();
      var e = new Date();
      var n = new Date();

      b.setHours(strb[0]);
      b.setMinutes(strb[1]);
      e.setHours(stre[0]);
      e.setMinutes(stre[1]);
      n.setHours(strn[0]);
      n.setMinutes(strn[1]);

      if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
        return true;
      } else {
        this.$toast("不在可租用时间内！！");
        return false;
      }
    },
    //商品推荐
    getIndexhot() {
      this.$axios({
        url: this.$global.url + "api/number/indexHot" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          sell_type: 0
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
    goDetail(id, isSell,is_out) {
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
      }  else {
        this.$router.push({ path: "/goodsDetail", query: { id: id } });
        this.$router.go(0);
      }
    },
    //商品详情
    getData() {
      this.$axios({
        url: this.$global.url + "api/number/getGoods" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          id: this.$route.query.id,
          mid: localStorage.getItem("mid")
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.data = res.data.data;
            this.images = res.data.data.img;
            // 图片预览
            for (let i = 0; i < this.images.length; i++) {
              let img = this.$global.imgUrl + this.images[i];
              this.img_.push(img);
            }
            this.app_id = res.data.data.app_id;
            if (res.data.data.sell_type != 1) {
              this.rent_id = res.data.data.rent;
            }
            if (res.data.data.collect == "未收藏") {
              this.collect = false;
            } else if (res.data.data.collect == "已收藏") {
              this.collect = true;
            }
          } else if (res.data.code == 0) {
            this.data = [];
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
    //获取登录方式
    getLogin() {
      this.$axios({
        url: this.$global.url + "root/number/loginList" + ".html",
        method: "POST"
      })
        .then(res => {
          if (res.data.code == 1) {
            this.loginList = res.data.data;
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
    //收藏商品
    collectGoods() {
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
      if (this.collect) {
        this.$axios({
          url: this.$global.url + "api/common/collectGoodsDel" + ".html",
          method: "POST",
          data: this.$qs.stringify({
            mid: localStorage.getItem("mid"),
            goods_id: this.data.id
          })
        })
          .then(res => {
            if (res.data.code == 1) {
              this.collect = false;
              this.$toast("收藏已取消");
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
      } else {
        this.$axios({
          url: this.$global.url + "api/common/collectGoods" + ".html",
          method: "POST",
          data: this.$qs.stringify({
            mid: localStorage.getItem("mid"),
            goods_id: this.data.id
          })
        })
          .then(res => {
            if (res.data.code == 1) {
              this.collect = true;
              this.$toast("收藏成功");
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
    },
    //列表更新
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        this.loading = false;
      }, 500);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.news {
  width: 100%;
  background: rgba(245, 245, 245, 1);
  margin-top: 60px;
  padding-bottom: 100px;
}
.custom-indicator {
  position: absolute;
  bottom: 0.12rem;
  right: 0.34rem;
  font-size: 0.12rem;
  color: #fff;
  background: rgba(51, 51, 51, 0.6);
  padding: 3px 10px;
  border-radius: 10px;
}
.icon {
  color: red !important;
}
.cell {
  margin-top: 10px;
}
.cellTitle {
  display: flex;
  align-items: center;
}
.tagMargin {
  border-radius: 5px;
  margin: 0 5px 0 10px;
}
.info {
  margin: 20px 15px 10px;
}
.option {
  border-radius: 10px;
  overflow: hidden;
}
.grid {
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}
.option p {
  font-size: 0.14rem;
  color: rgba(51, 51, 51, 0.6);
  line-height: 0.2rem;
  padding-bottom: 10px;
}
.option span {
  font-size: 0.13rem;
  line-height: 0.22rem;
  font-weight: 500;
}
.active {
  background: #6673ff;
}
.cellBox {
  margin: 0 15px 20px;
}
.cellRadius {
  border-radius: 10px;
  overflow: hidden;
}
.label {
  font-size: 0.12rem;
  color: rgba(51, 51, 51, 0.4);
}
.cellValue {
  font-size: 0.12rem;
}
.groupTitle {
  font-size: 0.14rem;
  padding: 0 15px 10px;
}
.typeText {
  font-size: 0.13rem;
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

.tip {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  font-size: 0.12rem;
  background: #e7e7f6;
  position: fixed;
  width: 100%;
  bottom: 50px;
  box-sizing: border-box;
}
.item {
  display: flex;
  position: relative;
  margin: 15px;
  padding: 0;
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