/**
 *
 * @authors Wang Yuanyuan
 * @date    2018-10-23
 * @version 1.2
 *
 **/

$(document).ready(function () {

    var startHeight = 150;
    var endHeight = 200;
    var startYear = 1950;
    var endYear = new Date().getFullYear();

    $('#registerBtn').click(function () {
        //step1:校验各字段，只做判空处理
        //姓名、身高、生日、性别选择
        var sexChecked = $('input:radio[name="sex"]:checked').val();
        if ($("#inputName").val() == "" || $('#inputHeight').val() == '' || $('#yearBirth').val() == ''
            || sexChecked == null) {
            $("#alertMsg").text("信息未填写完整").show();
            if ($("#inputName").val() == "") {
                $('#inputName').css('border', '1px red solid');
            }
            if (sexChecked == null) {
                $('.sexLabel').css('color', 'red');
            }
            if ($('#inputHeight').val() == '') {
                $('#inputHeight').css('border', '1px red solid');
            }
            if ($('#yearBirth').val() == '') {
                $('#yearBirth').css('border', '1px red solid');
            }

            return;
        }
        //若全部填写

        else {
            console.log($('#inputName').val());
            console.log(sexChecked);
            console.log($('#inputHeight').val());
            console.log($('#yearBirth').val());
            $('#inputName').css('border', 'none');
            $('.sexLabel').css('color', '#ffffff');
            $('#inputHeight').css('border', 'none');
            $('#yearBirth').css('border', 'none');
            $('#alertMsg').text("请到魔镜设备上录入您的人脸信息").show();
            $('#registerBtn').css({
                'background-color': '#E9E9E9',
                'color': '#999999',
                'border': '1px #E9E9E9 solid'
            });
            $('#registerBtn').attr('disabled', 'disabled');
            $('#registerBtn').text('注册中...');

            //检验通过，执行注册
            register($('#inputName').val(), sexChecked, $('#yearBirth').val(), $('#inputHeight').val());
        }
    });

//出生年份

for (let i = startYear; i <= endYear; i++) {
    // console.log(i);
    $('#yearBirth').append("<option value='" + i + "'>" + i + " 年</option>");
};
$('#yearBirth').click(function () {
    $(this).css({ 'color': '#000000' });

});
//身高

for (let j = startHeight; j <= endHeight; j++) {
    // console.log(j);
    $('#inputHeight').append("<option value='" + j + "'>" + j + " cm</option>");
};
$('#inputHeight').click(function () {
    $(this).css({ 'color': '#000000' })

});
})

function register(name, gender, year, height) {
    $.get('http://localhost:5000/message', data => {
        if (data.status == 100) {
            if (data.out['login'] !== true) {       //若用户没有在登录，不冲突，执行注册逻辑
                //更新消息字典
                $.post('http://localhost:5000/message',
                    {
                        "register": true
                    }
                    , data => {
                        if (data.status == 100) {//更新register=true成功后再执行注册
                            $.post("http://192.168.2.244:5000/register",
                                {
                                    name: name,
                                    gender: gender,
                                    year: year,
                                    height: height
                                }, data => {
                                    //请求成功 
                                    if (data.status == 100) {

                                        $('#alertMsg').text("注册成功！").show();
                                        $('#registerBtn').css({
                                            'background-color': 'transparent',
                                            'color': '#ffffff',
                                            'border': '1px #E9E9E9 solid'
                                        });
                                        $('#registerBtn').text('注册');
                                    }
                                    //请求失败
                                    else {
                                        $('#alertMsg').text("注册失败!请重试!").show();
                                        $('#registerBtn').css({
                                            'background-color': 'transparent',
                                            'color': '#ffffff',
                                            'border': '1px #E9E9E9 solid'
                                        });
                                        $('#registerBtn').text('注册');
                                    }
                                    //还原register=false
                                    $.post("http://localhost:5000/message", { register: false }, res => {
                                        //nothing...
                                    });
                                });
                        }
                    });
            }
            else {//正在登录，冲突=> 1s后再注册 
                setTimeout(() => {
                    register(name, gender, year, height);
                }, 1000);
            }
        }
    });
}