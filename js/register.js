/**
 *
 * @authors Wang Yuanyuan
 * @date    2018-10-23
 * @version 1.1
 *
 **/

$(document).ready(function () {
    /*$('#birthYear').datetimepicker({
        startView: 'decade',
        minView: 'decade',
        format: 'yyyy',
        weekStart: 1,
        autoclose: true,
        todayBtn: true
    });*/


    $('#registerBtn').click(function () {
        //step1:校验各字段，只做判空处理
        //姓名、身高、生日、性别选择
        var sexChecked=$('input:radio[name="sex"]:checked').val();
        if($("#inputName").val()==""||$('#inputHeight').val()==''||$('#yearBirth').val()==''
            ||sexChecked==null){
            $("#alertMsg").text("信息未填写完整！").show();
            $('#alertMsg').css({
                'font-weight':"bold",
                'font-size':'20px'
            });
            if($("#inputName").val()==""){
                $('#inputName').css('border','1px red solid');
            }
            if(sexChecked==null){
                $('.sexLabel').css('color','red');
            }
            if($('#inputHeight').val()==''){
                $('#inputHeight').css('border','1px red solid');
            }
            if($('#yearBirth').val()==''){
                $('#yearBirth').css('border','1px red solid');
            }

            return;
        }


            //性别


            //出生年份


        //身高

        //校验通过后，向后端发送post请求 $.post
        

       else{
            $('#inputName').css('border','none');
            $('.sexLabel').css('color','#ffffff');
            $('#inputHeight').css('border','none');
            $('#yearBirth').css('border','none');
            $('#alertMsg').text("请到魔镜设备上录入您的人脸信息").show();
            $('#registerBtn').css({
                'background-color': '#E9E9E9',
                'color': '#C7C4C4',
                'font-size':"17px",
                'border': '1px #E9E9E9 solid'
            });
            $('#registerBtn').text('注册中...');

            $.post()
        }


    });
    //出生年份
    var startYear = 1950;
    var endYear = new Date().getFullYear();
    for (let i = startYear; i <= endYear; i++) {
       // console.log(i);
        $('#yearBirth').append("<option value='" + i + "'>" + i + " 年</option>");
    };
    $('#yearBirth').click(function () {
        $(this).css({ 'color': '#000000' });

    });
    //身高
    var startHeight = 150;
    var endHeight = 200;
    for (let j = startHeight; j <= endHeight; j++) {
       // console.log(j);
        $('#inputHeight').append("<option value='" + j + "'>" + j + " cm</option>");
    };
    $('#inputHeight').click(function () {
        $(this).css({ 'color': '#000000' });

    });
})