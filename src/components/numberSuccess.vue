<template>
  <div class="success">
    <p>
      <van-icon name="checked" color="#696fff" size="1rem" />
    </p>
    <p class="tishi">已发布，等待审核</p>
    <p
      class="ti"
    >请在账号管理-->待审核页面查看进度<br/>发布宝贝之后客服会在3小时之内给您来电</p>
    <van-goods-action>
      <van-goods-action-button
        color="linear-gradient(to bottom, #6574FF, #7065FF)"
        text="返回首页"
        to="/index"
      />
    </van-goods-action>
  </div>
</template>
<script>
export default {
  data() {
    return {

    };
  },
  mounted() {

  },
  methods: {
  }
};
</script>
<style scoped>
.success {
  text-align: center;
}
p:nth-of-type(1) {
  padding: 0.9rem 0 0.4rem;
}
.tishi {
  font-size: 0.2rem;
}
.ti {
  font-size: 0.12rem;
  color: rgba(51, 51, 51, 0.6);
  margin-top: 10px;
}
.van-goods-action {
  bottom: 15px;
}
</style>