<template>
  <div class="news">
    <van-nav-bar title="我的消息" fixed :right-text="rightText" @click-right="onRight">
      <!-- <van-icon name="bars" slot="right" color="#333333" size="16px" @click="plus()" /> -->
    </van-nav-bar>
    <!-- <div v-show="showbars" class="plus">
      <p @click="onClickRight">
        <span>批量删除</span>
      </p>
      <p @click="delMsg(1)">
        <span>清空列表</span>
      </p>
    </div>-->
    <van-cell :border="false" style="padding-top:46px">
      <template slot="title">
        <div style="display:flex">
          <van-image
            lazy-load
            width="55px"
            height="55px"
            style="margin:2px"
            :src="require('./../assets/common/mess (2).png')"
          />
          <div class="text">
            <p>官方客服</p>
            <p>您好，请说出您的问题</p>
          </div>
        </div>
      </template>
    </van-cell>
    <div class="message">
      <h3>消息通知</h3>
      <div class="msg" ref="message">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-checkbox-group v-model="result" ref="checkboxGroup" @change="result_">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
              <van-cell v-for="(item,index) in message" class="vanlist" :key="index">
                <div class="content">
                  <div class="check" v-show="show">
                    <van-checkbox :name="item.id"></van-checkbox>
                  </div>
                  <div style="width:100%;text-align:center">
                    <van-tag color="#D8D8D8">{{item.add_time}}</van-tag>
                    <van-panel class="card">
                      <div slot="header" class="msgHead">
                        <van-image
                          lazy-load
                          width="36px"
                          height="36px"
                          :src="require('./../assets/common/mess (3).png')"
                        />
                        <p>{{item.type}}，{{item.remark}}，{{item.account_type}}：{{item.price}}</p>
                      </div>
                      <!-- <div slot="footer" class="msgFoot">
              <span>查看详情</span>
                      </div>-->
                    </van-panel>
                  </div>
                </div>
              </van-cell>
            </van-list>
          </van-checkbox-group>
        </van-pull-refresh>
      </div>
    </div>
    <div class="all" v-show="show">
      <p>
        <span @click="checkAll">
          <van-checkbox v-model="checked">全选</van-checkbox>
        </span>
        <span style="line-height:27px" @click="onClickRight">取消</span>
        <span @click="delMsg(0)">删除</span>
      </p>
    </div>
    <tabbar></tabbar>
  </div>
</template>
<script>
import tabbar from "./public/tabbar.vue";
export default {
  name: "news",
  components: {
    tabbar
  },
  data() {
    return {
      isLoading: false,
      checked: false,
      result: [],
      showbars: false,
      message: [],
      show: false,
      page: 1,
      loading: false,
      finished: false,
      numlist: 0,
      rightText:"切换卖家",
    };
  },
  created() {
    this.getAccountLog();
  },
  methods: {
    //删除消息
    delMsg(ind) {
      let arr = this.result;
      if (ind) {
        arr = "";
      }
      this.$axios({
        url: this.$global.url + "api/user/accountDel" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          mid: localStorage.getItem("mid"),
          id: arr
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.result = [];
            if (!ind) {
              this.onClickRight();
            }
            this.$notify({
              message: res.data.msg,
              type: "success"
            });
            this.getAccountLog();
          } else if (res.data.code == 0) {
            this.$notify({
              message: res.data.msg,
              type: "danger"
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
    plus() {
      this.showbars = !this.showbars;
    },
    //点击切换卖家卖家信息
    onRight(){
      if(this.rightText=='切换卖家'){
        this.rightText='切换买家'
      }else{
        this.rightText='切换卖家'
      }
    },
    //选择时触发
    result_() {
      if (this.result.length == this.message.length) {
        this.checked = true;
      } else {
        this.checked = false;
      }
    },
    //全选
    checkAll() {
      if (this.checked) {
        this.$refs.checkboxGroup.toggleAll();
      } else {
        this.$refs.checkboxGroup.toggleAll(true);
      }
    },
    onClickRight() {
      this.show = !this.show;
      this.showbars = false;
      if (this.show) {
        this.$refs.message.style.marginBottom = ".5rem";
      } else {
        this.$refs.message.style.marginBottom = "0";
      }
    },
    // 获取消息
    getAccountLog() {
      this.$axios({
        url: this.$global.url + "api/user/accountLog" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          mid: localStorage.getItem("mid"),
          page: this.page,
          limit: 10
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.loading = false;
            for (let i = 0; i < res.data.data.length; i++) {
              this.message.push(res.data.data[i]);
            }
            if (res.data.count <= this.message.length) {
              this.finished = true;
            } else {
              this.finished = false;
            }
            this.numlist = res.data.count;
            this.$global.num = res.data.count;
          } else if (res.data.code == 0) {
            this.message = [];
            this.finished = true;
            this.loading = false;
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
    //列表更新
    onLoad() {
      this.finished = false;
      if (this.numlist <= this.message.length) {
        return false;
      }
      this.page += 1;
      this.getAccountLog();
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.message = [];
        this.page = 1;
        this.loading = true;
        this.finished = false;
        this.getAccountLog();
        this.isLoading = false;
        this.$toast("刷新成功");
      }, 500);
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
}
.text {
  text-align: left;
  padding-left: 10px;
}
.text p:nth-child(1) {
  padding-top: 8px;
  height: 0.22rem;
  font-size: 0.16rem;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  line-height: 0.22rem;
}
.text p:nth-child(2) {
  font-size: 0.14rem;
  color: rgba(51, 51, 51, 0.8);
  line-height: 0.2rem;
}
.message {
  padding: 15px;
  margin-bottom: 50px;
}
.message h3 {
  font-size: 0.16rem;
  padding-bottom: 15px;
}
.msg {
  text-align: center;
}
.msgHead {
  display: flex;
  padding: 10px;
  text-align: left;
}
.msgHead p {
  margin-left: 10px;
  flex: 1;
  font-size: 0.14rem;
  color: #666;
  line-height: 0.2rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.msgFoot {
  text-align: right;
  font-size: 0.14rem;
  color: #999999;
  line-height: 0.2rem;
}
.card {
  border-radius: 10px;
  margin: 0.15rem 0;
}
.plus {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.21);
  position: fixed;
  z-index: 2;
  top: 55px;
  right: 10px;
  font-size: 14px;
}
.plus p {
  color: #999;
  padding: 10px 20px;
}
.check {
  display: flex;
  align-items: center;
  position: relative;
  left: -0.07rem;
}
.all {
  width: 100%;
  height: 0.5rem;
  position: fixed;
  bottom: 50px;
  background: white;
  padding: 0 0.15rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border-top: 1px solid rgba(245, 245, 245, 1);
}
.all p {
  flex: 1;
  display: flex;
  justify-content: space-between;
}
.all p > span:nth-of-type(1) {
  display: flex;
  align-items: center;
}
.all p > span:nth-of-type(3) {
  padding: 0.03rem 0.23rem;
  border: 1px solid #ff3131;
  color: #ff3131;
  border-radius: 14px;
}
.content {
  display: flex;
}
.van-cell {
  padding: 0;
  background-color: transparent;
}
</style>