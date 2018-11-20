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

window.LETAO = {};


//序列化转对象
LETAO.serializeToObject = function (serializeStr) {
    var obj = {};
    if (serializeStr) {
        var arr = serializeStr.split("&");
        arr.forEach(function (item, i) {
            var itemArr = item.split("=");
            obj[itemArr[0]] = itemArr[1];
        });
    }
    return obj;
}

//获取元素id
LETAO.getItemById = function (arr,id) {
    var itemobj = null;
    arr.forEach(function (item,i) {
        if (item.id == id){
            itemobj = item;
        }
    });
    return itemobj;
}

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
//登陆ajax
LETAO.loginUrl = "/mobile-m/user/login.html";
LETAO.cartUrl = "/mobile-m/user/cart.html";
LETAO.usertUrl = "/mobile-m/user/index.html";
LETAO.loginAjax = function (params) {
    $.ajax({
        url: params.url || '#',
        type: params.type || 'get',
        data: params.data || '',
        dataType: params.dataType || 'json',
        beforeSend:function(){
            params.beforeSend && params.beforeSend();
        },
        success: function (data) {
            //未登录处理
            if (data.error == 400){
                //调转到登陆页面
                location.href = LETAO.loginUrl + "?returnUrl=" + location.href;
                return false;
            }else{
                params.success && params.success(data);
            }
        },
        error: function () {
            mui.toast("系统繁忙");
        }
    });
}

