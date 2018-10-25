/**
 *
 * @authors Wang Yuanyuan
 * @date    2018-10-23
 * @version 1.1
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
        var sexChecked=$('input:radio[name="sex"]:checked').val();
        if($("#inputName").val()==""||$('#inputHeight').val()==''||$('#yearBirth').val()==''
            ||sexChecked==null){
            $("#alertMsg").text("信息未填写完整").show();
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
        //若全部填写

       else{
            // console.log( $('#inputName').val());
            // console.log( $(sexChecked));
            // console.log( $('#inputHeight').val());
            // console.log( $('#yearBirth').val());
            $('#inputName').css('border','none');
            $('.sexLabel').css('color','#ffffff');
            $('#inputHeight').css('border','none');
            $('#yearBirth').css('border','none');
            $('#alertMsg').text("请到魔镜设备上录入您的人脸信息").show();
            $('#registerBtn').css({
                'background-color': '#E9E9E9',
                'color': '#999999',
                'border': '1px #E9E9E9 solid'
            });
            $('#registerBtn').text('注册中...');

            $.post("http://localhost:5000/register",
                {
                    name:$('#inputName').val(),
                    gender:sexChecked,
                    height:$('#inputHeight').val(),
                    year:$('#yearBirth').val()
            },data=> {
                //返回成功
                if(data.status==100){

                    $('#alertMsg').text("注册成功！").show();
                    $('#registerBtn').css({
                        'background-color': 'transparent',
                        'color': '#ffffff',
                        'border': '1px #E9E9E9 solid'
                    });
                    $('#registerBtn').text('注册');


                }



                    });

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