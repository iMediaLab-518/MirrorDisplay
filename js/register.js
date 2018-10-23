$(document).ready(function() {
    /*$('#birthYear').datetimepicker({
        startView: 'decade',
        minView: 'decade',
        format: 'yyyy',
        weekStart: 1,
        autoclose: true,
        todayBtn: true
    });*/
    $('#registerBtn').click(function () {
        $('#alertMsg').show();
        $('#registerBtn').css({
            'background-color':'#E9E9E9',
            'color':'#C7C4C4',
            'border':'1px #E9E9E9 solid'
        });
        $('#registerBtn').text('注册中...');
    });
    var startYear=1950;
    var endYear=new Date().getFullYear();
    for(let i=startYear;i<=endYear;i++){
        console.log(i);
        $('#yearBirth').append("<option value='"+i+"'>"+ i +" 年</option>");
    };
    $('#yearBirth').click(function () {
        $(this).css({'color':'#000000'});

    });
    var startHeight=150;
    var endHeight=200;
    for(let j=startHeight;j<=endHeight;j++){
        console.log(j);
        $('#inputHeight').append("<option value='"+j+"'>"+ j +" cm</option>");
    };
    $('#inputHeight').click(function () {
        $(this).css({'color':'#000000'});

    });
})