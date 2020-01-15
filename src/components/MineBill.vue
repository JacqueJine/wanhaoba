<template>
  <div class="bill">
    <van-nav-bar title="账单" left-arrow @click-left="onClickLeft" />
    <div class="down">
      <p @click="show_popup">
        {{time}}
        <van-icon name="arrow-down" />
      </p>
      <p>
        <span>收入：￥{{allprice}}</span>
        <span>支出：￥{{outprice}}</span>
      </p>
    </div>
    <div class="list">
      <ul>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="(item,index) in list" class="vanlist" :key="index">
              <!-- <li>
              <div>
                <van-image
                  lazy-load
                  width=".46rem"
                  height=".46rem"
                  :src="require('../assets/mine/tixian.png')"
                />
              </div>
              <div>
                <p>
                  <span>糖果提现</span>
                  <span class="little">2019-10-20</span>
                </p>
                <p>10000</p>
              </div>
            </li>
            <li>
              <div>
                <van-image
                  lazy-load
                  width=".46rem"
                  height=".46rem"
                  :src="require('../assets/mine/chushou.png')"
                />
              </div>
              <div>
                <p>
                  <span>出售或出租账号/物品</span>
                  <span class="little">2019-10-20</span>
                </p>
                <p class="chu">+10000糖果</p>
              </div>
              </li>-->
              <li>
                <div>
                  <van-image
                    lazy-load
                    width=".46rem"
                    height=".46rem"
                    :src="Number(item.price)<0?require('../assets/mine/goumai.png'):require('../assets/mine/chushou.png')"
                  />
                </div>
                <div>
                  <p>
                    <span>{{item.type}}</span>
                    <span class="little">{{item.add_time}}</span>
                  </p>
                  <p>{{item.price}}{{item.account_type}}</p>
                </div>
              </li>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </ul>
    </div>
    <van-popup v-model="show" position="bottom" :style="{ height: '30%' }">
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        :formatter="formatter"
        @confirm="getTime"
        @cancel="close"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "bill",
  data() {
    return {
      isLoading: false,
      show: false,
      currentDate: new Date(),
      time: "",
      status: "",
      page: 1,
      loading: false,
      finished: false,
      numlist: 0,
      list: [],
      allprice: 0,
      outprice: 0
    };
  },
  mounted() {
    this.status = this.$route.query.status;
    this.getTime(this.currentDate);
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1);
    },
    show_popup() {
      this.show = true;
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      }
      return value;
    },
    getTime(value) {
      var y = value.getFullYear();
      var m = value.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = value.getDate();
      d = d < 10 ? "0" + d : d;
      var h = value.getHours();
      var minute = value.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      this.time = y + "-" + m;
      this.show = false;
      this.list = [];
      this.page = 1;
      this.loading = true;
      this.finished = false;
      this.allprice = 0;
      this.outprice = 0;
      this.getBillList();
    },
    close() {
      this.show = false;
    },
    //账单列表
    getBillList() {
      this.$axios({
        url: this.$global.url + "api/user/bill" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          // data: {
          mid: localStorage.getItem("mid"),
          status: this.status,
          time: this.time,
          page: this.page,
          limit: 10
          // }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.loading = false;
            for (let i = 0; i < res.data.data.length; i++) {
              this.list.push(res.data.data[i]);
            }
            // 收入
            this.allprice = res.data.income;
            // 支出
            this.outprice = Math.abs(res.data.expend);
            if (res.data.count <= this.list.length) {
              this.finished = true;
            } else {
              this.finished = false;
            }
            this.numlist = res.data.count;
          } else {
            this.list = [];
            this.loading = false;
            this.finished = true;
            this.$message.error({
              message: res.data.msg
            });
          }
        })
        .catch(e => {
          this.list = [];
          this.$message.error({
            message: "网络较差，请稍后重试！"
          });
        });
    },
    //列表更新
    onLoad() {
      this.finished = false;
      if (this.numlist <= this.list.length) {
        return false;
      }
      this.page += 1;
      this.getBillList();
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.list = [];
        this.page = 1;
        this.loading = true;
        this.finished = false;
        this.getBillList();
        this.isLoading = false;
        this.$toast("刷新成功");
      }, 500);
    }
  }
};
</script>

<style scoped>
.bill {
  width: 100%;
  height: 100%;
}
.van-nav-bar .van-icon {
  color: #333333;
}
.down {
  padding: 0.15rem 0.15rem 0;
  display: flex;
  justify-content: space-between;
}
.down > p:nth-of-type(1) {
  width: 1.11rem;
  height: 0.3rem;
  background: rgba(105, 111, 255, 1);
  border-radius: 20px;
  color: #fff;
  text-align: center;
  line-height: 0.3rem;
}
.down > p:nth-of-type(2) {
  display: flex;
  flex-direction: column;
}
.down > p:nth-of-type(2) span {
  height: 0.3rem;
  line-height: 0.3rem;
}
.down > p:nth-of-type(2) span:nth-of-type(1) {
  color: rgba(105, 111, 255, 1);
}
.list li {
  display: flex;
  height: 0.84rem;
  align-items: center;
}
.list li > div:nth-of-type(1) {
  padding: 0 0.11rem 0 0.15rem;
}
.list li > div:nth-of-type(2) {
  flex: 1;
  display: flex;
  height: 100%;
  justify-content: space-between;
  border-bottom: 1px solid #979797;
  align-items: center;
  padding-right: 0.15rem;
  font-size: 0.16rem;
}
.list li > div:nth-of-type(2) > p:nth-of-type(1) {
  display: flex;
  flex-direction: column;
}
.list li > div:nth-of-type(2) .little {
  font-size: 0.12rem;
  color: #ccc;
  margin-top: 0.04rem;
}
.chu {
  color: #696fff;
}
</style>