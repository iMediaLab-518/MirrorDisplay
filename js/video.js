/**
 *
 * @authors Wang Yuanyuan
 * @date    2018-10-26
 * @version 1.0
 *
 **/


$(document).ready(function () {
var video=document.getElementById('videoContent');
var video1=$('#videoContent');

//计时
    video1.on('timeupdate',function(){
        var s=parseInt(video.currentTime);   //秒
        var m=0;                         //分
        if (s > 60) {
            m = parseInt(s / 60);
            s = parseInt(s % 60);

        }
    s=s<10?"0"+s:s;
        m=m<10?"0"+m:m;

        $('#timePass').text(m+":"+s);
        //console.log(video.currentTime)
    });
//进度条
    video1.on('timeupdate',function(){
        var r=255;
        var g=118;
        var b=39;
        var currentColor;
       var nowTime=video.currentTime;
       var maxDuration=video.duration;
        //console.log(nowTime);
        //console.log(maxDuration);
       // console.log($('#timeBar').width);
        var current=($('#timeBar').width()/maxDuration)*nowTime;
        currentColor=g+(60/maxDuration)*nowTime;

        $('#currentBar').css(
            {
                'width': current + "px",
                'background-color':"rgb("+r+","+currentColor+","+b+")"
            }
        );
        if(video.paused){
            $('#currentBar').css(
                {
                    'background-color':"rgb("+255+","+255+","+255+")"
                }
            );
            return;
        }
        //console.log(current);

    });

//开始/暂停控制按钮
    $('#playBtn').on('click',function () {
        //开始
    if(video.paused){
        $('#timePass').css('color',"rgb("+255+","+177+","+39+")");
        $('#heartCount').css('color',"#FFAF0A");
        $('#heartPic').css("background-image","url(../res/heart.png)");
        $(this).css("background-image","url(../res/play.png)");
        video.play();

    }
    //暂停
    else{
        $('#timePass').css('color',"rgb("+255+","+255+","+255+")");
        $('#heartCount').css('color',"#ffffff");
        $('#heartPic').css("background-image","url(../res/heart-w.png)");
        $(this).css("background-image","url(../res/pause.png)");
        video.pause();


    }
   // console.log(11111);
    return false;
});

})
