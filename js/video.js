/**
 *
 * @authors Wang Yuanyuan & Wang Ping
 * @date    2018-11-01
 * @version 1.7
 *
 **/
var video;
var video1;//$对象
var maxDuration;//当前视频总时长
var level;
var MH1 = 999;   //运动最大心率
var MH2 = 999;   //热身最大心率
var H1_ID; //id for 正式运动时获取心率的定时器
var H2_ID;//id for 热身时获取心率的定时器
var sign;
var sportsTime=null;
var calorie = null;
$(document).ready(function () {
    video1 = $('#videoContent');
    video = document.getElementById('videoContent');
    level = $('#level');
    sign = $('#sign');


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



        //开始/暂停控制按钮
        $('#playBtn').on('click', function () {
            //开始
            if (video.paused) {
                level.css('background-image', 'url(../res/' + level.val() + '-star.png)');
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
                level.css('background-image', 'url(../res/' + level.val() + '-star-w.png)');
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
                level.css('background-image', 'url(../res/' + level.val() + '-star.png)');
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
                sportsTime+=data.out[4];
                console.log('warm_up is playing!');
                level.val(data.out[2]);
                maxDuration = data.out[4];
                console.log("warm_up val() ", level.val());
                isSafe(level.val());//判断心率是否正常

                //时间、进度条
                video.ontimeupdate=function(){myTimeUpdate(maxDuration)};
                //video1.on('timeupdate', myTimeUpdate());

//video.addEventListener('ended',function(){onWarmUpEnded()});
              //  video1.bind("ended", onWarmUpEnded());//绑定事件


            }
        });
    }

    function onWarmUpEnded() {
        //热身视频播放结束事件的处理函数
        console.log("warm up is done!");
			
        sign.empty();
        video1.empty();
        //总时长变为00：00
        $('#timePass').text('00:00');
        $('#currentBar').css({
            'width': "0px",
        });
        video.currentTime=0;
        console.log(video.currentTime);
        //载入运动视频
        loadSportVideo();

        // //解除绑定当前处理事件
     //   video1.unbind();

    }

    function loadSportVideo() {
        //载入运动视频
        $.get("http://localhost:5000/sport/start", data => {
            if (data.status == 100) {
                level.val(data.out[2]);
                setTimeout(isSafe(level.val()), 10 * 1000);
                // console.log(video1);
               // console.log(data.out[2], data.out[3]);
                //运动等级10s后消失，提示本次运动强度
                $.get("http://localhost:5000/sport/start", data =>{
                    if(data.status==100){
                        sign.empty();
                        sign.text("运动等级：" + data.out[2] + " , " + "运动强度：" + data.out[3]).show();
                        console.log(level.text());
                    }
                })

                // setTimeout(function () {
                //     sign.empty();
                // }, 10 * 1000);

                console.log(sign.text());
                //载入视频
                video1.append("<source src='../res/video/" + data.out[1] + "' type='video/mp4'>");

                //第二个视频的加载和播放
                video.load();
                video.play();
                                sportsTime+=data.out[4];

               console.log(sportsTime);
              //  console.log(data.out[1]);

                checkLevel();
                maxDuration = data.out[4];
                video.ontimeupdate=function(){myTimeUpdate(maxDuration)};
               // video1.on('timeupdate',myTimeUpdate(video.currentTime,maxDuration));
                console.log(level.val());


             //   video1.bind("ended", $.onSportEnded);
            }
        });
 
        //console.log(level.val());
    }

    function getHeartrate(limit) {
        //获取心率
        $.get('http://localhost:5000/heartrate', data => {
            if (data.status == 100) {
                $('#heartCount').text(data.out);
                if (data.out >= limit) {                     //判断心率 提示信息
                    sign.text("当前心率已超过安全范围，适当放慢运动节奏！").show();
                    sign.css('color', 'red');
                }
                else {
                    sign.css('color', 'white');
                    sign.text("再坚持一下，燃烧你的卡路里，冲鸭！").show();
                }
            }
        });
    }

//判断视频等级 

    function checkLevel() {
        if (level.val() != 0) {
            level.empty();
            level.css('background-image', 'url(../res/' + level.val() + '-star.png)');
            //level>1,正式运动
            if (video.paused) {
                level.css('background-image', 'url(../res/' + level.val() + '-star-w.png)');
            }
            else {
                level.css('background-image', 'url(../res/' + level.val() + '-star.png)');
            }
        }
    }

//判断心率
    function isSafe(arg) {
        //定时获取心率，并判断是否安全
        if (arg == 0) {
            getHeartrate(MH2);
            //载入心率 3s刷新一次
            H2_ID = setInterval(function () {
                getHeartrate(MH2);
            }, 3 * 1000);
        }
        else{
            //清除热身时候的定时器
           // clearInterval(H2_ID);
            getHeartrate(MH1);
            //载入心率 3s刷新一次
            H1_ID = setInterval(function () {
                getHeartrate(MH1);
            }, 3 * 1000);
        }


    }

//时间进度条
    function myTimeUpdate(maxDuration) {
var nowTime=video.currentTime;
        var s = parseInt(nowTime);   //秒
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
        //console.log(nowTime);
        //console.log(maxDuration);
        let current = ($('#timeBar').width() / maxDuration) * nowTime;

        $('#currentBar').css({
                'width': current + "px",
            }
        );
        if (video.paused) {
            $('#currentBar').css(
                'background-color', "rgb(" + 255 + "," + 255 + "," + 255 + ")");
        }
        else {
            $('#currentBar').css('background-color', "rgb(" + 255 + "," + 177 + "," + 39 + ")");
        }

        //结束判断
       if (level.val() == 0) {
           if (nowTime >= maxDuration) {
               clearInterval(H2_ID);

                onWarmUpEnded();
            }

        }
        else if(level.val()!=0) {
           if (nowTime >= maxDuration) {
               clearInterval(H1_ID);
               video1.empty();
               video1.css('display', 'none');
               $('#videoPlay').css('background-color', '#999999');
             //  document.writeln("<script type=\"text/javascript\" src=\"../js/modal.js\" ></script>");
				$("#sports-length-value").text(sportsTime/60);			
               loadScript("../js/modal.js");
						
               console.log($("#sports-length-value").text());
             //动态加载部分
           }
       }
console.log("I am playing");
//console.log(video.currentTime);
//console.log(maxDuration);

    }
    function loadScript(url){
   let script=document.createElement('script');
    script.type='text/javascript';
    script.src=url;
    document.body.appendChild(script);
    }

