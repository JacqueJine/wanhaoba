// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { Button } from 'vant'
import { Tabbar, TabbarItem } from 'vant'
import { Icon } from 'vant'
import { Tab, Tabs } from 'vant'
import { Search } from 'vant';
import { Image } from 'vant';
import { Grid, GridItem } from 'vant';
import { Lazyload } from 'vant';
import { Row, Col } from 'vant';
import { Card } from 'vant';
import { Tag } from 'vant';
import { IndexBar, IndexAnchor } from 'vant';
import { NavBar } from 'vant';
import { Cell, CellGroup } from 'vant';
import { Panel } from 'vant';
import { DropdownMenu, DropdownItem } from 'vant';
import { Swipe, SwipeItem } from 'vant';
import {
    GoodsAction,
    GoodsActionIcon,
    GoodsActionButton
} from 'vant';
import { SubmitBar } from 'vant';
import { Stepper } from 'vant';
import { Dialog } from 'vant';
import { RadioGroup, Radio } from 'vant';
import { Popup } from 'vant';
import { Checkbox, CheckboxGroup } from 'vant';
import { DatetimePicker } from 'vant';
import { Field } from 'vant';
import { Uploader } from 'vant';
import { Sticky } from 'vant';
import { Picker } from 'vant';
import { SwitchCell } from 'vant';
import { PasswordInput, NumberKeyboard } from 'vant';
import { CountDown } from 'vant';
import { Notify } from 'vant';
import { List } from 'vant';
import { Toast } from 'vant';
import { Loading } from 'vant';
import { Upload } from 'element-ui';
import { ImagePreview } from 'vant';
import { PullRefresh } from 'vant';
import { ActionSheet } from 'vant';

Vue.use(ActionSheet);
Vue.use(PullRefresh);
Vue.use(ImagePreview);
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Upload);
Vue.use(Loading);
Vue.use(Toast);
Vue.use(List);
Vue.use(Notify);
import axios from 'axios';
import qs from 'qs';
import global from './utils/auth'
Vue.prototype.$global = global;
Vue.prototype.$qs = qs;
Vue.prototype.$axios = axios;

Vue.use(CountDown);
Vue.use(PasswordInput).use(NumberKeyboard);
Vue.use(SwitchCell);
Vue.use(Picker);
Vue.use(Sticky);
Vue.use(Uploader);
Vue.use(Field);

Vue.use(DatetimePicker);

Vue.use(Checkbox).use(CheckboxGroup);
Vue.use(Popup);
Vue.use(RadioGroup);
Vue.use(Radio);
// 全局注册
Vue.use(Dialog);
Vue.use(Stepper);
Vue.use(SubmitBar);
Vue
    .use(GoodsAction)
    .use(GoodsActionIcon)
    .use(GoodsActionButton)
Vue.use(Swipe).use(SwipeItem);
Vue.use(DropdownMenu).use(DropdownItem);
Vue.use(Panel);
Vue.use(Cell).use(CellGroup);
Vue.use(NavBar);
Vue.use(IndexBar).use(IndexAnchor);
Vue.use(Tag);
Vue.use(Card);
Vue.use(Row).use(Col);
// options 为可选参数，无则不传
Vue.use(Lazyload);
Vue.use(Grid).use(GridItem);
Vue.use(Image);
Vue.use(Search);
Vue.use(Tab).use(Tabs)
Vue.use(Icon)
Vue.use(Tabbar).use(TabbarItem)
Vue.use(Button)
Vue.config.productionTip = false

//字体适配
import './../static/js/Fonts';
/* eslint-disable no-new */

new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})