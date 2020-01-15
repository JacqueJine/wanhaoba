<template>
  <div class="collect">
    <van-nav-bar
      title="我的收藏"
      left-arrow
      @click-left="onClickLeft"
      :right-text="editor"
      @click-right="onClickRight"
    />

    <div class="list" ref="list">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-checkbox-group v-model="result" @change="onchange" ref="checkboxGroup">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell
              v-for="(item,index) in collectList"
              :key="index"
              style="padding:0;margin-bottom: 10px;"
            >
              <div class="item">
                <div class="check" v-show="show">
                  <van-checkbox :name="item.collect_id"></van-checkbox>
                </div>
                <div @click="goDetail(item.id,item.is_sell)" style="position:relative">
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
                </div>
                <div @click="goDetail(item.id,item.is_sell)" style="flex: 1;">
                  <van-row>
                    <van-col span="17" class="flexItem">
                      <van-tag
                        :color="item.mid=='平台'?'#7065FF':typeof(item.mid)=='object'?'#5AD27C':'#F1BF3D'"
                        class="tagRight"
                      >{{item.mid=='平台'?'平台':typeof(item.mid)=='object'?"商家":"个人"}}</van-tag>
                      <span
                        class="title"
                      >{{item.mid=='平台'?'平台自营':typeof(item.mid)=='object'?item.mid.title:item.mid}}</span>
                      <van-icon v-if="item.mid!='平台'" name="star" color="#FFA300" />
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
                    <van-col span="7" class="price">￥{{!item.sell_type?item.rent.price:item.price}}</van-col>
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
            </van-cell>
          </van-list>
        </van-checkbox-group>
      </van-pull-refresh>
    </div>

    <div class="all" v-show="show">
      <p>
        <span @click="checkAll">
          <van-checkbox v-model="checked">全选</van-checkbox>
        </span>
        <span @click="del">删除</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "collect",
  data() {
    return {
      isLoading: false,
      editor: "编辑",
      show: false,
      result: [],
      checked: false,
      collectList: [],
      numlist: 0,
      loading: true,
      finished: false,
      page: 1,
      imgurl: this.$global.imgUrl
    };
  },
  mounted() {
    this.getCollectList();
  },
  methods: {
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
    //删除收藏
    del() {
      if (!this.result.length) {
        this.$notify({
          message: "请选择删除项",
          type: "danger"
        });
        return false;
      }
      this.$dialog
        .confirm({
          title: "",
          message: "确定要删除吗？"
        })
        .then(() => {
          this.$axios({
            url: this.$global.url + "api/user/collectDel" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              collect_id: this.result
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.$notify({
                  message: res.data.msg,
                  type: "success"
                });
                this.collectList = [];
                this.loading = true;
                this.finished = false;
                this.page = 1;
                this.getCollectList();
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
    onchange() {
      if (this.result.length == this.collectList.length) {
        this.checked = true;
      } else {
        this.checked = false;
      }
    },
    onClickLeft() {
      this.$router.back(-1);
    },
    onClickRight() {
      this.show = !this.show;
      if (this.editor === "编辑") {
        this.editor = "取消";
        this.$refs.list.style.marginBottom = ".5rem";
      } else if (this.editor === "取消") {
        this.editor = "编辑";
        this.$refs.list.style.marginBottom = "0";
      }
    },
    checkAll() {
      if (this.checked) {
        this.$refs.checkboxGroup.toggleAll();
      } else {
        this.$refs.checkboxGroup.toggleAll(true);
      }
    },
    //获取用户收藏列表
    getCollectList() {
      this.$axios({
        url: this.$global.url + "api/user/collectList" + ".html",
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
              this.collectList.push(res.data.data[i]);
            }
            if (res.data.count <= this.collectList.length) {
              this.finished = true;
            } else {
              this.finished = false;
            }
            this.numlist = res.data.count;
          } else if (res.data.code == 0) {
            this.collectList = [];
            this.loading = false;
            this.finished = true;
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
      // 异步更新数据
      setTimeout(() => {
        // for (let i = 0; i < 10; i++) {
        //   this.list.push(this.list.length + 1);
        // }
        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.collectList.length >= this.numlist) {
          this.finished = true;
        }
      }, 500);
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
       this.collectList = [];
        this.page = 1;
        this.loading = true;
        this.finished = false;
        this.getCollectList();
        this.isLoading = false;
        this.$toast("刷新成功");
      }, 500);
    }
  }
};
</script>

<style scoped>
.collect {
  width: 100%;
  min-height: 100vh;
  background: rgba(245, 245, 245, 1);
}
.van-nav-bar .van-icon,
.van-nav-bar__text {
  color: #333;
}
.list {
  padding: 15px 0 0;
  overflow: hidden;
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
  background: #fff;
  padding: 0.15rem;
}
/* .van-image {
  border: 1px solid rgba(51, 51, 51, 0.1);
} */

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
  bottom: 0;
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
.all p > span:nth-of-type(2) {
  padding: 0.03rem 0.23rem;
  border: 1px solid #ff3131;
  color: #ff3131;
  border-radius: 14px;
}
.chuzu {
  position: absolute;
  width: 0.85rem;
  height: 0.85rem;
  border: 1px solid transparent;
  border-radius: 10px;
  background: rgba(51, 51, 51, 0.8);
  color: #fff;
  text-align: center;
  font-size: 0.12rem;
  top: 0;
}

.chuzu p:nth-child(1) {
  padding-top: 0.1rem;
  font-size: 0.14rem;
}
</style>