$(function () {
    getUserIndexData(function (data) {
        $(".usermessage").html(template("usermessage",data));
    });

    $(".btn_outLogin").on("tap",function () {
        getLoginOutData(function (data) {
            if(data.success == true){
                location.href = LETAO.loginUrl;
            }
        })
    })
})
//获取用户信息
var getUserIndexData = function (callback) {
    LETAO.loginAjax({
        url:'/user/queryUserMessage',
        type:'get',
        data:'',
        dataType:'json',
        beforeSend:function(){
            $('.btn_login').html('正在退出...');
        },
        success:function(data){
            callback && callback(data);
        }
    });
}
//退出登录
var getLoginOutData = function (callback) {
    LETAO.loginAjax({
        url: '/user/logout',
        type: 'get',
        data: '',
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    })
}