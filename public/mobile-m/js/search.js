$(function () {
    //搜索按钮点击事件
    $(".le_search a").on("tap",function () {
        var key = $.trim($("input").val());
        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }
        window.location.href = "searchlist.html?key=" + key;
    })
})