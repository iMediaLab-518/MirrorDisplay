/**
 *
 * @authors Wang Yuanyuan
 * @date    2018-10-28
 * @version 1.4
 *
 **/


$(document).ready(function () {
    var video = document.getElementById('videoContent');
    var video1 = $('#videoContent');
    var maxDuration;
    //var level=null;
    var level = $('#level');
    var MH1 = null;  //运动最大心率
    var MH2 = null;    //热身最大心率
    var ID;
    var H1_ID; //id for 正式运动时获取心率的定时器
    var H2_ID;//id for 热身时获取心率的定时器


    //热身最大心率
    $.get('http://localhost:5000/data/MH2', data => {
        if (data.status == 100) {
            MH2 = data.out;
        }
    });

    //运动最大心率
    $.get('http://localhost:5000/data/MH1', data => {
        if (data.status == 100) {
            MH1 = data.out;
        }
    });
    //载入热身视频

    $.get("http://localhost:5000/sport/warmup", data => {
        if (data.status == 100) {
            video1.append("<source src='../res/video/" + data.out[1] + "' type='video/mp4'>");
            level.val(data.out[2]);
            maxDuration = data.out[4];
            console.log(level.val());
            console.log(maxDuration);

            video.addEventListener('ended', function () {  //判断热身视频是否结束
                video1.empty();
                $('#sign').text("运动等级:" + data.out[2] + "," + "运动强度:" + data.out[3]).show();
                setTimeout(function () {
                    $('#sign').text("").hide();
                }, 10000);
                $.get("http://localhost:5000/sport/start", data => {      //载入运动视频
                    if (data.status == 100) {
                        video1.append("<source src='../res/video/" + data.out[1] + "' type=video/mp4>");
                        level.val(data.out[2]);
                        maxDuration = data.out[4];
                    }
                });
            });
        }


    });
    //判断心率
    if (level.val() == 0) {
        //载入心率 3s刷新一次
        H2_ID = setInterval(function () {
            getHeartrate(MH2);
        }, 3 * 1000);
    }
    else {
        //清除热身时候的定时器
        clearInterval(H2_ID);

        //载入心率 3s刷新一次
        H1_ID = setInterval(function () {
            getHeartrate(MH1);
        }, 3 * 1000);
    }

    //判断等级
    //level=0,热身
    if (level.val() != 0) {
        level.text("").hide();
    }

    //level=1
    if (level.val() == 1) {
        if (video.pause) {
            level.css('background-image', '../res/1-start-w.png');
        } else {
            level.css('background-image', '../res/1-start.png');
        }

    }
    //level=2
    if (level.val() == 2) {
        if (video.pause) {
            level.css('background-image', '../res/2-start-w.png');
        }
        else {
            level.css('background-image', '../res/2-start.png');
        }

    }
    //level=3
    if (level.val() == 3) {

        if (video.pause) {
            level.css('background-image', '../res/3-start-w.png');
        }
        else {
            level.css('background-image', '../res/3-start.png');
        }

    }
    //level=4
    if (level.val() == 4) {
        if (video.pause) {
            level.css('background-image', '../res/4-start-w.png');
        } else {
            level.css('background-image', '../res/4-start.png');
        }

    }
    //level=5
    if (level.val() == 5) {
        if (video.pause) {
            level.css('background-image', '../res/5-start-w.png');
        } else {
            level.css('background-image', '../res/5-start.png');
        }

    }




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
    });
    //进度条
    video1.on('timeupdate', function () {

        maxDuration = video.duration;
        var nowTime = video.currentTime;
        //console.log(nowTime);
        //console.log(maxDuration);
        var current = ($('#timeBar').width() / maxDuration) * nowTime;

        $('#currentBar').css({
            'width': current + "px",


        }
        );
        if (video.paused) {
            $('#currentBar').css(
                {
                    'background-color': "rgb(" + 255 + "," + 255 + "," + 255 + ")"
                }
            )
        }
        else {
            $('#currentBar').css('background-color', "rgb(" + 255 + "," + 177 + "," + 39 + ")");
        }
        //console.log(current);

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

/**
 * @author wp
 * @param {*} limit MH1/MH2
 */
function getHeartrate(limit) {
    $.get('http://localhost:5000/heartrate', data => {
        if (data.status == 100) {
            $('#heartCount').text(data.out);
            if (data.out >= limit) {                     //判断心率 提示信息
                $('#sign').text("当前心率已超过安全范围，适当放慢运动节奏！").show();
                $('#sign').css(
                    {
                        'color': 'red',
                        // 'font-size' :''
                    }
                );
            }
            else {
                $('#sign').css(
                    {
                        'color': 'whtie',
                        // 'font-size' :''
                    }
                );
                $('#sign').text("再坚持一下，燃烧你的卡路里，冲鸭！").show();
            }
        }
    });
}