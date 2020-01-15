function getToken(TokenKey) {

    return localStorage.getItem(TokenKey)
}

function setToken(TokenKey, token) {

    return localStorage.setItem(TokenKey, token)
}

function removeToken(TokenKey) {
    return localStorage.setItem(TokenKey, '')
}
const url = 'http://api.wanhaoba.mingshifan.com:80/';
const imgUrl = 'http://api.wanhaoba.mingshifan.com:80';
// const url = 'http://www.wanba.cn:80/';
// const imgUrl = 'http://www.wanba.cn:80';
// 判断消息
let num = 0;
export default {
    url, //URL接口地址
    imgUrl, //图片地址
    getToken,
    setToken,
    removeToken,
    num,
}