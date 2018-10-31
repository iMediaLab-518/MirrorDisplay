/**
 *
 * @authors Wang Yuanyuan & Wang Ping
 * @date    2018-10-31
 * @version 1.6
 *
 **/
var video;
var video1;//$对象
var maxDuration;//当前视频总时长
//var level=null;
var level;
var MH1 = 999;   //运动最大心率
var MH2 = 999;   //热身最大心率
var H1_ID; //id for 正式运动时获取心率的定时器
var H2_ID;//id for 热身时获取心率的定时器
var sign;

$(document).ready(function () {
    video1 = $('#videoContent');
    video = document.getElementById('videoContent');
    level = $('#level');
    sign=$('#sign');

    //获取热身时最大安全心率
    $.get('http://localhost:5000/data/MH2', data => {
        if (data.status == 100) {
            MH2 = data.out;
        }
    });

    //获取正式运动时最大安全心率
    $.get('http://localhost:5000/data/MH1', data => {
        if (data.status == 100) {
            MH1 = data.out;
        }
    });
    
   
    //载入热身视频
    loadWarmUpVideo();
    
    //计时
    video1.on('timeupdate', function () {
        var s = parseInt(video.currentTime);   //秒
        var m = 0;                         //分
        if (s >= 60) {
            m = parseInt(s / 60);
            s = parseInt(s % 60);
        }
        if (s == 60) {
            console.log(1);
        }
        s = s < 10 ? "0" + s : s;
        m = m < 10 ? "0" + m : m;

        $('#timePass').text(m + ":" + s);
        $('#sportTime').text(m + ":" + s);
        //console.log(video.currentTime)
        //进度条
        maxDuration = video.duration;
        let nowTime = video.currentTime;
        //console.log(nowTime);
        //console.log(maxDuration);
        let current = ($('#timeBar').width() / maxDuration) * nowTime;

        $('#currentBar').css({
            'width': current + "px",
        }
        );
        if (video.paused) {
            $('#currentBar').css(
                    'background-color',"rgb(" + 255 + "," + 255 + "," + 255 + ")")}
        else {
            $('#currentBar').css('background-color', "rgb(" + 255 + "," + 177 + "," + 39 + ")");
        }
    });


    //开始/暂停控制按钮
    $('#playBtn').on('click', function () {
        //开始
        if (video.paused) {
            video1.css('display', 'block');
            $('#videoPlay').css('background-color', '#ffffff');
            level.css('color', "rgb(" + 255 + "," + 177 + "," + 39 + ")");
            $('#pauseAlert').css('display', 'none');
            $('#timePass').css('color', "rgb(" + 255 + "," + 177 + "," + 39 + ")");
            $('#heartCount').css('color', "#FFAF0A");
            $('#heartPic').css("background-image", "url(../res/heart.png)");
            $(this).css("background-image", "url(../res/play.png)");
            video.play();
        }
        //暂停
        else {
            level.css('color', "rgb(" + 255 + "," + 255 + "," + 255 + ")");
            video1.css('display', 'none');
            $('#videoPlay').css('background-color', '#999999');
            $('#pauseAlert').css('display', 'block');
            $('#timePass').css('color', "rgb(" + 255 + "," + 255 + "," + 255 + ")");
            $('#heartCount').css('color', "#ffffff");
            $('#heartPic').css("background-image", "url(../res/heart-w.png)");
            $(this).css("background-image", "url(../res/pause.png)");
            video.pause();
        }
        // console.log(11111);
        return false;
    });
    $('#alertBtn').click(function () {

        if (video.paused) {
            level.css('color', "rgb(" + 255 + "," + 177 + "," + 39 + ")");
            video1.css('display', 'block');
            $('#videoPlay').css('background-color', '#ffffff');
            $('#pauseAlert').css('display', 'none');
            video.play();
            $('#timePass').css('color', "rgb(" + 255 + "," + 177 + "," + 39 + ")");
            $('#heartCount').css('color', "#FFAF0A");
            $('#heartPic').css("background-image", "url(../res/heart.png)");
            $('#playBtn').css("background-image", "url(../res/play.png)");
        }
    });

})





//函数部分
//载入热身视频
function loadWarmUpVideo() {
    $.get("http://localhost:5000/sport/warmup", data => {
        if (data.status == 100) {
            video1.append("<source src='../res/video/" + data.out[1] + "' type='video/mp4'>");
            level.val(data.out[2]);
            maxDuration = data.out[4];
            isSafe(level.val());
            // console.log(level.val());
            // console.log(maxDuration);
video1.addEventListener('ended',onWarmUpEnded());
            //video1.bind("ended", onWarmUpEnded);//绑定事件

        }
    });
}
function onWarmUpEnded() {
    //热身视频播放结束事件的处理函数
    console.log("warm up is done!");
    video1.empty();
    //总时长变为00：00
    sign.html("休息一下，准备接下来的运动！").show();
    $('#timePass').text('00:00');
    $('#currentBar').css({
        'width': "0px",
    });
    console.log(video1);
    //载入运动视频
    loadSportVideo();

    // //解除绑定当前处理事件
    // video1.unbind();

}
function loadSportVideo() {
    //载入运动视频
    $.get("http://localhost:5000/sport/start", data => {
        if (data.status == 100) {
            console.log(data.out[2],data.out[3]);
            level.val(data.out[2]);
            checkLevel();
           //运动等级10s后消失，提示本次运动强度

            sign.text("运动等级:" + data.out[2] + "," + "运动强度:" + data.out[3]).show();
            setTimeout(function(){sign.empty();},10*1000);

            console.log(sign.text());
            //载入视频
            video1.append("<source src='../res/video/" + data.out[1] + "' type='video/mp4'>");
            video.play();
            console.log("sport is playing!");
            
            maxDuration = data.out[4];
    
            console.log(level);
            //10后显示sign
            setTimeout(isSafe(),10*1000);
            video1.bind("ended", $.onSportEnded);
        }
    });
    console.log(level.val());
}

function getHeartrate(limit) {
    //获取心率
    $.get('http://localhost:5000/heartrate', data => {
        if (data.status == 100) {
            $('#heartCount').text(data.out);
            if (data.out >= limit) {                     //判断心率 提示信息
                sign.text("当前心率已超过安全范围，适当放慢运动节奏！").show();
                sign.css('color','red');
            }
            else {
                sign.css('color','white');
                sign.text("再坚持一下，燃烧你的卡路里，冲鸭！").show();
            }
        }
    });
}

//判断视频等级 

function checkLevel(){
    if (level.val() != 0) {
        level.empty();
        level.css('background-image', '../res/' + level.val() + '-start.png');
    //level>1,正式运动
        if (video.pause) {
            level.css('background-image', '../res/' + level.val() + '-start-w.png');
        }
        else {
            level.css('background-image', '../res/' + level.val() + '-start.png');
    
    }
    }
}

//判断心率
function isSafe(arg){
    //定时获取心率，并判断是否安全
    if (arg == 0) {
        getHeartrate(MH2);
        //载入心率 3s刷新一次
        H2_ID = setInterval(function () {
            getHeartrate(MH2);
        }, 3 * 1000);
    }
    else {
        //清除热身时候的定时器
        clearInterval(H2_ID);
        getHeartrate(MH1);
        //载入心率 3s刷新一次
        H1_ID = setInterval(function () {
            getHeartrate(MH1);
        }, 3 * 1000);
    }


}
