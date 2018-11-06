$(function () {
    //区域滚动
    mui('.mui-scroll-wrapper').scroll({
        scrollY: true, //是否竖向滚动
        scrollX: false, //是否横向滚动
        startX: 0, //初始化时滚动至x
        indicators: true, //是否显示滚动条
        deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
        bounce: true //是否启用回弹
    });
})

window.LETAO = {}
//从地址栏获取关键字的方法
LETAO.getParamsByUrl = function () {
    var params = {};
    var search = location.search;
    if (search) {
        search = search.replace("?","");
        /*如果有多个参数*/
        var arr = search.split("&");
        arr.forEach(function (item,i) {
            var arr1 = item.split("=");
            params[arr1[0]] = arr1[1];
        });
    }
    return params;
}
