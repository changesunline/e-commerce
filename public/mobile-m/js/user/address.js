$(function(){
    mui('.mui-scroll-wrapper').scroll({
        indicators: false, //是否显示滚动条
    });
    /*渲染*/
    getAddressData(function(data){
        window.data = data;
        //data是一个数组，{model:data}变成对象
        $('.mui-scroll').html(template('addressTpl',{model:data}));
    });
    $('body').on('tap','.mui-btn-red',function(){
        deleteAddress($(this).attr('data-id'),function(){
            mui.toast('删除成功！');
            getAddressData(function(data){
                $('.mui-scroll').html(template('addressTpl',{model:data}));
            });
        });
    }).on('tap','.icon_add',function(){
        if(!window.data || window.data.length < 5 ){
            window.location.href = 'addressManage.html';
        }
    });
});
var getAddressData = function(callback){
    LETAO.loginAjax({
        type:'get',
        url:'/address/queryAddress',
        data:{},
        dataType:'json',
        success:function(data){
            callback && callback(data);
        }
    });
};
var deleteAddress = function(id,callback){
    LETAO.loginAjax({
        type:'post',
        url:'/address/deleteAddress',
        data:{id:id},
        dataType:'json',
        success:function(data){
            callback && callback(data);
        }
    });
};