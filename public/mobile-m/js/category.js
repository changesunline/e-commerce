$(function () {
    //一级分类可滚动
    new BScroll('.cate_sibar').scrollTo(0, 0, 100, 'bounce');

    // 1、默认一级分类加载二级分类动态数据
    var url1 = '/category/queryTopCategory';
    var url2 = '/category/querySecondCategory';
    // 加载一级分类动态数据
    getCategoryData(url1,"",function (data) {
      //   console.log(data);
        $(".firstTemp").html(template("firstTemp",data));
        initFirst();
        // 加载二级分类动态数据
        var categoryId = $(".firstTemp").find("li").attr("data-id");
        secondData(url2,categoryId);
    });
    //  2、点击一级分类加载对应二级分类动态数据
    var initFirst = function () {
        $(".firstTemp li").on("tap",function () {
            //当前选中就不再去加载
            if ($(this).hasClass("now")) return false;
            //被选中的一级分类改变样式
            $(".firstTemp li").removeClass("now");
            $(this).addClass("now");
            //对应的二级分类显示数据
            secondData(url2,$(this).attr("data-id"));
        });
    }
})

//调用接口获取数据
var getCategoryData = function (url,param,callback) {
    $.ajax({
        url: url,
        type: 'GET',
        data: param,
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    });
}
//加载二级分类数据
var secondData = function (url,param) {
    getCategoryData(url,{
        id: param
    },function (data) {
        $(".secondTemp").html(template("secondTemp",data));
    });
}

