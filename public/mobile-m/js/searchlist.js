$(function () {

     // 初始化渲染
     // 1.获取地址栏关键字
     // 2.通过关键字去后台获取和关键字相关的商品数据
     // 3.渲染商品列表
    var params = LETAO.getParamsByUrl();
    var $input = $("input").val(params.key || "");
    // 渲染商品列表
    // getSearchData({
    //     proName: params.key,
    //     page: 1,
    //     pageSize: 6,
    // },function (data) {
    //     // console.log(data);
    //     $(".le_live").html(template("product",data));
    // });
    
     // 当前页搜索
     // 1.点击搜索按钮 获取到关键字
     // 2.通过关键字去后台获取和关键字相关的商品数据
     // 3.渲染商品列表
    $(".le_search a").on("tap",function () {
        var key = $.trim($input.val());
        if (!key){
            mui.toast("请输入关键字");
            return false;
        }
        getSearchData({
            proName: key,
            page: 1,
            pageSize: 4,
        },function (data) {
            $(".le_live").html(template("product",data));
        });
    });

     // 排序展示
     // 1.点击排序按钮 获取排序方式
     // 2.通过当前的关键字和排序方式去后台获取相关的商品数据
     // 3.渲染商品列表
    $(".le_order a").on("tap",function () {
        //排序栏样式改变
        var $this = $(this);
        if (!$this.hasClass("now")){
            $this.addClass("now").siblings().removeClass("now")
                .find("span").removeClass("fa-angle-up").addClass("fa-angle-down");
        } else {
            if ($this.find("span").hasClass("fa-angle-down")){
                $this.find("span").removeClass("fa-angle-down").addClass("fa-angle-up");
            } else {
                $this.find("span").removeClass("fa-angle-up").addClass("fa-angle-down");
            }
        }
        //数据改变
        var order = $this.attr("data-type");
        var orderVal = $this.find("span").hasClass("fa-angle-down") ? 1 : 2;
        var key = $.trim($input.val());
        if (!key){
            mui.toast("请输入关键字");
            return false;
        }
        var params = {
            proName: key,
            page: 1,
            pageSize: 4,
        }
        params[order] = orderVal;
        getSearchData(params,function (data) {
            $(".le_live").html(template("product",data));
        });

    });

     // 下拉刷新
     // 1.当用户下拉页面
     // 2.通过关键字去后台重新获取和关键字相关的商品数据
     // 3.渲染商品列表
    mui.init({
        pullRefresh : {
            container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down : {
                auto: true,
                callback:pulldownRefresh
            },
            up : {
                contentnomore:'没有更多数据了',
                callback:pullupRefresh
            }
        }
    });
    //下拉刷新，商品排序恢复默认，排序栏样式恢复默认
    function pulldownRefresh(){
        $(".le_order a").removeClass("now").find("span").removeClass("fa-angle-up").addClass("fa-angle-down");
        setTimeout(function() {
            var key = $.trim($input.val());
            getSearchData({
                proName: key,
                page: 1,
                pageSize: 4,
            },function (data) {
                $(".le_live").html(template("product",data));
                mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                mui('#refreshContainer').pullRefresh().refresh(true); //重置上拉刷新
            });
        }, 1000);
    }
    //上拉刷新
    function pullupRefresh() {
        setTimeout(function() {
            var order = $(".le_order a.now").attr("data-type");
            var orderVal = $(".le_order a.now").find("span").hasClass("fa-angle-down") ? 1 : 2;
            var key = $.trim($input.val());
            window.page++;
            var params = {
                proName: key,
                page: window.page,
                pageSize: 4,
            }
            params[order] = orderVal;
            getSearchData(params,function (data) {
                $(".le_live").append(template("product",data));
                var len = data.data.length;
                console.log(len);
                mui('#refreshContainer').pullRefresh().endPullupToRefresh(len==0);
            });
        }, 1000);

    }




     // 上拉加载
     // 1.当用户上拉页面
     // 2.通过关键字去后台获取和关键字相关的商品数据（而且是根据当前页面进行获取）
     // 3.渲染商品列表 当时是追加到页面当中
});



var getSearchData = function (params,callback) {
    $.ajax({
        url: '/product/queryProduct',
        type: 'get',
        data: params,
        dataType: 'json',
        success: function (data) {
            window.page = data.page;
            callback && callback(data);
        }
    });
}