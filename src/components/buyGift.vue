<template>
  <div class="bgColor">
    <div class="header">
      <van-nav-bar :border="false" title="我要求购" left-arrow @click-left="back()">
        <!-- <van-icon slot="right" name="question-o" color="#444444" /> -->
      </van-nav-bar>
    </div>
    <div class="main">
      <van-cell-group class="cellGroup">
        <van-cell title="礼物分类" is-link :value="gift_class" @click="classPicker(1)" />
        <van-cell title="礼物名称" is-link :value="gift_name" @click="classPicker(2)" />
        <van-uploader
          v-model="fileList"
          class="imgList"
          :max-count="8"
          preview-size=".54rem"
          :after-read="afterRead"
          @delete="delImg"
          multiple
        />
      </van-cell-group>
      <!-- <van-cell-group class="cellGroup">
        <van-uploader
          v-model="fileList"
          class="imgList"
          preview-size=".69rem"
          disabled
          :deletable="false"
          :max-count="1"
          @delete="delimg"
        />
        <input
          style="width:60%;text-align:left"
          type="text"
          readonly
          placeholder="请选择求购商品"
          @click="showclass=!showclass"
          v-model="form.name"
        />
      </van-cell-group>-->
      <p class="title paddingB10">购买信息</p>
      <van-cell-group class="cellGroup">
        <van-field label="求购价格：" type="number" placeholder="请输入价格（元）" v-model="form.price" />
        <van-field label="求购数量：">
          <template slot="input">
            <van-stepper v-model="form.num" integer />
          </template>
        </van-field>
      </van-cell-group>
      <p class="tishi">求购需全额支付此商品</p>
      <p class="title paddingB10">使用人信息</p>
      <div class="detal">
        <van-cell-group style="border-radius:10px;overflow: hidden;">
          <van-cell title="hello_ID">
            <template slot="default">
              <input type="text" placeholder="请输入" v-model="form.game_id" />
            </template>
          </van-cell>
          <van-cell title="昵称">
            <template slot="default">
              <input type="text" placeholder="请输入" v-model="form.game_name" />
            </template>
          </van-cell>
          <van-cell
            title="性别"
            is-link
            :border="false"
            :value="form.sex.value"
            @click="showSex=!showSex"
          ></van-cell>
        </van-cell-group>
      </div>
      <p class="groupTitle">
        <van-checkbox v-model="checked" checked-color="#108EE9">
          已阅读并同意
          <router-link to="#">《玩号吧服务协议》</router-link>
        </van-checkbox>
      </p>
      <van-button
        color="linear-gradient(to bottom,rgba(101,116,255,1) 0%,rgba(112,101,255,1) 100%)"
        round
        size="large"
        @click="toPay"
      >购买</van-button>
    </div>
    <!-- 选择性别 -->
    <van-popup v-model="showSex" position="bottom" :style="{ height: '50%' }">
      <van-picker
        show-toolbar
        :default-index="0"
        @cancel="onCancel"
        :columns="columns"
        @confirm="onConfirm"
      />
    </van-popup>
    <!-- 礼物分类 -->
    <!-- <van-popup v-model="showclass" round position="bottom">
      <div class="spe">
        <li>
          <p class="speTitle">礼包分类</p>
          <div class="btnGroup">
            <van-button
              v-for="(item,index) in classList"
              :key="index"
              class="speBtn claslist"
              color="rgba(153,153,153,0.2)"
              size="small"
              round
              @click="getGiftNameList(item.id,index)"
            >{{item.gift_name}}</van-button>
          </div>
        </li>
        <li>
          <p class="speTitle">选择礼物</p>
          <div class="btnGroup">
            <van-button
              v-for="(item,index) in nameList"
              :key="index"
              class="speBtn giftname"
              color="rgba(153,153,153,0.2)"
              size="small"
              round
              @click="getName(item.name,index,item.id,item.class_id)"
            >{{item.name}}</van-button>
          </div>
        </li>
        <van-row style="padding-top:10px">
          <van-col span="8">
            <van-button style="width:100%" color="#5AD27C" round @click="resite">重置</van-button>
          </van-col>
          <van-col offset="2" span="14">
            <van-button style="width:100%" color="#696FFF" round @click="showclass=!showclass">确定</van-button>
          </van-col>
        </van-row>
      </div>
    </van-popup>-->
    <!-- 礼物分类列表 -->
    <van-popup v-model="classShow" round position="bottom" :style="{ height: '35%' }">
      <van-picker
        show-toolbar
        cancel-button-text="取消"
        confirm-button-text
        @cancel="classShow=false"
        @confirm="changePicker"
        :columns="classList.name"
      ></van-picker>
    </van-popup>
    <!-- 分类添加 -->
    <van-dialog
      v-model="addshow"
      title="添加"
      show-cancel-button
      show-confirm-button
      @confirm="add()"
    >
      <van-field v-model="varname" maxlength="8" label="名称" placeholder="请输入名称" />
    </van-dialog>
    <!-- 支付 -->
    <van-dialog v-model="showPay" :show-confirm-button="false" style="padding:15px;">
      <div class="payTitle">
        <van-icon name="cross" @click="payBox()" class="close" />选择支付方式
      </div>
      <p class="num">
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
    <van-popup v-model="loading" :close-on-click-overlay="false" style="background:transparent">
      <van-loading size="24px" type="spinner" vertical></van-loading>
    </van-popup>
  </div>
</template>
<script>
export default {
  name: "sellGift",
  data() {
    return {
      checked: true,
      fileList: [],
      showSex: false, //性别弹窗
      columns: ["无", "男", "女"],
      // showclass: false,
      form: {
        name: "",
        price: "", //单价
        num: 1,
        game_id: "",
        game_name: "",
        sex: {
          value: "无",
          type: 0
        },
        classid: "",
        nameid: "",
        gift_id: "",
        img: [],
        goods_cash:0,
      },
      gift_class: "请选择",
      gift_name: "请选择",
      classList: {},
      nameList: [],
      showPay: false, //支付弹窗
      radio: 1,
      lines: "", //余额
      total: 0, //商品总金额
      show: false,
      payPwd: "",
      showKeyboard: true,
      payType: 0, //支付方式 0余额 1微信 2支付宝
      loading: false,
      order_id: "",
      varname: "", //添加输入名称
      addshow: false, //添加弹窗
      addType: 1, //当前添加弹框类型 1添加礼物分类 2添加礼物名称,
      classShow: false //礼物分类选框
    };
  },
  mounted() {
    // this.getClassList();
    //获取余额
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
  },
  methods: {
    //展示支付界面
    toPay() {
      let reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/; //金额 （保留两位小数）
      if (this.form.classid == "") {
        this.$notify({
          message: "请选择求购分类！",
          type: "danger"
        });
        return false;
      } else if (this.form.nameid == "") {
        this.$notify({
          message: "请选择礼物名称！",
          type: "danger"
        });
      } else if (this.form.img.length < 1) {
        this.$notify({
          message: "请上传图片",
          type: "danger"
        });
        return false;
      } else if (this.form.price == "") {
        this.$notify({
          message: "请输入价格！",
          type: "danger"
        });
      } else if (!reg.test(this.form.price)) {
        this.$notify({
          message: "请输入正确价格！",
          type: "danger"
        });
      } else if (this.form.game_id == "") {
        this.$notify({
          message: "请输入游戏ID！",
          type: "danger"
        });
      } else if (this.form.game_name == "") {
        this.$notify({
          message: "请输入昵称！",
          type: "danger"
        });
      } else if (!this.checked) {
        this.$notify({
          message: "请勾选协议！",
          type: "danger"
        });
      } else {
        this.total = this.form.price * this.form.num;
        this.showPay = !this.showPay;
      }
    },
    //支付接口
    giftPay() {
      this.$axios({
        url: this.$global.url + "api/giftOrder/payBuy" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            mid: localStorage.getItem("mid"),
            pay_pwd: this.payPwd,
            price: this.total,
            pay_type: this.payType
          }
        })
      })
        .then(res => {
          this.loading = false;
          if (res.data.code == 1) {
            this.addGift();
            this.showPay = false;
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
            message: "网络较差，请稍后重试！1",
            type: "danger"
          });
        });
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
        this.giftPay();
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
    // 添加礼物
    classPicker(index) {
      this.addType = index;
      if (index == 2 && this.form.classid == "") {
        this.$notify({
          message: "请选择礼物分类！！！",
          type: "danger"
        });
        return false;
      } else if (index == 1) {
        this.getClassList();
      } else {
        this.getClassList();
      }
      // this.classShow = true;
    },
    //获取分类列表
    getClassList() {
      let urlApi = "";
      let obj = {};
      if (this.addType == 1) {
        urlApi = "root/gift/classList";
        obj = {};
      } else if (this.addType == 2) {
        urlApi = "root/gift/giftNameList";
        obj.class_id = this.form.classid;
      }
      this.$axios({
        url: this.$global.url + urlApi + ".html",
        method: "POST",
        data: this.$qs.stringify(obj)
      })
        .then(res => {
          if (res.data.code == 1) {
            this.classList.id = [];
            this.classList.name = [];
            if (this.addType == 1) {
              for (let i = 0; i < res.data.data.length; i++) {
                this.classList.id.push(res.data.data[i].id);
                this.classList.name.push(res.data.data[i].gift_name);
              }
            } else if (this.addType == 2) {
              for (let i = 0; i < res.data.data.length; i++) {
                this.classList.id.push(res.data.data[i].id);
                this.classList.name.push(res.data.data[i].name);
              }
            }
            this.classShow = true;
          } else if (res.data.code == 0) {
            // this.addshow = true;
            this.$notify({
              message: "暂无数据",
              type: "warning"
            });
          } else {
            this.$notify({
              message: res.data.data
            });
          }
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            message: "服务器错误",
            type: "danger"
          });
        });
    },
    //添加礼物分类
    add() {
      let urlApi = "";
      let obj = {};
      if (this.addType == 1) {
        urlApi = "root/gift/addClass";
        obj.gift_name = this.varname;
      } else if (this.addType == 2) {
        urlApi = "root/gift/giftNameAdd";
        obj = {
          class_id: this.form.classid,
          name: this.varname
        };
      }
      this.$axios({
        url: this.$global.url + urlApi + ".html",
        method: "POST",
        data: this.$qs.stringify(obj)
      })
        .then(res => {
          if (res.data.code == 1) {
            this.$notify({
              message: res.data.msg,
              type: "success"
            });
            this.classShow = false;
            this.getClassList();
            this.varname = "";
          } else {
            this.$notify({
              message: res.data.msg,
              type: "danger"
            });
          }
        })
        .catch(e => {});
    },
    //获取值
    changePicker(value, index) {
      this.classShow = false;
      if (this.addType == 1) {
        this.form.classid = this.classList.id[index];
        this.gift_class = value;
      } else if (this.addType == 2) {
        this.form.nameid = this.classList.id[index];
        this.gift_name = value;
      }
    },
    payBox() {
      this.showPay = !this.showPay;
    },
    //上传图片
    delImg(file, detail) {
      this.form.img.splice(detail.index, 1);
    },
    //图片上传
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      let fd = new FormData();
      fd.append("file", file.file);
      let requestConfig = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      this.$axios
        .post(
          this.$global.url + "root/common/uploadImg" + ".html",
          fd,
          requestConfig
        )
        .then(res => {
          if (res.data.code == 1) {
            this.form.img.push(res.data.src);
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
    back() {
      this.$router.back(-1);
    },
    onCancel() {
      this.showSex = !this.showSex;
    },
    onConfirm(value, index) {
      this.form.sex.value = value;
      this.form.sex.type = index;
      this.showSex = !this.showSex;
    },
    //添加求购礼物购买
    addGift() {
      this.$axios({
        url: this.$global.url + "api/gift/addGift" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            mid: localStorage.getItem("mid"),
            class_id: this.form.classid,
            name_id: this.form.nameid,
            askuser_name: this.form.game_name,
            askuser_id: this.form.game_id,
            askuser_sex: this.form.sex.type,
            ask_sum: this.form.num,
            price: this.form.price,
            sum_price: this.total,
            img: this.form.img,
            goods_cash:this.form.goods_cash,
          }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.form.gift_id = res.data.gift_id;
            // 创建求购订单
            this.$axios({
              url: this.$global.url + "api/giftOrder/payBuyOrder" + ".html",
              method: "POST",
              data: this.$qs.stringify({
                data: {
                  mid: localStorage.getItem("mid"),
                  price: this.total,
                  is_buy: 1,
                  remark: "",
                  gift_id: this.form.gift_id,
                  game_number: this.form.game_id,
                  game_name: this.form.game_name,
                  game_sex: this.form.sex.type,
                  count: this.form.num,
                  pay_type: this.payType
                }
              })
            })
              .then(res => {
                if (res.data.code == 1) {
                  this.$router.push({
                    path: "/giftSuccess",
                    query: { id: this.form.gift_id, title: 0 }
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
          } else {
            this.$notify({
              message: res.data.msg,
              type: "danger"
            });
          }
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            message: "网络较差，请稍后重试！",
            type: "danger"
          });
        });
    }
    //获取礼物分类
    // root/gift/classList
    // getClassList() {
    //   this.$axios({
    //     url: this.$global.url + "root/gift/classList" + ".html",
    //     method: "POST"
    //   })
    //     .then(res => {
    //       if (res.data.code == 1) {
    //         this.classList = res.data.data;
    //       } else {
    //         this.$notify({
    //           message: res.data.msg,
    //           type: "danger"
    //         });
    //       }
    //     })
    //     .catch(e => {
    //       console.log(e);
    //       this.$notify({
    //         message: "网络较差，请稍后重试！",
    //         type: "danger"
    //       });
    //     });
    // },
    // 获取礼物名字
    // getGiftNameList(itemid, index) {
    //   let classlists = document.getElementsByClassName("claslist");
    //   for (let i = 0; i < classlists.length; i++) {
    //     classlists[i].style.cssText =
    //       "color: rgb(255, 255, 255); background: rgba(153, 153, 153, 0.2); border-color: rgba(153, 153, 153, 0.2);";
    //   }
    //   classlists[index].style.cssText =
    //     "color: rgb(255, 255, 255); background: rgb(105, 111, 255); border-color: rgb(105, 111, 255);";
    //   this.$axios({
    //     url: this.$global.url + "root/gift/giftNameList" + ".html",
    //     method: "POST",
    //     data: this.$qs.stringify({
    //       class_id: itemid
    //     })
    //   })
    //     .then(res => {
    //       if (res.data.code == 1) {
    //         this.nameList = res.data.data;
    //       } else {
    //         this.$notify({
    //           message: res.data.msg,
    //           type: "danger"
    //         });
    //       }
    //     })
    //     .catch(e => {
    //       console.log(e);
    //       this.$notify({
    //         message: "网络较差，请稍后重试！",
    //         type: "danger"
    //       });
    //     });
    // },
    // //获取图片
    // getName(name, index, itemid, classid) {
    //   this.form.classid = classid;
    //   this.form.nameid = itemid;
    //   let classlists = document.getElementsByClassName("giftname");
    //   for (let i = 0; i < classlists.length; i++) {
    //     classlists[i].style.cssText =
    //       "color: rgb(255, 255, 255); background: rgba(153, 153, 153, 0.2); border-color: rgba(153, 153, 153, 0.2);";
    //   }
    //   classlists[index].style.cssText =
    //     "color: rgb(255, 255, 255); background: rgb(105, 111, 255); border-color: rgb(105, 111, 255);";
    //   this.$axios({
    //     url: this.$global.url + "api/gift/addGiftList" + ".html",
    //     method: "POST",
    //     data: this.$qs.stringify({
    //       class_id: classid,
    //       name_id: itemid
    //     })
    //   })
    //     .then(res => {
    //       if (res.data.code == 1) {
    //         this.fileList = [];
    //         this.fileList.push({
    //           url: this.$global.imgUrl + res.data.data[0]
    //         });
    //       } else {
    //         this.$notify({
    //           message: res.data.msg,
    //           type: "danger"
    //         });
    //       }
    //     })
    //     .catch(e => {
    //       console.log(e);
    //       this.$notify({
    //         message: "网络较差，请稍后重试！",
    //         type: "danger"
    //       });
    //     });
    //   this.form.name = name;
    // },
    // //重置
    // resite() {
    //   let classlists = document.getElementsByClassName("claslist");
    //   for (let i = 0; i < classlists.length; i++) {
    //     classlists[i].style.cssText =
    //       "color: rgb(255, 255, 255); background: rgba(153, 153, 153, 0.2); border-color: rgba(153, 153, 153, 0.2);";
    //   }
    //   this.nameList = "";
    //   this.form.name = "";
    //   this.fileList = [];
    // },
    // delimg() {
    //   let classlists = document.getElementsByClassName("claslist");
    //   for (let i = 0; i < classlists.length; i++) {
    //     classlists[i].style.cssText =
    //       "color: rgb(255, 255, 255); background: rgba(153, 153, 153, 0.2); border-color: rgba(153, 153, 153, 0.2);";
    //   }
    //   this.form.name = "";
    //   this.fileList = [];
    //   this.nameList = "";
    // }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bgColor {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
}
.header {
  padding: 7px 0;
  background: #fff;
}
.main {
  padding: 15px;
}
.cellGroup {
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 15px;
}
.title {
  font-size: 0.14rem;
  color: #666;
  padding: 15px 0 0 15px;
}
.imgList {
  padding: 15px 0 10px 15px;
}
.grid {
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  text-align: center;
  padding: 15px 0;
}
.option {
  font-size: 0.14rem;
  color: #666666;
}
.option p {
  display: flex;
  align-items: center;
  line-height: 0.2rem;
}
.typeText {
  color: rgba(51, 51, 51, 0.4);
  padding-top: 15px;
}
.paddingB10 {
  padding-bottom: 10px;
}
.label {
  display: flex;
  align-items: center;
}
.groupTitle {
  display: flex;
  font-size: 0.14rem;
  color: #424242;
  margin-bottom: 30px;
  margin-top: 10px;
}
.tishi {
  font-size: 0.12rem;
  color: rgba(51, 51, 51, 0.4);
  text-indent: 0.15rem;
}
.groupTitle a {
  color: #108ee9;
}
input {
  border: none;
  text-align: right;
  width: 100%;
}
.spe {
  padding: 20px 20px 15px;
}
.speTitle {
  font-size: 14px;
  color: #333;
  list-style: 20px;
  padding-bottom: 15px;
  font-weight: bold;
}
.speBtn {
  color: rgba(51, 51, 51, 0.4) !important;
  border: none !important;
  margin: 0 10px 10px 0;
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
.num {
  text-align: center;
  font-size: 0.22rem;
  font-weight: bold;
  padding: 15px 0;
}
.num span {
  font-size: 0.48rem;
}
.payType {
  display: flex;
  line-height: 0.2rem;
}
.iconMg {
  margin-right: 5px;
}
.colorRed {
  color: #ff3131;
}
</style>
