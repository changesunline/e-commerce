$(function () {

    $("#login").on("tap",function () {
        //1、获取form序列化数据
        var data = $(".form_box").serialize();
        var dataObj = LETAO.serializeToObject(data);
        // console.log(dataObj);

        //2、校验
        if (!dataObj.username){
            mui.toast("请输入用户名");
            return false;
        }
        if (!dataObj.password){
            mui.toast("请输入密码");
            return false;
        }
        //3、发送请求
        $.ajax({
            url: '/user/login',
            type: 'post',
            data: dataObj,
            dataType: 'json',
            beforeSend:function(){
                $('.btn_login').html('正在登录...');
            },
            success: function (data) {
                var returnUrl = location.search.replace("?returnUrl=","");
                if (data.success == true){
                    if (returnUrl){
                        location.href = returnUrl;
                    }else{
                        location.href = LETAO.usertUrl;
                    }
                }else{
                    // 业务不成功
                    mui.toast(data.message);
                    return false;
                }

            }
        });
    })
});