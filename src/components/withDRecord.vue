<template>
  <div class="bill">
    <van-nav-bar title="提现详情" left-arrow @click-left="onClickLeft" />
    <div class="list">
      <ul>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="(item,index) in list" class="vanlist" :key="index">
              <li>
                <!-- <div>
                <van-image
                  lazy-load
                  width=".46rem"
                  height=".46rem"
                  :src="Number(item.price)<0?require('../assets/mine/goumai.png'):require('../assets/mine/chushou.png')"
                />
                </div>-->
                <div>
                  <p>
                    <span>提现金额：{{item.price}}</span>
                    <span class="little">{{item.audit_time}}</span>
                  </p>
                  <p>状态:{{item.audit}}</p>
                </div>
              </li>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "bill",
  data() {
    return {
      isLoading: false,
      time: "",
      page: 1,
      loading: false,
      finished: false,
      numlist: 0,
      list: []
    };
  },
  mounted() {
    this.getWithdraw();
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1);
    },

    close() {
      this.show = false;
    },
    //账单列表
    getWithdraw() {
      this.$axios({
        url: this.$global.url + "api/user/withdraw" + ".html",
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
              this.list.push(res.data.data[i]);
            }
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
      this.getWithdraw();
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.list = [];
        this.page = 1;
        this.loading = true;
        this.finished = false;
        this.getWithdraw();
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

.list li {
  display: flex;
  height: 0.84rem;
  align-items: center;
}
/* .list li > div:nth-of-type(1) {
  padding: 0 0.11rem 0 0.15rem;
} */
.list li > div:nth-of-type(1) {
  flex: 1;
  display: flex;
  height: 100%;
  justify-content: space-between;
  border-bottom: 1px solid #979797;
  align-items: center;
  padding-right: 0.15rem;
  font-size: 0.16rem;
}
.list li > div:nth-of-type(1) > p:nth-of-type(1) {
  display: flex;
  flex-direction: column;
}
.list li > div:nth-of-type(1) .little {
  font-size: 0.12rem;
  color: #ccc;
  margin-top: 0.04rem;
}
.chu {
  color: #696fff;
}
</style>