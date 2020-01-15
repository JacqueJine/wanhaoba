<template>
  <div class="search">
    <van-search
      v-model="searchValue"
      placeholder="请输入搜索关键词"
      show-action
      shape="round"
      @blur="inputBlur"
      @search="onSearch"
      @cancel="onCancel"
    />
    <div v-if="showHistory">
      <div>
        <div>
          <van-icon name="fire" color="red" />
          <span>热门搜索</span>
        </div>
        <div>
          <div class="his-content">
            <span v-for="(item, index) in hot" :key="index" @click="searchHistory(item)">{{ item }}</span>
          </div>
        </div>
      </div>
      <div>
        <div class="history-clear">
          <span>历史记录</span>
          <van-icon name="delete" color="#000" @click="clearHistory" />
        </div>
        <div>
          <div class="his-content">
            <span
              v-for="(item, index) in history"
              :key="index"
              @click="searchHistory(item)"
            >{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
    <van-tabs v-if="!showHistory" v-model="active" @change="onSearch">
      <van-tab title="账号" name="number">
        <van-list
          v-if="active=='number'"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-cell v-for="(item,index) in dataList" :key="index" style="padding:10px 0">
            <div>
              <div class="item" @click="goDetail(item.id,item.is_sell)">
                <van-image
                  style="margin-right:10px"
                  width=".85rem"
                  height=".85rem"
                  lazy-load
                  :src="imgurl+item.img[0]"
                />
                <div class="chuzu" v-if="item.is_out">
                  <p>出租中</p>
                  <p>倒计时</p>
                  <p>
                    <van-count-down :time="item.count_down" style="color:#FFF" />
                  </p>
                </div>
                <div class="chuzu" v-if="item.is_sell">
                  <p>已出售</p>
                </div>
                <div style="flex: 1;">
                  <van-row>
                    <van-col span="17" class="flexItem">
                      <van-tag
                        :color="item.sell_type==0?'#7065FF':'#5AD27C'"
                        class="tagRight"
                      >{{item.sell_type==0?'出租':'出售'}}</van-tag>
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
                        v-else-if="item.mid!='平台'&&item.mid.level_id==1"
                        :name="require('../assets/merchant/yueliang.png')"
                      />
                      <van-icon
                        v-else-if="item.mid!='平台'&&item.mid.level_id==1"
                        :name="require('../assets/merchant/taiyang.png')"
                      />
                      <van-icon
                        v-else-if="item.mid!='平台'&&item.mid.level_id==1"
                        :name="require('../assets/merchant/huangguan.png')"
                      />
                      <van-icon
                        v-else-if="item.mid!='平台'&&item.mid.level_id==1"
                        :name="require('../assets/merchant/baoding.png')"
                      />
                      <van-image
                        v-if="item.mid!='平台'"
                        class="tag"
                        width=".15rem"
                        height=".15rem"
                        lazy-load
                        :src="require('../assets/index/bao.png')"
                      />
                      <van-image
                        v-if="item.mid!='平台'"
                        class="tag"
                        width=".15rem"
                        height=".15rem"
                        lazy-load
                        :src="require('../assets/index/shi.png')"
                      />
                      <van-image
                        v-if="item.mid!='平台'"
                        class="tag"
                        width=".15rem"
                        height=".15rem"
                        lazy-load
                        :src="require('../assets/index/shou.png')"
                      />
                    </van-col>
                    <van-col span="7" class="price">￥{{item.sell_type==0?item.rent.price:item.price}}</van-col>
                  </van-row>
                  <van-row>
                    <van-col span="17" class="dec">{{item.title}}</van-col>
                    <van-col v-if="!item.sell_type" span="7" class="spe">/1小时</van-col>
                  </van-row>
                  <van-row v-if="!item.sell_type">
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
                  <van-row v-if="item.sell_type">
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
      </van-tab>
      <van-tab title="礼物" name="gift">
        <van-list v-if="active=='gift'" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <van-cell v-for="(item,index) in dataList" :key="index" style="padding: 10px 0px">
            <div class="list">
              <ul>
                <li>
                  <van-image
                    lazy-load
                    width="85px"
                    height="85px"
                    radius="10px"
                    :src="item.img==null?'':imgurl+item.img[0]"
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
                    <van-row class="info_2">
                      <van-col span="16" class="title1">{{item.name_id}}</van-col>
                      <van-col span="8" class="btn">
                        <van-button
                          :span="8"
                          round
                          size="small"
                          color="linear-gradient(to bottom, #6574FF, #7065FF)"
                          @click="goPpxgift"
                        >购买</van-button>
                        
                      </van-col>
                    </van-row>
                    <div class="info_3">
                      <b>￥{{item.price}}</b>
                      <span
                        v-if="item.gift_number==0 || item.ask_sum"
                      >{{item.type==0&&item.gift_number==0?'已售空':item.type==1&&item.ask_sum==0?'已供应':''}}</span>
                      <span v-else>剩余{{item.type==0?item.gift_number:item.ask_sum}} 件</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </van-cell>
        </van-list>
      </van-tab>
      <van-tab title="店铺" name="merch">
        <van-list v-if="active=='merch'" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="(item,index) in dataList" style="padding:10px 0" :key="index">
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
                  <span class="cardColor">销量：10000</span>
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
                  <b>{{item.Category}}&nbsp;</b>
                  <b>王者荣耀&nbsp;</b>
                  <b>穿越火线&nbsp;</b>
                  <b>英雄联盟&nbsp;</b>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </van-cell>
    </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
export default {
  name: "search",
  data() {
    return {
      searchValue: "",
      history: [],
      hot: ["王者荣耀", "吃鸡", "皮皮蟹"],
      dataList: [],
      loading: false,
      finished: true,
      active: "number",
      page:1,
      imgurl: this.$global.imgUrl,
      numlist:0,
      showHistory:true
    };
  },
  mounted() {
    this.getHistorys();
  },
  methods: {
    goPpxgift() {
      this.$router.push({ path: "/ppxgift" });
    },
    goDetail(id, isSell) {
      if (isSell) {
        this.$notify({
          message: "该商品已出售！",
          type: "danger"
        });
      } else {
        this.$router.push({ path: "/goodsDetail", query: { id: id } });
      }
    },
    //取消
    onCancel() {
      this.$router.back(-1);
    },
    //搜索
    onSearch(value) {
      document.getElementsByTagName("input")[0].blur();
      this.showHistory=false
      this.finished=false
      this.loading=true
      this.dataList=[]
      this.$axios({
        url: this.$global.url + "api/number/search" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            type: this.active,
            search: this.searchValue,
            page: this.page,
            limit: 10
          }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.loading = false;
            for (let i = 0; i < res.data.data.length; i++) {
              this.dataList.push(res.data.data[i]);
            }
            if (res.data.count<=this.dataList.length) {
              this.finished = true;
            } else {
              this.finished = false;
            }
            this.numlist = res.data.count;
          } else if (res.data.code == 0) {
            this.loading = false;
            this.finished = true;
            this.dataList = [];
          }
        })
        .catch(e => {
          this.$notify({
            message: "网络较差，请稍后重试！",
            type: "danger"
          });
        });
    },
    //删除历史记录
    clearHistory() {
      this.history = [];
      localStorage.removeItem("historys");
    },
    // historys存入localStorage
    setHistorys() {
      // 搜索框有内容且不在历史记录里
      if (
        this.searchValue &&
        this.searchValue !== "" &&
        this.searchValue !== " " &&
        this.history.indexOf(this.searchValue) === -1
      ) {
        let Arr = Array.from(new Set(this.history));
        this.history = [this.searchValue, ...Arr];
      }
      // 历史记录只保存12条
      if (this.history && this.history.length && this.history.length > 6) {
        this.history = this.history.slice(0, 12);
      }
      localStorage.setItem("historys", JSON.stringify(this.history));
    },
    // historys获取localStorage
    getHistorys() {
      let history = localStorage.getItem("historys");
      if (history) {
        this.history = JSON.parse(history);
      }
    },
    //列表更新
    onLoad() {
      this.finished = false;
      if (this.numlist <= this.dataList.length) {
        return false;
      }
      this.page += 1;
      this.onSearch();
    },
    // 失去焦点
    inputBlur() {
      this.setHistorys();
    },
    //历史搜索
    searchHistory(item) {
      this.searchValue = item;
    }
  }
};
</script>
<style scoped>
.search {
  padding: 0.15rem;
}
.search p {
  height: 0.38rem;
  line-height: 0.38rem;
}
.search p input {
  width: 2.98rem;
  height: 0.38rem;
  border: none;
  outline: none;
  background: rgba(216, 216, 216, 0.4);
  text-align: center;
  margin-right: 0.15rem;
  border-radius: 19px;
}
::-webkit-input-placeholder {
  color: rgba(51, 51, 51, 0.4);
}
.history-clear {
  display: flex;
  justify-content: space-between;
  color: #aaa;
  padding: 10px 0 0 10px;
}
.his-content span {
  margin: 5px;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  background: #eff1f3;
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
.title1 {
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
</style>