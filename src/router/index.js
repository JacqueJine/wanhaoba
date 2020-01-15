import Vue from 'vue'
import Router from 'vue-router'
import global from '../utils/auth'
import Index from './../components/index'
import Class from './../components/class'
import classList from './../components/classList'
import publish from './../components/publish'
import news from './../components/news'
import mine from './../components/mine'
import MineSeller from './../components/MineSeller'
import MineOrder from './../components/MineOrder'
import orderDetail from './../components/orderDetail'
import orderStatus from './../components/orderStatus'
import MineSet from './../components/MineSet'
import MineMessage from './../components/MineMessage'
import MineCLPassword from './../components/MineCLPassword'
import MineCPPassword from './../components/MineCPPassword'
import MineRName from './../components/MineRName'
import MineCAccount from './../components/MineCAccount'
import MineResidue from './../components/MineResidue'
import MineSugar from './../components/MineSugar'
import MineBill from './../components/MineBill'
import MineTBalance from './../components/MineTBalance'
import MineWithdraw from './../components/MineWithdraw'
import withDRecord from './../components/withDRecord'
import MineCollect from './../components/MineCollect'
import merchant from './../components/merchant'
import ppxgift from './../components/ppxgift'
import ppx from './../components/ppx'
import goodsDetail from './../components/goodsDetail'
import confirmOrder from './../components/confirmOrder'
import paySuccess from './../components/paySuccess'
import openShop_1 from './../components/openShop_1'
import openShop_2 from './../components/openShop_2'
import openShop_3 from './../components/openShop_3'
import shopDetail from './../components/shopDetail'
import shopInfo from './../components/shopInfo'
import rent from './../components/rent'
import sell from './../components/sell'
import sellGift from './../components/sellGift'
import Login_Regis from './../components/Login_Regis'
import Login from './../components/Login'
import Register from './../components/Register'
import ForgetPass from './../components/ForgetPass'
import SetPass from './../components/SetPass'
import buyGift from './../components/buyGift'
import Search from './../components/Search'
import toTop from './../components/toTop'
import buy_ppxgift from './../components/buy_ppxgift'
import giftSuccess from './../components/giftSuccess'
import giftDetail from './../components/giftDetail'
import supply_ppxgift from './../components/supply_ppxgift'
import giftSelldetail from './../components/giftSelldetail'
import giftOrder from './../components/giftOrder'
import idcarde from './../components/idcarde'
import numberSuccess from './../components/numberSuccess'
import editRent from './../components/editRent'
import editSell from './../components/editSell'
import editGift from './../components/editGift'
Vue.use(Router)

const router = new Router({
    // mode: 'history',
    routes: [{
            path: '/',
            redirect() {
                return '/index'
            }
        }, {
            path: '/index',
            component: Index,
            meta: {
                title: '首页'
            }
        }, {
            path: '/class',
            component: Class,
            meta: {
                title: '分类'
            }
        }, {
            path: '/classList',
            component: classList,
            meta: {
                title: '分类列表'
            }
        }, {
            path: '/publish',
            component: publish,
            meta: {
                title: '发布'
            }
        }, {
            path: '/news',
            component: news,
            meta: {
                title: '消息'
            }
        }, {
            path: '/mine',
            component: mine,
            meta: {
                title: '我的'
            }
        },
        {
            path: '/seller',
            component: MineSeller,
            meta: {
                title: '联系卖家'
            }
        }, {
            path: '/order',
            component: MineOrder,
            meta: {
                title: '买家订单信息'
            }
        }, {
            path: '/orderDetail',
            component: orderDetail,
            meta: {
                title: '订单详情'
            }
        }, {
            path: '/orderStatus',
            component: orderStatus,
            meta: {
                title: '卖家账号状态管理'
            }
        },
        {
            path: '/set',
            component: MineSet,
            meta: {
                title: '个人设置'
            }
        },
        {
            path: '/message',
            component: MineMessage,
            meta: {
                title: '个人信息'
            }
        },
        {
            path: '/clpassword',
            component: MineCLPassword,
            meta: {
                title: '修改登录密码'
            }
        },
        {
            path: '/cppassword',
            component: MineCPPassword,
            meta: {
                title: '修改支付密码'
            }
        },
        {
            path: '/rname',
            component: MineRName,
            meta: {
                title: '实名认证'
            }
        },
        {
            path: '/caccount',
            component: MineCAccount,
            meta: {
                title: '提现账户'
            }
        },
        {
            path: '/residue',
            component: MineResidue,
            mate: {
                title: '余额'
            }
        },
        {
            path: '/sugar',
            component: MineSugar,
            mate: {
                title: '糖果'
            }
        },
        {
            path: '/bill',
            component: MineBill,
            mate: {
                title: '账单'
            }
        },
        {
            path: '/balance',
            component: MineTBalance,
            mate: {
                title: '转为余额',
            }
        },
        {
            path: '/withdraw',
            component: MineWithdraw,
            mate: {
                title: '提现',
            }
        },
        {
            path: '/withDRecord',
            component: withDRecord,
            mate: {
                title: '提现详情',
            }
        },
        {
            path: '/collect',
            component: MineCollect,
            mate: {
                title: '收藏',
            }
        },
        {
            path: '/merchant',
            component: merchant,
            meta: {
                title: '金牌商家'
            }
        }, {
            path: '/ppxgift',
            component: ppxgift,
            meta: {
                title: '皮皮蟹礼物'
            }
        }, {
            path: '/ppx',
            component: ppx,
            meta: {
                title: '皮皮蟹'
            }
        }, {
            path: '/goodsDetail',
            component: goodsDetail,
            meta: {
                title: '商品详情'
            }
        }, {
            path: '/confirmOrder',
            component: confirmOrder,
            meta: {
                title: '确认订单'
            }
        }, {
            path: '/paySuccess',
            component: paySuccess,
            meta: {
                title: '账号支付支付成功'
            }
        }, {
            path: '/openShop_1',
            component: openShop_1,
            meta: {
                title: '申请店铺完善身份信息'
            }
        }, {
            path: '/openShop_2',
            component: openShop_2,
            meta: {
                title: '申请店铺'
            }
        }, {
            path: '/openShop_3',
            component: openShop_3,
            meta: {
                title: '申请店铺提交成功'
            }
        }, {
            path: '/shopDetail',
            component: shopDetail,
            meta: {
                title: '店铺详情'
            }
        }, {
            path: '/shopInfo',
            component: shopInfo,
            meta: {
                title: '商家保障'
            }
        }, {
            path: '/rent',
            component: rent,
            meta: {
                title: '出租'
            }
        }, {
            path: '/sell',
            component: sell,
            meta: {
                title: '出售'
            }
        }, {
            path: '/sellGift',
            component: sellGift,
            meta: {
                title: '我要出售皮皮蟹礼物'
            }
        }, {
            path: '/login_regis',
            component: Login_Regis,
            children: [{
                    path: 'login',
                    component: Login,
                    meta: {
                        title: "登录"
                    }
                },
                {
                    path: 'register',
                    component: Register,
                    meta: {
                        title: "注册"
                    }
                },
            ],
            redirect: '/login_regis/login',
        }, {
            path: '/forget',
            component: ForgetPass,
            meat: {
                title: '忘记密码1'
            }
        },
        {
            path: '/setpass',
            component: SetPass,
            meta: {
                title: '忘记密码2'
            }
        },
        {
            path: '/buyGift',
            component: buyGift,
            meta: {
                title: '我要求购皮皮蟹礼物'
            }
        },
        {
            path: '/search',
            component: Search,
            meta: {
                title: '搜索'
            }
        },
        {
            path: '/toTop',
            component: toTop,
            meta: {
                title: '置顶'
            }
        },
        {
            path: '/buy_ppxgift',
            component: buy_ppxgift,
            meta: {
                title: '买皮皮蟹礼物'
            }
        },
        {
            path: '/giftSuccess',
            component: giftSuccess,
            meta: {
                title: '购买礼物成功'
            }
        },
        {
            path: '/giftDetail',
            component: giftDetail,
            meta: {
                title: '礼物详情'
            }
        },
        {
            path: '/supply_ppxgift',
            component: supply_ppxgift,
            meta: {
                title: '供应皮皮蟹礼物'
            }
        },
        {
            path: '/giftSelldetail',
            component: giftSelldetail,
            meta: {
                title: '商家查看礼物订单详情'
            }
        },
        {
            path: '/giftOrder',
            component: giftOrder,
            meta: {
                title: '我的礼物订单'
            }
        },
        {
            path: '/idcarde',
            component: idcarde,
            meta: {
                title: '身份证验证'
            }
        },
        {
            path: '/numberSuccess',
            component: numberSuccess,
            meta: {
                title: '账号发布成功待审核'
            }
        },
        {
            path: '/editRent',
            component: editRent,
            meta: {
                title: '编辑出租账号'
            }
        },
        {
            path: '/editSell',
            component: editSell,
            meta: {
                title: '编辑出售账号'
            }
        },
        {
            path: '/editGift',
            component: editGift,
            meta: {
                title: '编辑出售礼物'
            }
        },
    ]
})
router.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    if (isChunkLoadFailed) {
        window.location.reload();

    } else {
        console.log(error)
    }
});

// router.beforeEach((to, from, next) => {
//     var token = global.getToken('mid')
//     if (token) {
//         next()
//     } else {
//         if (to.path == '/login_regis/register') {
//             next()
//         } else if (to.path == '/forget') {
//             next()
//         } else if (to.path == '/setpass') {
//             next()
//         } else if (to.path == '/login_regis/login') {
//             next()
//         } else {
//             next('/login_regis/login')
//         }
//         return;
//     }
// })
export default router