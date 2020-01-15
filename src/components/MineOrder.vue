<template>
  <div class="order">
    <van-nav-bar :border="false" left-arrow @click-left="back()">
      <van-dropdown-menu slot="title">
        <van-dropdown-item v-model="title" :options="titleOption" @change="changeTitle" />
      </van-dropdown-menu>
    </van-nav-bar>
    <!-- 卖家和买家账号列表 -->
    <van-tabs
      v-model="activeName"
      :border="false"
      @change="getTabs"
      line-width="15px"
      color="#6C6AFF"
      v-if="title==='number'"
    >
      <van-tab v-for="(item,index) in tab" :name="item.value" :title="item.title" :key="index">
        <!-- <div v-if="activeName == 0" class="main">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="(item,index) in dataList" class="vanlist" :key="index">
              <van-panel class="item">
                <van-cell :border="false" slot="header" is-link @click="toShop(item)">
                  <div slot="title" class="title">
                    <van-icon
                      size="20px"
                      :name="item.sell_mid=='平台'?require('./../assets/common/mess (2).png'):img+item.sell_mid.logo"
                    />
                    <span
                      class="title"
                    >{{item.sell_mid=='平台'?'平台自营':typeof item.sell_mid == "object"?item.sell_mid.title:item.sell_mid}}</span>
                    <van-icon
                      v-if="item.sell_mid!='平台'&&item.sell_mid.level_id==1"
                      name="star"
                      color="#FFA300"
                    />
                    <van-icon
                      v-else-if="item.sell_mid!='平台'&&item.sell_mid.level_id==2"
                      :name="require('../assets/merchant/yueliang.png')"
                    />
                    <van-icon
                      v-else-if="item.sell_mid!='平台'&&item.sell_mid.level_id==3"
                      :name="require('../assets/merchant/taiyang.png')"
                    />
                    <van-icon
                      v-else-if="item.sell_mid!='平台'&&item.sell_mid.level_id==4"
                      :name="require('../assets/merchant/huangguan.png')"
                    />
                    <van-icon
                      v-else-if="item.sell_mid!='平台'&&item.sell_mid.level_id==5"
                      :name="require('../assets/merchant/baoding.png')"
                    />
                    <van-image
                      v-if="item.sell_mid!='平台'"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/bao.png')"
                    />
                    <van-image
                      v-if="item.sell_mid!='平台'"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/shi.png')"
                    />
                    <van-image
                      v-if="item.sell_mid!='平台'"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/shou.png')"
                    />
                  </div>
                </van-cell>
                <div class="itemInfo">
                  <van-image
                    class="infoImg"
                    width=".85rem"
                    height=".85rem"
                    lazy-load
                    radius="10px"
                    :src="img+item.img[0]"
                  />
                  <div class="info">
                    <li class="infoTitle">
                      <van-tag
                        :color="item.type?'#FF3131':'#696FFF'"
                        class="tagRight"
                      >{{item.type?'出售':'出租'}}</van-tag>
                      <span>{{item.title}}</span>
                    </li>
                    <li class="tag">
                      <van-tag
                        color="rgba(153,153,153,0.1)"
                        text-color="rgba(51,51,51,0.4)"
                      >{{item.login_method}}登录</van-tag>
                      <van-tag
                        v-if="!item.type&&!item.cash_price"
                        color="rgba(153,153,153,0.1)"
                        text-color="rgba(51,51,51,0.4)"
                      >免押金</van-tag>
                    </li>
                    <li class="total">
                      <b>{{item.price}}</b>
                      <span
                        class="num"
                        v-if="!item.type"
                      >{{item.hour}}{{item.rent_type==1?'小时':item.rent_type==2?'夜':item.rent_type==3?'天':item.rent_type==4?'周':''}}</span>
                    </li>
                  </div>
                </div>
                <div slot="footer" class="itemBtn" v-if="is_seller==0">
                  <van-button
                    v-if="is_seller==0"
                    plain
                    size="small"
                    style="margin-right:10px"
                    round
                    type="danger"
                    @click="delOrder(item.id)"
                  >删除</van-button>
                  <van-button
                    plain
                    size="small"
                    round
                    color="#696FFF"
                    @click="toPayNumber(item)"
                    v-if="is_seller==0"
                  >付款</van-button>
                </div>
              </van-panel>
            </van-cell>
          </van-list>
        </div>-->
        <div v-if="activeName == 1" class="main">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="(item,index) in dataList" class="vanlist" :key="index">
              <van-panel class="item">
                <van-cell :border="false" slot="header" is-link @click="toShop(item,'预约')">
                  <div slot="title" class="title">
                    <van-icon
                      size="20px"
                      :name="item.merch_name=='平台'?require('./../assets/common/mess (2).png'):item.merch_name=='个人'?require('./../assets/index/touxiang.png'):img+item.merch_name.logo"
                    />
                    <span
                      class="title"
                    >{{item.merch_name=='平台'?'平台自营':item.merch_name=='个人'?'个人':item.merch_name.title}}</span>
                    <!-- 店铺等级 -->
                    <van-icon
                      v-if="item.merch_name!='平台'&&item.merch_name!='个人'&&item.merch_name.level_id==1"
                      name="star"
                      color="#FFA300"
                    />
                    <van-icon
                      v-else-if="item.merch_name!='平台'&&item.merch_name!='个人'&&item.merch_name.level_id==2"
                      :name="require('../assets/merchant/yueliang.png')"
                    />
                    <van-icon
                      v-else-if="item.merch_name!='平台'&&item.merch_name!='个人'&&item.merch_name.level_id==3"
                      :name="require('../assets/merchant/taiyang.png')"
                    />
                    <van-icon
                      v-else-if="item.merch_name!='平台'&&item.merch_name!='个人'&&item.merch_name.level_id==4"
                      :name="require('../assets/merchant/huangguan.png')"
                    />
                    <van-icon
                      v-else-if="item.merch_name!='平台'&&item.merch_name!='个人'&&item.merch_name.level_id==5"
                      :name="require('../assets/merchant/baoding.png')"
                    />
                    <!--  -->
                    <van-image
                      v-if="item.merch_name!='平台'&&item.merch_name!='个人'"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/bao.png')"
                    />
                    <van-image
                      v-if="item.merch_name!='平台'&&item.merch_name!='个人'"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/shi.png')"
                    />
                    <van-image
                      v-if="item.merch_name!='平台'&&item.merch_name!='个人'"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/shou.png')"
                    />
                  </div>
                </van-cell>
                <div class="itemInfo">
                  <van-image
                    class="infoImg"
                    width=".85rem"
                    height=".85rem"
                    lazy-load
                    radius="10px"
                    :src="img+item.img[0]"
                  />
                  <div class="info">
                    <li class="infoTitle">
                      <van-tag
                        :color="item.type?'#FF3131':'#696FFF'"
                        class="tagRight"
                      >{{item.type?'出售':'出租'}}</van-tag>
                      <span>{{item.title}}</span>
                    </li>
                    <li class="tag">
                      <van-tag
                        color="rgba(153,153,153,0.1)"
                        text-color="rgba(51,51,51,0.4)"
                        v-if="item.login_method"
                      >{{item.login_method}}登录</van-tag>
                      <!-- <van-tag v-if="!item.type" color="rgba(153,153,153,0.1)" text-color="rgba(51,51,51,0.4)">1天起租</van-tag> -->
                      <van-tag
                        v-if="!item.type&&!item.cash_price"
                        color="rgba(153,153,153,0.1)"
                        text-color="rgba(51,51,51,0.4)"
                      >免押金</van-tag>
                    </li>
                    <li class="total">
                      <b>{{item.price}}</b>
                      <span
                        class="num"
                        v-if="!item.type"
                      >{{item.hour}}{{item.rent_type==1?'小时':item.rent_type==2?'夜':item.rent_type==3?'天':item.rent_type==4?'周':''}}</span>
                      <!-- <span class="num">1件</span> -->
                    </li>
                  </div>
                </div>
                <div slot="footer" class="itemBtn">
                  <p v-if="item.count_down" class="countDown bgRed">
                    出租中倒计时：
                    <van-count-down class="time" :time="item.count_down" />
                  </p>
                  <van-button
                    v-if="is_seller==0&&item.count_down"
                    plain
                    size="small"
                    style="margin-right:10px"
                    round
                    type="danger"
                    @click="delReserve(item.id)"
                  >取消预约</van-button>
                  <van-button
                    v-if="is_seller==0&&!item.count_down"
                    plain
                    size="small"
                    style="margin-right:10px"
                    round
                    color="#696FFF"
                    :to="'/goodsDetail?id='+item.number_id"
                  >立即租用</van-button>
                  <!-- <van-button
                    v-if="is_seller==0&&!item.count_down"
                    plain
                    size="small"
                    style="margin-right:10px"
                    round
                    type="danger"
                    @click="delReserve(item.id)"
                  >删除</van-button> -->
                  <!-- <van-button plain size="small" round color="#696FFF">付款</van-button> -->
                </div>
              </van-panel>
            </van-cell>
          </van-list>
        </div>
        <div v-else-if="activeName == 2" class="main">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="(item,index) in dataList" class="vanlist" :key="index">
              <van-panel class="item">
                <van-cell :border="false" slot="header" is-link @click="toShop(item)">
                  <div slot="title" class="title">
                    <!-- typeof item.sell_mid == 'object'?img+item.sell_mid.logo: -->
                    <!-- :typeof item.sell_mid == "object"?item.sell_mid.title -->
                    <van-icon
                      size="20px"
                      :name="item.sell_mid=='平台'?require('./../assets/common/mess (2).png'):item.sell_mid==null?require('./../assets/index/touxiang.png'):img+item.sell_mid.logo"
                    />
                    <span
                      class="title"
                    >{{item.sell_mid=='平台'?'平台自营':item.sell_mid==null?"个人":item.sell_mid.title}}</span>
                    <!-- 店铺等级 -->
                    <van-icon
                      v-if="item.sell_mid&&item.sell_mid.level_id==1"
                      name="star"
                      color="#FFA300"
                    />
                    <van-icon
                      v-else-if="item.sell_mid&&item.sell_mid.level_id==2"
                      :name="require('../assets/merchant/yueliang.png')"
                    />
                    <van-icon
                      v-else-if="item.sell_mid&&item.sell_mid.level_id==3"
                      :name="require('../assets/merchant/taiyang.png')"
                    />
                    <van-icon
                      v-else-if="item.sell_mid&&item.sell_mid.level_id==4"
                      :name="require('../assets/merchant/huangguan.png')"
                    />
                    <van-icon
                      v-else-if="item.sell_mid&&item.sell_mid.level_id==5"
                      :name="require('../assets/merchant/baoding.png')"
                    />
                    <!--  -->
                    <van-image
                      v-if="item.sell_mid!='平台'&&item.sell_mid!=null"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/bao.png')"
                    />
                    <van-image
                      v-if="item.sell_mid!='平台'&&item.sell_mid!=null"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/shi.png')"
                    />
                    <van-image
                      v-if="item.sell_mid!='平台'&&item.sell_mid!=null"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/shou.png')"
                    />
                  </div>
                </van-cell>
                <div class="itemInfo">
                  <van-image
                    class="infoImg"
                    width=".85rem"
                    height=".85rem"
                    lazy-load
                    radius="10px"
                    :src="img+item.img"
                  />
                  <div class="info">
                    <li class="infoTitle">
                      <van-tag
                        :color="item.type?'#FF3131':'#696FFF'"
                        class="tagRight"
                      >{{item.type?'出售':'出租'}}</van-tag>
                      <span>{{item.title}}</span>
                    </li>
                    <li class="tag">
                      <van-tag
                        color="rgba(153,153,153,0.1)"
                        text-color="rgba(51,51,51,0.4)"
                      >{{item.login_method}}登录</van-tag>
                      <!-- <van-tag v-if="!item.type" color="rgba(153,153,153,0.1)" text-color="rgba(51,51,51,0.4)">1天起租</van-tag> -->
                      <van-tag
                        v-if="!item.type&&!item.cash_price"
                        color="rgba(153,153,153,0.1)"
                        text-color="rgba(51,51,51,0.4)"
                      >免押金</van-tag>
                    </li>
                    <li class="total">
                      <b>{{item.price}}</b>
                      <span
                        class="num"
                        v-if="!item.type"
                      >{{item.hour}}{{item.rent_type==1?'小时':item.rent_type==2?'夜':item.rent_type==3?'天':item.rent_type==4?'周':''}}</span>
                      <!-- <span class="num">1件</span> -->
                    </li>
                  </div>
                </div>
                <div slot="footer" class="itemBtn">
                  <p class="countDown bgBlue">
                    出租中倒计时：
                    <van-count-down class="time" :time="item.count_down" />
                  </p>
                  <!-- <van-button plain size="small" style="margin-right:10px" round type="danger">删除</van-button> -->
                  <van-button
                    plain
                    size="small"
                    round
                    :to="'/orderDetail?id='+item.id+'&type=1'"
                    color="#696FFF"
                  >查看</van-button>
                </div>
              </van-panel>
            </van-cell>
          </van-list>
        </div>
        <div v-else-if="activeName == 3" class="main">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="(item,index) in dataList" class="vanlist" :key="index">
              <van-panel class="item">
                <van-cell :border="false" slot="header" is-link @click="toShop(item)">
                  <div slot="title" class="title">
                    <!-- typeof item.sell_mid == 'object'?img+item.sell_mid.logo: -->
                    <!-- :typeof item.sell_mid == "object"?item.sell_mid.title -->
                    <van-icon
                      size="20px"
                      :name="item.sell_mid=='平台'?require('./../assets/common/mess (2).png'):item.sell_mid==null?require('./../assets/index/touxiang.png'):img+item.sell_mid.logo"
                    />
                    <span
                      class="title"
                    >{{item.sell_mid=='平台'?'平台自营':item.sell_mid==null?"个人":item.sell_mid.title}}</span>
                    <!-- 店铺等级 -->
                    <van-icon
                      v-if="item.sell_mid&&item.sell_mid.level_id==1"
                      name="star"
                      color="#FFA300"
                    />
                    <van-icon
                      v-else-if="item.sell_mid&&item.sell_mid.level_id==2"
                      :name="require('../assets/merchant/yueliang.png')"
                    />
                    <van-icon
                      v-else-if="item.sell_mid&&item.sell_mid.level_id==3"
                      :name="require('../assets/merchant/taiyang.png')"
                    />
                    <van-icon
                      v-else-if="item.sell_mid&&item.sell_mid.level_id==4"
                      :name="require('../assets/merchant/huangguan.png')"
                    />
                    <van-icon
                      v-else-if="item.sell_mid&&item.sell_mid.level_id==5"
                      :name="require('../assets/merchant/baoding.png')"
                    />
                    <!--  -->
                    <van-image
                      v-if="item.sell_mid!='平台'&&item.sell_mid!=null"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/bao.png')"
                    />
                    <van-image
                      v-if="item.sell_mid!='平台'&&item.sell_mid!=null"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/shi.png')"
                    />
                    <van-image
                      v-if="item.sell_mid!='平台'&&item.sell_mid!=null"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/shou.png')"
                    />
                  </div>
                </van-cell>
                <div class="itemInfo">
                  <van-image
                    class="infoImg"
                    width=".85rem"
                    height=".85rem"
                    lazy-load
                    radius="10px"
                    :src="item.img!=null?img+item.img[0]:''"
                  />
                  <div class="info">
                    <li class="infoTitle">
                      <van-tag
                        :color="item.type?'#FF3131':'#696FFF'"
                        class="tagRight"
                      >{{item.type?'出售':'出租'}}</van-tag>
                      <span>{{item.title}}</span>
                    </li>
                    <li class="tag">
                      <van-tag
                        color="rgba(153,153,153,0.1)"
                        text-color="rgba(51,51,51,0.4)"
                      >{{item.login_method}}登录</van-tag>
                      <!-- <van-tag v-if="!item.type" color="rgba(153,153,153,0.1)" text-color="rgba(51,51,51,0.4)">1天起租</van-tag> -->
                      <van-tag
                        v-if="!item.type&&!item.cash_price"
                        color="rgba(153,153,153,0.1)"
                        text-color="rgba(51,51,51,0.4)"
                      >免押金</van-tag>
                    </li>
                    <li class="total">
                      <b>{{item.price}}</b>
                      <span
                        class="num"
                        v-if="!item.type"
                      >{{item.hour}}{{item.rent_type==1?'小时':item.rent_type==2?'夜':item.rent_type==3?'天':item.rent_type==4?'周':''}}</span>
                      <!-- <span class="num">1件</span> -->
                    </li>
                  </div>
                </div>
                <div slot="footer" class="itemBtn">
                  <!-- <van-button
                    v-if="is_seller==0"
                    plain
                    size="small"
                    style="margin-right:10px"
                    round
                    type="danger"
                    @click="delOrder(item.id)"
                  >删除</van-button> -->
                  <van-button
                    plain
                    size="small"
                    round
                    :to="'/orderDetail?id='+item.id"
                    color="#696FFF"
                  >查看</van-button>
                </div>
              </van-panel>
            </van-cell>
          </van-list>
        </div>
        <div v-else-if="activeName == 4" class="main">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="(item,index) in dataList" class="vanlist" :key="index">
              <van-panel class="item">
                <van-cell :border="false" slot="header" is-link @click="toShop(item)">
                  <div slot="title" class="title">
                    <!-- typeof item.sell_mid == 'object'?img+item.sell_mid.logo: -->
                    <!-- :typeof item.sell_mid == "object"?item.sell_mid.title -->
                    <van-icon
                      size="20px"
                      :name="item.sell_mid=='平台'?require('./../assets/common/mess (2).png'):item.sell_mid==null?require('./../assets/index/touxiang.png'):img+item.sell_mid.logo"
                    />
                    <span
                      class="title"
                    >{{item.sell_mid=='平台'?'平台自营':item.sell_mid==null?"个人":item.sell_mid.title}}</span>
                    <!-- 店铺等级 -->
                    <van-icon
                      v-if="item.sell_mid&&item.sell_mid.level_id==1"
                      name="star"
                      color="#FFA300"
                    />
                    <van-icon
                      v-else-if="item.sell_mid&&item.sell_mid.level_id==2"
                      :name="require('../assets/merchant/yueliang.png')"
                    />
                    <van-icon
                      v-else-if="item.sell_mid&&item.sell_mid.level_id==3"
                      :name="require('../assets/merchant/taiyang.png')"
                    />
                    <van-icon
                      v-else-if="item.sell_mid&&item.sell_mid.level_id==4"
                      :name="require('../assets/merchant/huangguan.png')"
                    />
                    <van-icon
                      v-else-if="item.sell_mid&&item.sell_mid.level_id==5"
                      :name="require('../assets/merchant/baoding.png')"
                    />
                    <!--  -->
                    <van-image
                      v-if="item.sell_mid!='平台'&&item.sell_mid!=null"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/bao.png')"
                    />
                    <van-image
                      v-if="item.sell_mid!='平台'&&item.sell_mid!=null"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/shi.png')"
                    />
                    <van-image
                      v-if="item.sell_mid!='平台'&&item.sell_mid!=null"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/shou.png')"
                    />
                  </div>
                </van-cell>
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
                        :color="item.type?'#FF3131':'#696FFF'"
                        class="tagRight"
                      >{{item.type?'出售':'出租'}}</van-tag>
                      <span>{{item.title}}</span>
                    </li>
                    <li class="tag">
                      <van-tag
                        color="rgba(153,153,153,0.1)"
                        text-color="rgba(51,51,51,0.4)"
                      >{{item.login_method}}登录</van-tag>
                      <!-- <van-tag v-if="!item.type" color="rgba(153,153,153,0.1)" text-color="rgba(51,51,51,0.4)">1天起租</van-tag> -->
                      <van-tag
                        v-if="!item.type&&!item.cash_price"
                        color="rgba(153,153,153,0.1)"
                        text-color="rgba(51,51,51,0.4)"
                      >免押金</van-tag>
                    </li>
                    <li class="total">
                      <b>{{item.price}}</b>
                      <span
                        class="num"
                        v-if="!item.type"
                      >{{item.hour}}{{item.rent_type==1?'小时':item.rent_type==2?'夜':item.rent_type==3?'天':item.rent_type==4?'周':''}}</span>
                      <!-- <span class="num">1件</span> -->
                    </li>
                  </div>
                </div>
                <div slot="footer" class="itemBtn">
                  <!-- <van-button
                    v-if="is_seller==0"
                    plain
                    size="small"
                    style="margin-right:10px"
                    round
                    type="danger"
                    @click="delOrder(item.id)"
                  >删除</van-button> -->
                  <van-button
                    plain
                    size="small"
                    round
                    :to="'/orderDetail?id='+item.id"
                    color="#696FFF"
                  >查看</van-button>
                  <!-- <van-button plain size="small" round color="#F2A638">售后</van-button> -->
                </div>
              </van-panel>
            </van-cell>
          </van-list>
        </div>
        <div v-else-if="activeName == 5" class="main">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="(item,index) in dataList" class="vanlist" :key="index">
              <van-panel class="item">
                <van-cell :border="false" slot="header" is-link @click="toShop(item)">
                  <div slot="title" class="title">
                    <!-- typeof item.sell_mid == 'object'?img+item.sell_mid.logo: -->
                    <!-- :typeof item.sell_mid == "object"?item.sell_mid.title -->
                    <van-icon
                      size="20px"
                      :name="item.sell_mid=='平台'?require('./../assets/common/mess (2).png'):item.sell_mid==null?require('./../assets/index/touxiang.png'):img+item.sell_mid.logo"
                    />
                    <span
                      class="title"
                    >{{item.sell_mid=='平台'?'平台自营':item.sell_mid==null?"个人":item.sell_mid.title}}</span>
                    <!-- 店铺等级 -->
                    <van-icon
                      v-if="item.sell_mid&&item.sell_mid.level_id==1"
                      name="star"
                      color="#FFA300"
                    />
                    <van-icon
                      v-else-if="item.sell_mid&&item.sell_mid.level_id==2"
                      :name="require('../assets/merchant/yueliang.png')"
                    />
                    <van-icon
                      v-else-if="item.sell_mid&&item.sell_mid.level_id==3"
                      :name="require('../assets/merchant/taiyang.png')"
                    />
                    <van-icon
                      v-else-if="item.sell_mid&&item.sell_mid.level_id==4"
                      :name="require('../assets/merchant/huangguan.png')"
                    />
                    <van-icon
                      v-else-if="item.sell_mid&&item.sell_mid.level_id==5"
                      :name="require('../assets/merchant/baoding.png')"
                    />
                    <!--  -->
                    <van-image
                      v-if="item.sell_mid!='平台'&&item.sell_mid!=null"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/bao.png')"
                    />
                    <van-image
                      v-if="item.sell_mid!='平台'&&item.sell_mid!=null"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/shi.png')"
                    />
                    <van-image
                      v-if="item.sell_mid!='平台'&&item.sell_mid!=null"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/shou.png')"
                    />
                  </div>
                </van-cell>
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
                        :color="item.type?'#FF3131':'#696FFF'"
                        class="tagRight"
                      >{{item.type?'出售':'出租'}}</van-tag>
                      <span>{{item.title}}</span>
                    </li>
                    <li class="tag">
                      <van-tag
                        color="rgba(153,153,153,0.1)"
                        text-color="rgba(51,51,51,0.4)"
                      >{{item.login_method}}登录</van-tag>
                      <!-- <van-tag v-if="!item.type" color="rgba(153,153,153,0.1)" text-color="rgba(51,51,51,0.4)">1天起租</van-tag> -->
                      <van-tag
                        v-if="!item.type&&!item.cash_price"
                        color="rgba(153,153,153,0.1)"
                        text-color="rgba(51,51,51,0.4)"
                      >免押金</van-tag>
                    </li>
                    <li class="total">
                      <b>{{item.price}}</b>
                      <span
                        class="num"
                        v-if="!item.type"
                      >{{item.hour}}{{item.rent_type==1?'小时':item.rent_type==2?'夜':item.rent_type==3?'天':item.rent_type==4?'周':''}}</span>
                      <!-- <span class="num">1件</span> -->
                    </li>
                  </div>
                </div>
                <div slot="footer" class="itemBtn">
                  <!-- <van-button
                    v-if="is_seller==0"
                    plain
                    size="small"
                    style="margin-right:10px"
                    round
                    type="danger"
                    @click="delOrder(item.id)"
                  >删除</van-button> -->
                  <!-- <van-button
                    plain
                    size="small"
                    round
                    :to="'/orderDetail?id='+item.id"
                    color="#696FFF"
                  >查看</van-button>-->
                  <van-button
                    plain
                    size="small"
                    round
                    color="#F2A638"
                    @click="contact(item.phone,is_seller,item.buy_tel,item.wechat,item.sell_tel)"
                  >{{is_seller==0?"联系卖家":"联系买家"}}</van-button>
                </div>
              </van-panel>
            </van-cell>
          </van-list>
        </div>
        <div v-else-if="activeName == 6" class="main">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="(item,index) in dataList" class="vanlist" :key="index">
              <van-panel class="item">
                <van-cell :border="false" slot="header" is-link @click="toShop(item)">
                  <div slot="title" class="title">
                    <!-- typeof item.sell_mid == 'object'?img+item.sell_mid.logo: -->
                    <!-- :typeof item.sell_mid == "object"?item.sell_mid.title -->
                    <van-icon
                      size="20px"
                      :name="item.sell_mid=='平台'?require('./../assets/common/mess (2).png'):item.sell_mid==null?require('./../assets/index/touxiang.png'):img+item.sell_mid.logo"
                    />
                    <span
                      class="title"
                    >{{item.sell_mid=='平台'?'平台自营':item.sell_mid==null?"个人":item.sell_mid.title}}</span>
                    <!-- 店铺等级 -->
                    <van-icon
                      v-if="item.sell_mid&&item.sell_mid.level_id==1"
                      name="star"
                      color="#FFA300"
                    />
                    <van-icon
                      v-else-if="item.sell_mid&&item.sell_mid.level_id==2"
                      :name="require('../assets/merchant/yueliang.png')"
                    />
                    <van-icon
                      v-else-if="item.sell_mid&&item.sell_mid.level_id==3"
                      :name="require('../assets/merchant/taiyang.png')"
                    />
                    <van-icon
                      v-else-if="item.sell_mid&&item.sell_mid.level_id==4"
                      :name="require('../assets/merchant/huangguan.png')"
                    />
                    <van-icon
                      v-else-if="item.sell_mid&&item.sell_mid.level_id==5"
                      :name="require('../assets/merchant/baoding.png')"
                    />
                    <!--  -->
                    <van-image
                      v-if="item.sell_mid!='平台'&&item.sell_mid!=null"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/bao.png')"
                    />
                    <van-image
                      v-if="item.sell_mid!='平台'&&item.sell_mid!=null"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/shi.png')"
                    />
                    <van-image
                      v-if="item.sell_mid!='平台'&&item.sell_mid!=null"
                      class="tag"
                      width=".15rem"
                      height=".15rem"
                      lazy-load
                      :src="require('../assets/index/shou.png')"
                    />
                  </div>
                </van-cell>
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
                        :color="item.type?'#FF3131':'#696FFF'"
                        class="tagRight"
                      >{{item.type?'出售':'出租'}}</van-tag>
                      <span>{{item.title}}</span>
                    </li>
                    <li class="tag">
                      <van-tag
                        color="rgba(153,153,153,0.1)"
                        text-color="rgba(51,51,51,0.4)"
                      >{{item.login_method}}登录</van-tag>
                      <!-- <van-tag v-if="!item.type" color="rgba(153,153,153,0.1)" text-color="rgba(51,51,51,0.4)">1天起租</van-tag> -->
                      <van-tag
                        v-if="!item.type&&!item.cash_price"
                        color="rgba(153,153,153,0.1)"
                        text-color="rgba(51,51,51,0.4)"
                      >免押金</van-tag>
                    </li>
                    <li class="total">
                      <b>{{item.price}}</b>
                      <span
                        class="num"
                        v-if="!item.type"
                      >{{item.hour}}{{item.rent_type==1?'小时':item.rent_type==2?'夜':item.rent_type==3?'天':item.rent_type==4?'周':''}}</span>
                      <!-- <span class="num">1件</span> -->
                    </li>
                  </div>
                </div>
                <div slot="footer" class="itemBtn">
                  <!-- <van-button
                    v-if="is_seller==0&&item.status==5"
                    plain
                    size="small"
                    style="margin-right:10px"
                    round
                    type="danger"
                    @click="delOrder(item.id)"
                  >删除</van-button> -->
                  <van-button
                    plain
                    v-if="item.status==5"
                    size="small"
                    round
                    color="#F2A638"
                    @click="contact(item.phone,is_seller,item.buy_tel,item.wechat,item.sell_tel)"
                  >{{is_seller==0?"联系卖家":"联系买家"}}</van-button>
                  <!-- <van-button
                    plain
                    size="small"
                    round
                    color="#696FFF"
                    @click="toPayNumber(item)"
                    v-if="is_seller==0&&item.status==0"
                  >付款</van-button>-->
                  <van-button
                    v-if="item.status!=0&&item.status!=5"
                    plain
                    size="small"
                    round
                    :to="'/orderDetail?id='+item.id"
                    color="#696FFF"
                  >查看</van-button>
                  <!-- <van-button plain size="small" round color="#F2A638">售后</van-button> -->
                </div>
              </van-panel>
            </van-cell>
          </van-list>
        </div>
      </van-tab>
    </van-tabs>
    <!-- 卖家和买家礼物列表 -->
    <van-tabs
      v-else
      v-model="activeName"
      :border="false"
      line-width="15px"
      color="#6C6AFF"
      @click="getTabs"
    >
      <van-tab v-for="(item,index) in tab" :title="item.name" :name="item.value" :key="index">
        <div v-if="activeName == 0" class="main">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="(item,index) in dataList" class="vanlist" :key="index">
              <div>
                <van-panel class="item">
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
                          :color="item.is_buy?'#5ad27c':'#FF3131' "
                          class="tagRight"
                        >{{item.is_buy?"求购":"出售"}}</van-tag>
                        <span>{{item.gift_name}}</span>
                      </li>
                      <li class="total">
                        <b>￥{{item.price}}</b>
                        <span class="num">{{item.count}}件</span>
                      </li>
                    </div>
                  </div>
                  <div slot="footer" class="itemBtn">
                    <!-- <van-button
                      v-if="is_seller==0"
                      plain
                      size="small"
                      style="margin-right:10px"
                      round
                      type="danger"
                      @click="delOrder(item.id)"
                    >删除</van-button> -->
                    <!-- 求购订单详情 -->
                    <van-button
                      plain
                      size="small"
                      round
                      color="#696FFF"
                      v-if="item.is_buy"
                      :to="'/giftDetail?id='+item.id+'&type='+is_seller"
                    >{{is_seller==1?'去发货':'详情'}}</van-button>
                    <!-- 出售 -->
                    <van-button
                      v-if="is_seller==0&&item.is_buy==0"
                      plain
                      size="small"
                      round
                      color="#696FFF"
                      @click="toPayGift(item.id,item.sell_mid,item.gift_id,item.price)"
                    >付款</van-button>
                  </div>
                </van-panel>
              </div>
            </van-cell>
          </van-list>
        </div>
        <div v-if="activeName == 1" class="main">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="(item,index) in dataList" class="vanlist" :key="index">
              <div>
                <van-panel class="item">
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
                          :color="item.is_buy?'#5ad27c':'#FF3131' "
                          class="tagRight"
                        >{{item.is_buy?"求购":"出售"}}</van-tag>
                        <span>{{item.gift_name}}</span>
                      </li>
                      <li class="total">
                        <b>￥{{item.price}}</b>
                        <span class="num">{{item.count}}件</span>
                      </li>
                    </div>
                  </div>
                  <div slot="footer" class="itemBtn">
                    <!-- <van-button
                      v-if="is_seller==0"
                      plain
                      size="small"
                      style="margin-right:10px"
                      round
                      type="danger"
                      @click="delOrder(item.id)"
                    >删除</van-button> -->
                    <!-- 求购订单详情 -->
                    <van-button
                      plain
                      size="small"
                      round
                      color="#696FFF"
                      :to="'/giftDetail?id='+item.id+'&type='+is_seller"
                    >详情</van-button>
                    <!-- 出售 -->
                    <!-- <van-button
                      v-if="is_seller==0&&!item.is_buy"
                      plain
                      size="small"
                      round
                      color="#696FFF"
                      @click="toPayGift(item.id,item.sell_mid,item.gift_id,item.price)"
                    >付款</van-button>-->
                  </div>
                </van-panel>
              </div>
            </van-cell>
          </van-list>
        </div>
        <div v-if="activeName == 2" class="main">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="(item,index) in dataList" class="vanlist" :key="index">
              <div>
                <van-panel class="item">
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
                          :color="item.is_buy?'#5ad27c':'#FF3131' "
                          class="tagRight"
                        >{{item.is_buy?"求购":"出售"}}</van-tag>
                        <span>{{item.gift_name}}</span>
                      </li>
                      <li class="total">
                        <b>￥{{item.price}}</b>
                        <span class="num">{{item.count}}件</span>
                      </li>
                    </div>
                  </div>
                  <div slot="footer" class="itemBtn">
                    <!-- <van-button
                      v-if="is_seller==0"
                      plain
                      size="small"
                      style="margin-right:10px"
                      round
                      type="danger"
                      @click="delOrder(item.id)"
                    >删除</van-button> -->
                    <!-- 求购订单详情 -->
                    <van-button
                      plain
                      size="small"
                      round
                      color="#696FFF"
                      v-if="item.is_buy"
                      :to="'/giftDetail?id='+item.id+'&type='+is_seller"
                    >详情</van-button>
                    <!-- 出售 -->
                    <!-- <van-button
                      v-if="is_seller==0&&!item.is_buy"
                      plain
                      size="small"
                      round
                      color="#696FFF"
                      @click="toPayGift(item.id,item.sell_mid,item.gift_id,item.price)"
                    >付款</van-button>-->
                  </div>
                </van-panel>
              </div>
            </van-cell>
          </van-list>
        </div>
        <div v-else-if="activeName == 3" class="main">
          <!-- 礼物 -->
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="(item,index) in dataList" class="vanlist" :key="index">
              <div>
                <van-panel class="item">
                  <div class="itemInfo">
                    <van-image
                      class="infoImg"
                      width=".85rem"
                      height=".85rem"
                      lazy-load
                      radius="10px"
                      :src="img+item.img[0]"
                    />
                    <div class="info">
                      <li class="infoTitle">
                        <van-tag
                          :color="item.is_buy?'#5ad27c':'#FF3131' "
                          class="tagRight"
                        >{{item.is_buy?"求购":"出售"}}</van-tag>
                        <span>{{item.gift_name}}</span>
                      </li>
                      <li class="total">
                        <b>￥{{item.price}}</b>
                        <span class="num">{{item.count}}件</span>
                      </li>
                    </div>
                  </div>
                  <div slot="footer" class="itemBtn">
                    <!-- <van-button
                      plain
                      size="small"
                      style="margin-right:10px"
                      round
                      type="danger"
                      @click="delOrder(item.id)"
                      v-if="is_seller==0"
                    >删除</van-button> -->
                    <van-button
                      plain
                      size="small"
                      round
                      color="#696FFF"
                      @click="lookDetail(item.id,is_seller)"
                    >{{is_seller==1?'去发货':'查看'}}</van-button>
                  </div>
                </van-panel>
              </div>
            </van-cell>
          </van-list>
        </div>
        <div v-else-if="activeName == 4" class="main">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="(item,index) in dataList" class="vanlist" :key="index">
              <div>
                <van-panel class="item">
                  <div class="itemInfo">
                    <van-image
                      class="infoImg"
                      width=".85rem"
                      height=".85rem"
                      lazy-load
                      radius="10px"
                      :src="img+item.img[0]"
                    />
                    <div class="info">
                      <li class="infoTitle">
                        <van-tag
                          :color="item.is_buy?'#5ad27c':'#FF3131' "
                          class="tagRight"
                        >{{item.is_buy?"求购":"出售"}}</van-tag>
                        <span>{{item.gift_name}}</span>
                      </li>
                      <li class="total">
                        <b>￥{{item.price}}</b>
                        <span class="num">{{item.count}}件</span>
                      </li>
                    </div>
                  </div>
                  <div slot="footer" class="itemBtn">
                    <!-- <van-button
                      v-if="is_seller==0"
                      plain
                      size="small"
                      style="margin-right:10px"
                      round
                      type="danger"
                      @click="delOrder(item.id)"
                    >删除</van-button> -->
                    <!-- <van-button plain size="small" round color="#F2A638">售后</van-button> -->
                  </div>
                </van-panel>
              </div>
            </van-cell>
          </van-list>
        </div>
        <div v-else-if="activeName == 6" class="main">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="(item,index) in dataList" class="vanlist" :key="index">
              <div>
                <van-panel class="item">
                  <div class="itemInfo">
                    <van-image
                      class="infoImg"
                      width=".85rem"
                      height=".85rem"
                      lazy-load
                      radius="10px"
                      :src="img+item.img[0]"
                    />
                    <div class="info">
                      <li class="infoTitle">
                        <van-tag
                          :color="item.is_buy?'#5ad27c':'#FF3131' "
                          class="tagRight"
                        >{{item.is_buy?"求购":"出售"}}</van-tag>
                        <span>{{item.gift_name}}</span>
                      </li>
                      <li class="total">
                        <b>￥{{item.price}}</b>
                        <span class="num">{{item.count}}件</span>
                      </li>
                    </div>
                  </div>
                  <div slot="footer" class="itemBtn">
                    <!-- <van-button
                      v-if="is_seller==0"
                      plain
                      size="small"
                      style="margin-right:10px"
                      round
                      type="danger"
                      @click="delOrder(item.id)"
                    >删除</van-button> -->
                    <!-- 求购订单详情 -->
                    <van-button
                      plain
                      size="small"
                      round
                      color="#696FFF"
                      v-if="item.is_buy&&item.status==0"
                      :to="'/giftDetail?id='+item.id+'&type='+is_seller"
                    >{{is_seller==1?'去发货':'详情'}}</van-button>
                    <!-- 出售 -->
                    <van-button
                      plain
                      size="small"
                      v-if="item.status!=3&&item.status!=4 && item.status!=0"
                      round
                      color="#696FFF"
                      :to="'/giftDetail?id='+item.id+'&type='+is_seller"
                    >详情</van-button>
                    <van-button
                      plain
                      size="small"
                      round
                      v-if="item.status==3"
                      color="#696FFF"
                      @click="lookDetail(item.id,is_seller)"
                    >查看</van-button>
                    <van-button
                      v-if="is_seller==0&&item.is_buy==0&&item.status==0"
                      plain
                      size="small"
                      round
                      color="#696FFF"
                      @click="toPayGift(item.id,item.sell_mid,item.gift_id,item.price)"
                    >付款</van-button>
                    <!-- <van-button plain size="small" round color="#F2A638">售后</van-button> -->
                  </div>
                </van-panel>
              </div>
            </van-cell>
          </van-list>
        </div>
      </van-tab>
    </van-tabs>
    <!-- 支付 -->
    <van-dialog v-model="showPay" :show-confirm-button="false" style="padding:15px;width:80%">
      <div class="payTitle">
        <van-icon name="cross" @click="payBox()" class="close" />选择支付方式
      </div>
      <p class="num1">
        ￥
        <span>{{total}}</span>
      </p>
      <van-radio-group v-model="payType" :border="false">
        <van-cell-group :border="false">
          <van-cell :border="false" clickable @click="payType = 2">
            <div slot="title" class="payType">
              <van-icon name="alipay" size=".18rem" class="iconMg" color="#108EE9" />支付宝支付
            </div>
            <van-radio slot="right-icon" :name="2" />
          </van-cell>
          <van-cell :border="false" clickable @click="payType = 1">
            <div slot="title" class="payType">
              <van-icon name="wechat" size=".18rem" class="iconMg" color="#41B035" />微信支付
            </div>
            <van-radio slot="right-icon" :name="1" />
          </van-cell>
          <van-cell :border="false" clickable @click="payType = 0">
            <div slot="title" class="payType">
              <van-icon name="gold-coin" size=".18rem" class="iconMg" color="#FFA700" />
              余额支付(￥{{lines}})
            </div>
            <van-radio slot="right-icon" :disabled="Math.floor(lines)<total" :name="0" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <van-button
        round
        style="width:100%;margin-top:15px"
        color="linear-gradient(to bottom, #6574FF, #7065FF)"
        @click="showPopup"
      >确定</van-button>
    </van-dialog>
    <van-popup
      closeable
      position="bottom"
      :close-on-click-overlay="false"
      :style="{ height: '360px' }"
      v-model="show"
    >
      <div style="height:50px;padding-top:45px">
        <van-password-input
          style="width:100%"
          :value="payPwd"
          info="支付密码为 6 位数字"
          :focused="showKeyboard"
          @focus="showKeyboard = true"
        />
      </div>
      <van-number-keyboard :show="showKeyboard" @input="onInput" @delete="onDelete" />
    </van-popup>
    <van-popup v-model="loading1" :close-on-click-overlay="false" style="background:transparent">
      <van-loading size="24px" type="spinner" vertical></van-loading>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "MineOrder",
  data() {
    return {
      activeName: 0,
      page: 1,
      limit: 10,
      loading: false,
      finished: false,
      numlist: 0,
      tab: [
        // { title: "待付款", value: 0 },
        { title: "已预约", value: 1 },
        { title: "租用中", value: 2 },
        { title: "已购买", value: 3 },
        { title: "已租用", value: 4 },
        { title: "售后", value: 5 },
        { title: "全部", value: 6 }
      ],
      time: 30 * 60 * 60 * 1000,
      dataList: [],
      img: this.$global.imgUrl,
      is_seller: 0, //卖家 买家
      titleOption: [
        { text: "账号订单", value: "number" },
        { text: "礼物订单", value: "gift" }
      ],
      title: "number", //礼物 账号
      //下面所有都是 支付
      showPay: false,
      radio: 1,
      lines: "",
      show: false,
      showKeyboard: true,
      loading1: false,
      //都有参数
      order_id: "",
      sell_mid: "",
      payType: 0,
      payPwd: "",
      total: 0,
      //支付礼物传参
      gift_id: "",
      //出售出租账号判断
      sell_type: "",
      // 出租账号
      cash_price: "", //出售
      rent_type: "",
      number_id: "", //出售
      hour: ""
    };
  },
  created() {
    this.is_seller = this.$route.query.is_seller;
    this.title = this.$route.query.title;
    if (this.$route.query.id == undefined) {
      this.activeName = 5;
    } else {
      // 判断从哪里进来
      this.activeName = Number(this.$route.query.id);
      //买家账号
      if (this.is_seller == 1 && this.title == "number") {
        this.tab = [
          // { title: "待付款", value: 0 },
          { title: "租用中", value: 2 },
          { title: "已购买", value: 3 },
          { title: "已租用", value: 4 },
          { title: "售后", value: 5 },
          { title: "全部", value: 6 }
        ];
      } else if (this.is_seller == 0 && this.title == "number") {
        this.tab = [
          // { title: "待付款", value: 0 },
          { title: "已预约", value: 1 },
          { title: "租用中", value: 2 },
          { title: "已购买", value: 3 },
          { title: "已租用", value: 4 },
          { title: "售后", value: 5 },
          { title: "全部", value: 6 }
        ];
      }
      // 买家 礼物
      else if (this.is_seller == 0 && this.title == "gift") {
        this.tab = [
          { name: "待付款/发货", value: 0 },
          { name: "已发货", value: 1 },
          { name: "已购买", value: 3 },
          { name: "完成", value: 4 },
          { name: "全部", value: 6 }
        ];
      } else if (this.is_seller == 1 && this.title == "gift") {
        this.tab = [
          { name: "供应待发货", value: 0 },
          { name: "购买待发货", value: 3 },
          { name: "已发货", value: 1 },
          { name: "买家未收货", value: 2 },
          { name: "完成", value: 4 },
          { name: "全部", value: 6 }
        ];
      }
    }
    //获取用户余额
    this.$axios({
      url: this.$global.url + "api/user/memberList" + ".html",
      method: "POST",
      data: this.$qs.stringify({
        id: localStorage.getItem("mid")
      })
    })
      .then(res => {
        if (res.data.code == 1) {
          this.lines = res.data.data.lines;
        } else {
          this.$notify({
            message: res.data.msg,
            type: "danger"
          });
        }
      })
      .catch(e => {
        this.$notify({
          message: "网络较差，请稍后重试",
          type: "danger"
        });
      });
    this.getData();
  },
  mounted() {
    document.getElementsByClassName("van-nav-bar")[0].style.cssText =
      "z-index:99;position:fixed;top:0;width:100%;";
    document.getElementsByClassName("van-tabs__wrap")[0].style.cssText =
      "position: fixed;width: 100%;top: 46px;z-index: 20;";
  },
  methods: {
    //售后
    // upload() {
    //   this.$axios({
    //     url: this.$global.url + "api/common/updateOrder" + ".html",
    //     method: "POST"
    //   })
    //     .then(res => {})
    //     .catch(e => {});
    // },
    back() {
      this.$router.back(-1);
    },
    // 查看礼物订单详情
    lookDetail(item, is_seller) {
      this.$router.push({
        path: "/giftDetail",
        query: { id: item, type: is_seller }
      });
    },
    // 获取数据列表
    getData() {
      // if (this.active == 4) {
      //   this.upload();
      // }
      let obj = {};
      let api = "";
      if (this.activeName == 6) {
        api = "api/giftOrder/orderAll";
        obj = {
          mid: localStorage.getItem("mid"),
          goods: this.title,
          is_seller: this.is_seller,
          page: this.page,
          limit: this.limit
        };
      } else {
        api = "api/giftOrder/orderList";
        obj = {
          mid: localStorage.getItem("mid"),
          goods: this.title,
          status: this.activeName,
          is_seller: this.is_seller,
          page: this.page,
          limit: this.limit
        };
      }
      this.$axios({
        // url: this.$global.url + "api/common/updateOrder" + ".html",
        url: this.$global.url + api + ".html",
        method: "POST",
        data: this.$qs.stringify(obj)
      })
        .then(res => {
          if (res.data.code == 1) {
            // this.dataList = res.data.data;
            this.loading = false;
            for (let i = 0; i < res.data.data.length; i++) {
              this.dataList.push(res.data.data[i]);
            }
            if (res.data.count <= this.dataList.length) {
              this.finished = true;
            } else {
              this.finished = false;
            }
            this.numlist = res.data.count;
          } else if (res.data.code == 0) {
            this.dataList = [];
            this.loading = false;
            this.finished = true;
            // this.$notify({
            //   message: "暂无数据",
            //   type: "warning",
            //   duration: 1000
            // });
          } else {
            this.$notify({
              message: res.data.msg,
              type: "danger"
            });
          }
        })
        .catch(e => {
          this.dataList = [];
          this.loading = false;
          this.finished = true;
          this.$notify({
            message: "网络较差，请稍后重试！",
            type: "danger"
          });
        });
    },
    // 切换tab
    getTabs() {
      this.page = 1;
      this.loading = true;
      this.finished = false;
      this.dataList = [];
      this.getData();
    },
    //改变上面下拉
    changeTitle(name) {
      if (name == "gift") {
        if (this.is_seller == 1) {
          this.tab = [
            { name: "供应待发货", value: 0 },
            { name: "购买待发货", value: 3 },
            { name: "已发货", value: 1 },
            { name: "买家未收货", value: 2 },
            { name: "完成", value: 4 },
            { name: "全部", value: 6 }
          ];
          this.$router.push({
            path: "/order",
            query: {
              id: 0,
              is_seller: 1,
              title: "gift"
            }
          });
          this.$router.go(0);
        } else {
          this.tab = [
            { name: "待付款/发货", value: 0 },
            { name: "已发货", value: 1 },
            { name: "已购买", value: 3 },
            { name: "完成", value: 4 },
            { name: "全部", value: 6 }
          ];
          this.$router.push({
            path: "/order",
            query: {
              id: 0,
              is_seller: 0,
              title: "gift"
            }
          });
          this.$router.go(0);
        }
        // this.activeName = this.tab[0].value;
      } else if (name == "number") {
        if (this.is_seller == 1) {
          this.tab = [
            // { title: "待付款", value: 0 },
            { title: "租用中", value: 2 },
            { title: "已购买", value: 3 },
            { title: "已租用", value: 4 },
            { title: "售后", value: 5 },
            { title: "全部", value: 6 }
          ];
          this.$router.push({
            path: "/order",
            query: {
              id: 2,
              is_seller: 1,
              title: "number"
            }
          });
          this.$router.go(0);
        } else {
          this.tab = [
            // { title: "待付款", value: 0 },
            { title: "已预约", value: 1 },
            { title: "租用中", value: 2 },
            { title: "已购买", value: 3 },
            { title: "已租用", value: 4 },
            { title: "售后", value: 5 },
            { title: "全部", value: 6 }
          ];
          this.$router.push({
            path: "/order",
            query: {
              id: 1,
              is_seller: 0,
              title: "number"
            }
          });
          this.$router.go(0);
        }
        // this.activeName=this.tab[0].value;
      }
      // console.log(this.tab);
      // this.activeName = this.tab[0].value;
      // console.log(this.activeName);
      // this.activeName = 0;
      // if (name == "number") {
      //   if (this.is_seller == 1) {
      //     this.activeName = 2;
      //   } else {
      //     this.activeName = 1;
      //   }
      // }
      // this.page = 1;
      // this.loading = true;
      // this.finished = false;
      // this.dataList = [];
      // this.getData();
    },
    //删除订单
    delOrder(id) {
      this.$dialog
        .confirm({
          title: "删除",
          message: "确定要删除吗？此过程不可逆！！！"
        })
        .then(() => {
          this.$axios({
            url: this.$global.url + "api/giftOrder/isShow" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              goods: this.title,
              order_id: id
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.dataList = [];
                this.page = 1;
                this.loading = true;
                this.finished = false;
                this.getData();
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
    },
    //礼物支付接口
    giftPay() {
      this.$axios({
        url: this.$global.url + "api/giftOrder/giftPayOrder" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            mid: localStorage.getItem("mid"),
            sell_mid: this.sell_mid,
            pay_pwd: this.payPwd,
            price: this.total,
            pay_type: this.payType,
            order_id: this.order_id,
            gift_id: this.gift_id,
            count: 1
          }
        })
      })
        .then(res => {
          this.loading1 = false;
          if (res.data.code == 1) {
            this.showPay = false;
            this.$router.push({
              path: "/giftSuccess",
              query: { id: "", title: 3 }
            });
          } else {
            this.payPwd = "";
            this.$notify({
              message: res.data.msg,
              type: "danger"
            });
          }
        })
        .catch(e => {
          this.loading1 = false;
          this.payPwd = "";
          this.$notify({
            message: "网络较差，请稍后重试！",
            type: "danger"
          });
        });
    },
    //账号出售支付
    sellPay() {
      this.$axios({
        url: this.$global.url + "api/numberOrder/outPayOrder" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            mid: localStorage.getItem("mid"),
            sell_mid: this.sell_mid,
            pay_pwd: this.payPwd,
            price: this.total,
            cash_price: this.cash_price,
            number_id: this.number_id,
            pay_type: this.payType,
            order_id: this.order_id
          }
        })
      })
        .then(res => {
          this.loading = false;
          if (res.data.code == 1) {
            this.showPay = false;
            this.$notify({
              message: res.data.msg,
              type: "success"
            });
            localStorage.setItem("pay", JSON.stringify(res.data.data));
            this.$router.push({
              path: "/paySuccess",
              query: { id: this.sell_type }
            });
          } else {
            this.payPwd = "";
            this.$notify({
              message: res.data.msg,
              type: "danger"
            });
          }
        })
        .catch(e => {
          this.loading = false;
          this.payPwd = "";
          this.$notify({
            message: "网络较差，请稍后重试！",
            type: "danger"
          });
        });
    },
    //账号出租支付
    rentPay() {
      this.$axios({
        url: this.$global.url + "api/numberOrder/payOrder" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            mid: localStorage.getItem("mid"),
            sell_mid: this.sell_mid,
            pay_pwd: this.payPwd,
            price: this.total,
            cash_price: this.cash_price,
            rent_type: this.rent_type,
            number_id: this.number_id,
            hour: this.hour,
            pay_type: this.payType,
            order_id: this.order_id
          }
        })
      })
        .then(res => {
          this.loading = false;
          if (res.data.code == 1) {
            this.showPay = false;
            this.$notify({
              message: res.data.msg,
              type: "success"
            });
            localStorage.setItem("pay", JSON.stringify(res.data.data));
            this.$router.push({
              path: "/paySuccess",
              query: { id: this.sell_type }
            });
          } else {
            this.payPwd = "";
            this.$notify({
              message: res.data.msg,
              type: "danger"
            });
          }
        })
        .catch(e => {
          this.loading = false;
          this.payPwd = "";
          this.$notify({
            message: "网络较差，请稍后重试！",
            type: "danger"
          });
        });
    },
    //关闭支付弹窗
    payBox() {
      this.showPay = !this.showPay;
    },
    //删除密码
    onDelete() {
      this.payPwd = this.payPwd.slice(0, this.payPwd.length - 1);
    },
    //密码输入事件
    onInput(key) {
      this.payPwd = (this.payPwd + key).slice(0, 6);
      if (this.payPwd.length == 6) {
        this.show = false;
        this.loading = true;
        if (this.title == "gift") {
          this.giftPay();
        } else if (this.title == "number") {
          if (this.sell_type == 1) {
            this.sellPay();
          } else if (this.sell_type == 0) {
            this.rentPay();
          }
        }
      }
    },
    //支付密码弹框
    showPopup() {
      if (!this.total > 0) {
        this.$notify({
          message: "总价格有误！！！",
          type: "danger"
        });
        return false;
      }
      if (this.payType == 0) {
        this.show = true;
      }
      // this.doOrder()
    },
    //礼物付款
    toPayGift(orderid, sell_mid, gift_id, price) {
      this.showPay = !this.showPay;
      this.order_id = orderid;
      this.sell_mid = sell_mid;
      this.gift_id = gift_id;
      this.total = price;
    },
    //账号付款
    toPayNumber(item) {
      //0：出租  1：出售
      this.sell_type = item.type;
      this.showPay = !this.showPay;
      if (this.sell_type == 0) {
        this.order_id = item.id;
        this.sell_mid = item.sell_mid;
        this.total = item.price;
        this.cash_price = item.cash_price;
        this.rent_type = item.rent_type;
        this.number_id = item.number_id;
        this.hour = item.hour;
      } else if (this.sell_type == 1) {
        this.order_id = item.id;
        this.sell_mid = item.sell_mid;
        this.total = item.price;
        this.cash_price = item.cash_price;
        this.number_id = item.number_id;
      }
    },
    toShop(item, type) {
      if (type == "预约") {
        if (item.merch_name == "平台") {
          this.$toast("平台无店铺！！");
        } else if (item.merch_name == "个人") {
          this.$toast("个人无店铺！！");
        } else {
          this.$router.push({
            path: "/shopDetail",
            query: { shop: item.merch_name.mid }
          });
        }
      } else {
        if (typeof item.merch_name == "object") {
          this.$router.push({
            path: "/shopDetail",
            query: { shop: item.merch_name }
          });
        } else if (item.sell_mid == null) {
          this.$toast("个人无店铺！！");
        } else if (typeof item.sell_mid == "object") {
          this.$router.push({
            path: "/shopDetail",
            query: { shop: item.sell_mid.mid }
          });
        } else if (item.merch_name == "平台" || item.sell_mid == "平台") {
          this.$toast("平台无店铺！！");
        }
      }
    },
    //取消预约
    delReserve(id) {
      this.$dialog
        .confirm({
          title: "取消预约",
          message: "确定要取消预约吗？此过程不可逆！！！"
        })
        .then(() => {
          this.$axios({
            url: this.$global.url + "api/user/delReserve" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              id: id
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.dataList = [];
                this.page = 1;
                this.loading = true;
                this.finished = false;
                this.getData();
                this.$notify({
                  message: "取消成功",
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
    },
    // 联系卖家、买家
    contact(tel, is_seller, buy_tel, wechat,sell_tel) {
      if(sell_tel==null){
        sell_tel="无"
      }
      if (is_seller == 0) {
        this.$dialog
          .alert({
            title: "联系卖家",
            message: "平台电话：" + tel + "<br>平台微信：" + wechat + "<br>商家电话：" + sell_tel
          })
          .then(() => {
            // on close
          });
      } else if (is_seller == 1) {
        this.$dialog
          .alert({
            title: "联系买家",
            message: "平台电话：" + tel + "<br>平台微信：" + wechat + "<br>买家电话：" + buy_tel
          })
          .then(() => {
            // on close
          });
      }
    },
    //列表更新
    onLoad() {
      this.finished = false;
      if (this.numlist <= this.dataList.length) {
        return false;
      }
      this.page += 1;
      this.getData();
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
  padding: 10px;
  box-sizing: border-box;
}
.itemInfo {
  padding: 0.04rem 0 0;
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
.title {
  display: flex;
  align-items: center;
  padding-left: 0.05rem;
}
.name {
  color: rgba(51, 51, 51, 0.8);
  font-size: 0.11rem;
  padding: 0 0.05rem;
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
  /* padding: 0.03rem 0; */
  margin: 0 0.02rem;
}
.itemBtn {
  padding-top: 0.15rem;
  padding-left: 1rem;
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

.main {
  padding-top: 110px;
}
.count {
  width: 1.5rem;
  text-align: left;
  margin-left: 0.16rem;
  font-size: 0.14rem;
}
.count span {
  font-size: 0.16rem;
  color: red;
}
.close {
  position: absolute;
  top: 0;
  left: 0;
  line-height: 0.2rem;
}
.payTitle {
  text-align: center;
  position: relative;
}

.payTitle {
  text-align: center;
  position: relative;
}
.close {
  position: absolute;
  top: 0;
  left: 0;
  line-height: 0.2rem;
}
.num1 {
  text-align: center;
  font-size: 0.22rem;
  font-weight: bold;
  padding: 15px 0;
}
.num1 span {
  font-size: 0.48rem;
}
.payType {
  display: flex;
  line-height: 0.2rem;
}
.van-cell:not(:last-child)::after {
  border-bottom: none;
}
.van-hairline--top::after {
  border-top-width: 0;
}
.van-cell {
  background: transparent !important;
  padding: 0 !important;
}
.van-cell--borderless {
  padding: 10px !important;
}
</style>