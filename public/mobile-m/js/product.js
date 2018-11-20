$(function () {
    // console.log(LETAO.getParamsByUrl);
    getProductData(LETAO.getParamsByUrl().productId,function (data) {
        // 清除加载图标
        $(".loading").remove();
        // 导入模板
        $(".mui-scroll").html(template("detail",data));
        console.log(data);
        //初始化轮播图
        mui('.mui-slider').slider({
            interval:3000//自动轮播周期，若为0则不自动播放，默认为0；
        });

        //尺码选择
        $(".btn_size").on("tap",function () {
            $(this).addClass("now").siblings().removeClass("now");
        })
        //数量选择
        $(".p_number span").on("tap",function () {
            var $input = $(this).siblings("input");
            var currNum = parseInt($input.val());
            var numMax = parseInt($input.attr("data-max"));
            if ($(this).hasClass("jian")){
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
        });
        //加入购物车
        $(".btn_addCart").on("tap",function () {
            var that = $(this)[0];
            var $size = $(".btn_size.now");
            if (!$size.length){
                mui.toast("请选择尺码");
                return false;
            }
            var num = parseInt($(".p_number input").val());
            if (num<=0){
                mui.toast("请选择数量");
                return false;
            }

            //提交数据
            LETAO.loginAjax({
                url: '/cart/addCart',
                type: 'POST',
                data: {
                    productId: LETAO.getParamsByUrl().productId,
                    num: num,
                    size: $size.html()
                },
                dataType: 'json',
                success: function (data) {
                    if (data.success == true){
                        mui.confirm('添加成功，是否进入购物车？', '温馨提示', ['是', '否'], function(e) {
                            if (e.index == 0) {
                                location.href = LETAO.cartUrl;
                            } else {
                                return false;
                            }
                        })
                    }
                }
            });
        });
    });
});
//获取产品信息
var getProductData = function (productId,callback) {
    $.ajax({
        url: "/product/queryProductDetail",
        type: "GET",
        data: {
            id: productId
        },
        dataType: "json",
        success: function (data) {
            callback && callback(data);
        }
    });
}
