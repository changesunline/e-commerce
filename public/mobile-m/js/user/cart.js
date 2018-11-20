$(function () {


    //区域滚动
    mui('.mui-scroll-wrapper').scroll({
        indicators: false
    });

    //1、初始化页面，自动下拉刷新
    mui.init({
        pullRefresh : {
            container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down : {
                auto: true,
                callback:pulldownRefresh
            }
        }
    });
    //下拉刷新
    function pulldownRefresh(){
        setTimeout(function() {
            getCartData({
                page: 1,
                pageSize: 100,
            },function (data) {
                // console.log(data);
                if (!data.length){
                    $("#cart_box").html("<li class='mui-table-view-cell'>您没有商品在购物车</li>")
                }else{
                    $("#cart_box").html(template("product",data));
                }
            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
            });
        }, 1000);
    }
    //2、侧滑点击编辑，弹出对话框选择尺码、数量
    $('#cart_box')
        .on('tap', '.mui-btn-blue',function (event) {
            var elem = this;
            var li = elem.parentNode.parentNode;
            var arr = window.cartData.data;
            var id = $(this).attr("data-id");
            var item = LETAO.getItemById(arr,id);
            // console.log(item);
            var html = template("message",item);
            mui.confirm(html.replace(/\n/g,''), '商品编辑', ['确定','取消'], function(e) {
                var size = $(".btn_size.now").html();
                var num = $(".p_number input").val();
                if (e.index == 0) {
                    LETAO.loginAjax({
                        url: '/cart/updateCart',
                        type: 'post',
                        data: {
                            id: id,
                            size: size,
                            num: num
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data.success == true){
                                //更新数据列表
                                item.size = size;
                                item.num = num;
                                //重新渲染数据
                                $("#cart_box").html(template("product",window.cartData));
                            }
                        }
                    })
                } else {
                    setTimeout(function() {
                        mui.swipeoutClose(li);
                    }, 0);
                }
            });
            //消息框选择必须要在消息框弹出渲染之后执行
            $(".btn_size").off("tap").on("tap",function () {
                $(this).addClass("now").siblings().removeClass("now");
            });
            $(".p_number span").off("tap").on("tap",function () {
                var $input = $(this).siblings("input");
                var currNum = parseInt($input.val());
                var numMax = parseInt($input.attr("data-max"));
                if ($(this).hasClass("minus")){
                    if (currNum==0){
                        return false;
                    }
                    currNum--;
                }else{
                    if (currNum >= numMax){
                        mui.toast("库存不足");
                        return false;
                    }
                    currNum++;
                }
                $input.val(currNum);
            })
        })
    //3、侧滑点击删除，弹出对话框删除
        .on('tap', '.mui-btn-red', function(event) {
            var elem = this;
            var li = elem.parentNode.parentNode;
            var id = $(this).attr("data-id");
            mui.confirm('您是否确认删除该商品？', '温馨提示', ['确认','取消'], function(e) {
                if (e.index == 0) {
                    LETAO.loginAjax({
                        url: '/cart/deleteCart',
                        type: 'get',
                        data: {
                            id: id
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data.success == true){
                                li.parentNode.removeChild(li);
                                setAmount();
                            }
                        }
                    })

                } else {
                    setTimeout(function() {
                        mui.swipeoutClose(li);
                    }, 0);
                }
            });
    })
    //4、点击商品进入产品详情页
    $("#cart_box").on("tap","a.linked",function () {
        var proId = $(this).attr("data-product");
        console.log(proId);
        location.href = "http://localhost:3000/mobile-m/product.html?productId=" + proId;
    })
    //5、点击刷新按钮，刷新
    $(".fa-refresh").on("tap",function () {
        mui("#refreshContainer").pullRefresh().pulldownLoading();
    })
    //5、点击复选框，计算总金额
    $(".mui-table-view").on("change","[type=checkbox]",function () {
        setAmount();
    })

})
//总金额计算
var setAmount = function () {
    var amountAll = 0;
    $("[type=checkbox]:checked").each(function (i,item) {
        var id = $(this).attr("data-id");
        var obj = LETAO.getItemById(window.cartData.data,id);
        var num = obj.num;
        var price = obj.price;
        var amount = num * price;
        amountAll += amount;
    });
    amountAll = Math.floor(amountAll*100)/100;
    $(".cart_order #cartAmount").html(amountAll);
}
//获取购物车数据
var getCartData = function (params,callback) {
    LETAO.loginAjax({
        url: '/cart/queryCartPaging',
        type: 'GET',
        data: params,
        dataType: 'json',
        success: function (data) {
            window.cartData = data;
            // console.log(data);
            callback && callback(data);
        }
    });
}