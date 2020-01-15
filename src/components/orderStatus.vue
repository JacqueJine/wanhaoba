<template>
  <div class="order">
    <van-nav-bar :border="false" left-arrow @click-left="back()">
      <van-dropdown-menu slot="title">
        <van-dropdown-item v-model="title" :options="titleOption" @change="changeNav()" />
      </van-dropdown-menu>
    </van-nav-bar>
    <van-tabs
      v-model="active"
      :border="false"
      line-width="15px"
      color="#6C6AFF"
      @change="changeTab()"
    >
      <van-tab v-for="(item,index) in tab" :title="item" :key="index">
        <div v-if="active === 0" class="main">
          <div class="item" v-for="(item,index) in list" :key="index">
            <div class="itemInfo">
              <van-image
                class="infoImg"
                width=".85rem"
                height=".85rem"
                lazy-load
                radius="10px"
                :src="item.img==null?'':img+item.img[0]"
              />
              <div class="info">
                <li class="infoTitle">
                  <van-tag
                    v-if="title=='number'"
                    :color="item.sell_type?'#FF3131':'#696FFF'"
                    class="tagRight"
                  >{{item.sell_type?'出售':'出租'}}</van-tag>
                  <van-tag
                    v-if="title=='gift'"
                    :color="item.type?'#FF3131':'#696FFF'"
                    class="tagRight"
                  >{{!item.type?'出售':'求购'}}</van-tag>
                  <span>{{title==='number'?item.title:item.name_id}}</span>
                </li>
                <li class="tag" v-if="title==='number'">
                  <van-tag
                    color="rgba(153,153,153,0.1)"
                    text-color="rgba(51,51,51,0.4)"
                    v-if="item.phone_id"
                  >{{item.phone_id}}</van-tag>
                  <van-tag
                    v-if="!item.sell_type"
                    color="rgba(153,153,153,0.1)"
                    text-color="rgba(51,51,51,0.4)"
                  >{{item.mintime}}小时起租</van-tag>
                  <van-tag
                    v-if="!item.sell_type&&!item.cash_price"
                    color="rgba(153,153,153,0.1)"
                    text-color="rgba(51,51,51,0.4)"
                  >免押金</van-tag>
                </li>
                <li class="total">
                  <b v-if="title==='number'">￥{{!item.sell_type?item.rent.price:item.price}}</b>
                  <b v-if="title==='gift'">￥{{item.price}}</b>
                  <span class="num" v-if="!item.type&&title==='number'">已售{{item.out_count}}次</span>
                  <span
                    class="num"
                    v-if="title==='gift'"
                  >{{item.type?item.ask_sum:item.gift_number}}件</span>
                </li>
              </div>
            </div>
            <div class="itemBtn">
              <p class="countDown bgBlue" v-if="item.count_down">
                出售中倒计时：
                <van-count-down class="time" :time="item.count_down" />
              </p>
              <van-button
                plain
                size="small"
                style="margin-right:10px"
                round
                type="danger"
                @click="isPutaway(item.id)"
              >下架</van-button>
              <van-button
                :disabled="item.is_stick==1"
                plain
                size="small"
                round
                color="#696FFF"
                @click="goTop(index)"
              >{{item.is_stick==1?'置顶中':item.is_stick==0?'置顶':''}}</van-button>
            </div>
          </div>
        </div>
        <div v-else-if="active === 1" class="main">
          <div class="item" v-for="(item,index) in list" :key="index">
            <div class="itemInfo">
              <van-image
                class="infoImg"
                width=".85rem"
                height=".85rem"
                lazy-load
                radius="10px"
                :src="item.img==null?'':img+item.img[0]"
              />
              <div class="info">
                <li class="infoTitle">
                  <van-tag
                    v-if="title=='number'"
                    :color="item.sell_type?'#FF3131':'#696FFF'"
                    class="tagRight"
                  >{{item.sell_type?'出售':'出租'}}</van-tag>
                  <van-tag
                    v-if="title=='gift'"
                    :color="item.type?'#FF3131':'#696FFF'"
                    class="tagRight"
                  >{{!item.type?'出售':'求购'}}</van-tag>
                  <span>{{title==='number'?item.title:item.name_id}}</span>
                </li>
                <li class="tag" v-if="title==='number'">
                  <van-tag
                    color="rgba(153,153,153,0.1)"
                    text-color="rgba(51,51,51,0.4)"
                    v-if="item.phone_id"
                  >{{item.phone_id}}</van-tag>
                  <van-tag
                    v-if="!item.sell_type"
                    color="rgba(153,153,153,0.1)"
                    text-color="rgba(51,51,51,0.4)"
                  >{{item.mintime}}小时起租</van-tag>
                  <van-tag
                    v-if="!item.sell_type&&!item.cash_price"
                    color="rgba(153,153,153,0.1)"
                    text-color="rgba(51,51,51,0.4)"
                  >免押金</van-tag>
                </li>
                <li class="total">
                  <b v-if="title==='number'">￥{{!item.sell_type?item.rent.price:item.price}}</b>
                  <b v-if="title==='gift'">￥{{item.price}}</b>
                  <span class="num" v-if="!item.type&&title==='number'">已售{{item.out_count}}次</span>
                  <span
                    class="num"
                    v-if="title==='gift'"
                  >{{item.type?item.ask_sum:item.gift_number}}件</span>
                </li>
              </div>
            </div>
            <div class="itemBtn">
              <van-button
                plain
                size="small"
                round
                type="danger"
                @click="delGoods(item.id)"
              >删除</van-button>
              <van-button plain size="small" round color="#696FFF" @click="isPutaway(item.id)">上架</van-button>
              <van-button
                plain
                size="small"
                round
                color="#696FFF"
                @click="edit(item.sell_type,item.id,item.sell_mid)"
              >编辑</van-button>
            </div>
          </div>
        </div>
        <div v-else-if="active === 2" class="main">
          <div class="item" v-for="(item,index) in list" :key="index">
            <div class="itemInfo">
              <van-image
                class="infoImg"
                width=".85rem"
                height=".85rem"
                lazy-load
                radius="10px"
                :src="item.img==null?'':img+item.img[0]"
              />
              <div class="info">
                <li class="infoTitle">
                  <van-tag
                    v-if="title=='number'"
                    :color="item.sell_type?'#FF3131':'#696FFF'"
                    class="tagRight"
                  >{{item.sell_type?'出售':'出租'}}</van-tag>
                  <van-tag
                    v-if="title=='gift'"
                    :color="item.type?'#FF3131':'#696FFF'"
                    class="tagRight"
                  >{{!item.type?'出售':'求购'}}</van-tag>
                  <span>{{title==='number'?item.title:item.name_id}}</span>
                </li>
                <li class="tag" v-if="title==='number'">
                  <van-tag
                    color="rgba(153,153,153,0.1)"
                    text-color="rgba(51,51,51,0.4)"
                    v-if="item.phone_id"
                  >{{item.phone_id}}</van-tag>
                  <van-tag
                    v-if="!item.sell_type"
                    color="rgba(153,153,153,0.1)"
                    text-color="rgba(51,51,51,0.4)"
                  >{{item.mintime}}小时起租</van-tag>
                  <van-tag
                    v-if="!item.sell_type&&!item.cash_price"
                    color="rgba(153,153,153,0.1)"
                    text-color="rgba(51,51,51,0.4)"
                  >免押金</van-tag>
                </li>
                <li class="total">
                  <b v-if="title==='number'">￥{{!item.sell_type?item.rent.price:item.price}}</b>
                  <b v-if="title==='gift'">￥{{item.price}}</b>
                  <!-- <span class="num" v-if="!item.type&&title==='number'">已售{{item.out_count}}次</span> -->
                  <span
                    class="num"
                    v-if="title==='gift'"
                  >{{item.type?item.ask_sum:item.gift_number}}件</span>
                </li>
              </div>
            </div>
            <div class="itemBtn">
              <van-button
                plain
                size="small"
                round
                type="danger"
                @click="delGoods(item.id,'终止审核')"
              >终止审核</van-button>
              <!-- <van-button plain size="small" round color="#696FFF">付款</van-button> -->
            </div>
          </div>
        </div>
        <div v-else-if="active === 3" class="main">
          <div class="item" v-for="(item,index) in list" :key="index">
            <div class="itemInfo">
              <van-image
                class="infoImg"
                width=".85rem"
                height=".85rem"
                lazy-load
                radius="10px"
                :src="item.img==null?'':img+item.img[0]"
              />
              <div class="info">
                <li class="infoTitle">
                  <van-tag
                    v-if="title=='number'"
                    :color="item.sell_type?'#FF3131':'#696FFF'"
                    class="tagRight"
                  >{{item.sell_type?'出售':'出租'}}</van-tag>
                  <van-tag
                    v-if="title=='gift'"
                    :color="item.type?'#FF3131':'#696FFF'"
                    class="tagRight"
                  >{{!item.type?'出售':'求购'}}</van-tag>
                  <span>{{title==='number'?item.title:item.name_id}}</span>
                </li>
                <li class="tag" v-if="title==='number'">
                  <van-tag
                    color="rgba(153,153,153,0.1)"
                    text-color="rgba(51,51,51,0.4)"
                    v-if="item.phone_id"
                  >{{item.phone_id}}</van-tag>
                  <van-tag
                    v-if="!item.sell_type"
                    color="rgba(153,153,153,0.1)"
                    text-color="rgba(51,51,51,0.4)"
                  >{{item.mintime}}小时起租</van-tag>
                  <van-tag
                    v-if="!item.sell_type&&!item.cash_price"
                    color="rgba(153,153,153,0.1)"
                    text-color="rgba(51,51,51,0.4)"
                  >免押金</van-tag>
                </li>
                <li class="total">
                  <b v-if="title==='number'">￥{{!item.sell_type?item.rent.price:item.price}}</b>
                  <b v-if="title==='gift'">￥{{item.price}}</b>
                  <span class="num" v-if="!item.type&&title==='number'">已售{{item.out_count}}次</span>
                  <span
                    class="num"
                    v-if="title==='gift'"
                  >{{item.type?item.ask_sum:item.gift_number}}件</span>
                </li>
              </div>
            </div>
            <div class="itemBtn">
              <van-button plain size="small" round type="danger" @click="delGoods(item.id,'删除')">删除</van-button>
            </div>
          </div>
        </div>
        <div v-else-if="active === 4" class="main">
          <div class="item" v-for="(item,index) in list" :key="index">
            <div class="itemInfo">
              <van-image
                class="infoImg"
                width=".85rem"
                height=".85rem"
                lazy-load
                radius="10px"
                :src="item.img==null?'':img+item.img[0]"
              />
              <div class="info">
                <li class="infoTitle">
                  <van-tag
                    v-if="title=='number'"
                    :color="item.sell_type?'#FF3131':'#696FFF'"
                    class="tagRight"
                  >{{item.sell_type?'出售':'出租'}}</van-tag>
                  <van-tag
                    v-if="title=='gift'"
                    :color="item.type?'#FF3131':'#696FFF'"
                    class="tagRight"
                  >{{!item.type?'出售':'求购'}}</van-tag>
                  <span>{{title==='number'?item.title:item.name_id}}</span>
                </li>
                <li class="tag" v-if="title==='number'">
                  <van-tag
                    color="rgba(153,153,153,0.1)"
                    text-color="rgba(51,51,51,0.4)"
                    v-if="item.phone_id"
                  >{{item.phone_id}}</van-tag>
                  <van-tag
                    v-if="!item.sell_type"
                    color="rgba(153,153,153,0.1)"
                    text-color="rgba(51,51,51,0.4)"
                  >{{item.mintime}}小时起租</van-tag>
                  <van-tag
                    v-if="!item.sell_type&&!item.cash_price"
                    color="rgba(153,153,153,0.1)"
                    text-color="rgba(51,51,51,0.4)"
                  >免押金</van-tag>
                </li>
                <li class="total">
                  <b v-if="title==='number'">￥{{!item.sell_type?item.rent.price:item.price}}</b>
                  <b v-if="title==='gift'">￥{{item.price}}</b>
                  <!-- <span class="num" v-if="!item.type&&title==='number'">已售{{item.out_count}}次</span> -->
                  <span
                    class="num"
                    v-if="title==='gift'"
                  >{{item.type?item.ask_sum:item.gift_number}}件</span>
                </li>
              </div>
            </div>
            <div class="itemBtn">
              <van-button
                plain
                size="small"
                round
                type="danger"
                @click="showPwd=true;form.id=item.id"
              >修改密码</van-button>
              <!-- <van-button plain size="small" round color="#696FFF">付款</van-button> -->
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <van-action-sheet v-model="showPwd" title="修改密码">
      <van-cell-group>
        <van-field v-model="form.name" placeholder="请输入账号" />
        <van-field v-model="form.pwd" placeholder="请输入密码" />
        <div style="padding:15px;">
          <van-button type="info" round @click="editPwd()" style="width:100%">确定</van-button>
        </div>
      </van-cell-group>
    </van-action-sheet>
  </div>
</template>

<script>
export default {
  name: "orderStatus",
  data() {
    return {
      active: 0,
      form: {
        id: "",
        name: "",
        pwd: ""
      },
      showPwd: false,
      tab: ["已上架", "已下架", "待审核", "未通过", "改密码"],
      time: 30 * 60 * 60 * 1000,
      titleOption: [
        { text: "账号管理", value: "number" },
        { text: "礼物管理", value: "gift" }
      ],
      title: "number",
      list: [],
      img: this.$global.imgUrl,
      up_down: 0,
      id: []
    };
  },
  mounted() {
    document.getElementsByClassName("van-nav-bar")[0].style.cssText =
      "z-index:10";
    // if (this.$route.query.id == undefined) {
    //   this.active = 4;
    // } else {
    //   this.active = Number(this.$route.query.id);
    // }
    // this.is_seller = this.$route.query.is_seller;
    // this.getList();
    this.active = Number(this.$route.query.id);
    if (this.$route.query.id == 4) {
      this.getPwd();
    } else {
      this.getList();
    }
    this.is_seller = this.$route.query.is_seller;
  },
  methods: {
    editPwd() {
      this.$axios({
        url: this.$global.url + "root/numberOrder/password" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            id: this.form.id,
            account_number: this.form.name,
            pwd: this.form.pwd
          }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.$notify({
              type: "success",
              message: res.data.msg
            });
            this.showPwd = false;
            this.getPwd();
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
    getPwd() {
      this.list = [];
      this.$axios({
        url: this.$global.url + "root/numberOrder/pwdList" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            mid: localStorage.getItem("mid")
          }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.list = res.data.data;
          } else if (res.data.code == 0) {
            this.list = [];
            this.$notify({
              message: "暂无数据",
              type: "warning"
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
    changeTab() {
      if (this.active == 4) {
        this.getPwd();
      } else {
        this.getList();
      }
    },
    // 编辑账号礼物信息
    edit(sell_type, id,sell_mid) {
      if (this.title == "number") {
        if (sell_type == 1) {
          this.$router.push({ path: "/editSell", query: { id: id,sell_mid:sell_mid } });
        } else {
          this.$router.push({ path: "/editRent", query: { id: id,sell_mid:sell_mid } });
        }
      } else {
        this.$router.push({ path: "/editGift", query: { id: id,sell_mid:sell_mid } });
      }
    },
    changeNav() {
      console.log(this.title);
      if (this.title == "number") {
        this.tab = ["已上架", "已下架", "待审核", "未通过", "改密码"];
        this.active=0;
        this.getList();
      } else {
        this.tab = ["已上架", "已下架", "待审核", "未通过"];
        this.active=0;
        this.getList();
      }
    },
    goTop(index) {
      localStorage.setItem("topGoods", JSON.stringify(this.list[index]));
      this.$router.push({ path: "/toTop", query: { title: this.title } });
    },
    back() {
      this.$router.push({ path: "/seller" });
    },
    getList() {
      this.list = [];
      this.$axios({
        url: this.$global.url + "api/numberOrder/isPutaway" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          // data: {
          mid: localStorage.getItem("mid"),
          goods: this.title,
          is_putaway: this.active
          // }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.list = res.data.data;
          } else if (res.data.code == 0) {
            this.list = [];
            this.$notify({
              message: "暂无数据",
              type: "warning"
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
    //修改商品上下架
    isPutaway(id) {
      this.id = [];
      this.id.push(id);
      //下架
      if (this.active == 0) {
        this.up_down = 1;
      }
      //上架
      else if (this.active == 1) {
        this.up_down = 0;
      }
      this.$axios({
        url: this.$global.url + "root/common/isPutaway" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          goods: this.title,
          is_putaway: this.up_down,
          id: this.id
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.getList();
            this.$notify({
              message: res.data.msg,
              type: "success"
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
    //删除下架商品  终止审核
    delGoods(id, title) {
      this.id = [];
      this.id.push(id);
      let tit = "删除";
      let mes = "确定要删除吗？此过程不可逆！！！";
      if (title == "终止审核") {
        tit = "终止审核";
        mes = "确定要终止吗？此过程不可逆！！！";
      }
      this.$dialog
        .confirm({
          title: tit,
          message: mes
        })
        .then(() => {
          this.$axios({
            url: this.$global.url + "root/common/delGoods" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              goods: this.title,
              id: this.id
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.getList();
                this.$notify({
                  message: res.data.msg,
                  type: "success"
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
        })
        .catch(() => {
          // on cancel
        });
    }
  }
};
</script>
<style scoped>
.order {
  width: 100%;
  min-height: 100vh;
  background: rgba(245, 245, 245, 1);
}
.main {
  padding: 0.15rem;
}
.item {
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 15px;
  background: #fff;
}
.itemInfo {
  padding: 0.15rem 0.15rem;
  display: flex;
}
.info {
  flex: 1;
  padding-left: 0.15rem;
}
.infoImg {
  border: 1px solid rgba(51, 51, 51, 0.1);
  box-sizing: border-box;
}
.infoTitle {
  font-size: 0.13rem;
  font-weight: 600;
  color: #333333;
  line-height: 0.2rem;
  height: 0.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.total {
  font-size: 0.11rem;
  color: #999;
}
.total b {
  font-size: 0.15rem;
  color: #ff3131;
}
.num {
  float: right;
  line-height: 0.2rem;
}
.tag {
  padding: 0.03rem 0;
}
.itemBtn {
  padding: 0 0.15rem 0.15rem 1rem;
  text-align: right;
}
.countDown {
  width: 100%;
  height: 0.31rem;
  font-size: 0.14rem;
  color: #ffffff;
  line-height: 0.31rem;
  text-align: center;
  border-radius: 5px;
  margin-bottom: 0.15rem;
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