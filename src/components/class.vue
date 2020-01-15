<template>
  <div style="margin-bottom:50px">
    <div class="all_head">
      <div class="header">
        <div class="headBtn">
          <span :class="!type?'actBtn':''" @click="changeType(0)">租号</span>
          <span :class="type?'actBtn':''" @click="changeType(1)">买号</span>
        </div>
        <router-link to="/search">
          <van-icon :name="require('../assets/common/sousuo.png')" size="20px" class="search" />
        </router-link>
      </div>
      <van-tabs
        :swipe-threshold="5"
        :border="false"
        v-model="activeTab"
        line-width=".15rem"
        color="#6C6AFF"
        @change="getData()"
        ref="van_tabs"
      >
        <van-tab v-for="(item,index) in tab" :title="item.title" :key="index"></van-tab>
      </van-tabs>
    </div>
    <van-index-bar style="padding-top:110px">
      <van-index-anchor index="A">
        <van-tag round color="#FF3131">热门</van-tag>
      </van-index-anchor>
      <van-grid :border="false">
        <van-grid-item
          v-for="(item,index) in dataList"
          :key="index"
          @click="goClassList(item.app_name,item.id)"
        >
          <van-image lazy-load width=".55rem" height=".55rem" :src="imgurl+item.app_logo" />
          <span class="gameName">{{item.app_name}}</span>
        </van-grid-item>
      </van-grid>

      <div>
        <van-index-anchor index="A">
          <van-tag round color="rgba(112,101,255,0.4)" style="padding: 0.1em 0.9em;">A</van-tag>
        </van-index-anchor>
        <van-grid :border="false">
          <van-grid-item
            v-for="(item,index) in dataList"
            :key="index"
            @click="goClassList(item.app_name,item.id)"
          >
            <van-image lazy-load width=".55rem" height=".55rem" :src="imgurl+item.app_logo" />
            <span class="gameName">{{item.app_name}}</span>
          </van-grid-item>
        </van-grid>
      </div>
    </van-index-bar>
    <tabbar></tabbar>
  </div>
</template>
<script>
import tabbar from "./public/tabbar.vue";
export default {
  name: "class",
  components: {
    tabbar
  },
  data() {
    return {
      type: 0,
      activeTab: 0,
      tab: [
        { title: "手游", id: 1 },
        { title: "端游", id: 2 },
        { title: "直播", id: 3 },
        { title: "语音", id: 4 },
        { title: "视频", id: 5 }
      ],
      indexList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      dataList: [],
      imgurl: this.$global.imgUrl
    };
  },
  created() {
    this.getData();
  },
  methods: {
    changeType(type) {
      this.type = type;
      this.getData();
    },
    goClassList(title, id) {
      this.$router.push({
        path: "/classList",
        query: { title: title, id: id, tab: this.type }
      });
    },
    //获取分类数据
    getData() {
      this.$axios({
        url: this.$global.url + "api/number/navigationClass" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            sell_type: this.type,
            type: this.activeTab + 1
          }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.dataList = res.data.data;
          } else if (res.data.code == 0) {
            this.dataList = [];
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.all_head {
  position: fixed;
  width: 100%;
  top: 0;
  background: #fff;
  z-index: 999;
}
.header {
  margin: 15px 0;
  position: relative;
}
.headBtn {
  width: 1.6rem;
  height: 0.3rem;
  border-radius: 14px;
  border: 1px solid rgba(106, 108, 255, 0.6);
  box-sizing: border-box;
  display: flex;
  margin: 0 auto;
}
.headBtn span {
  display: inline-block;
  width: 50%;
  height: 100%;
  border-radius: 13px;
  text-align: center;
  line-height: 0.3rem;
  font-weight: 500;
}
.actBtn {
  background: linear-gradient(
    180deg,
    rgba(101, 116, 255, 1) 0%,
    rgba(112, 101, 255, 1) 100%
  );
  color: #fff;
}
.search {
  position: absolute;
  top: 0;
  right: 10px;
  line-height: 0.28rem;
}
.gameName {
  text-align: center;
  font-size: 0.12rem;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  line-height: 0.25rem;
  min-height: 0.5rem;
  margin-top: 0.05rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
