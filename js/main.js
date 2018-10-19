/**
 *
 * @authors Wang Ping
 * @date    2018-10-19
 * @version 1.3
 *
**/

function fetchDateTime(){
	let ch_weekday = ['日','一','二','三','四','五','六'];
	
	let now = new Date();
	let hr = now.getHours();
	hr = hr<10?"0"+hr:hr;
	let min = now.getMinutes();
	min = min<10?"0"+min:min;
	let time = hr + " : " + min;
	$('#time').text(time);

    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let weekday = now.getDay();
    $('#date').text(year+"-"+month+"-"+day+" 周"+ch_weekday[weekday]);

}

function fetchWeather(){
	//指定杭州市
	$("#city").text("杭州市");

	//温度
	$.get("http://localhost:5000/temperature",data=>{
		if(data.status==100){
			$("#city-temporary").text(data.out+"℃");
			//根据温度=>出行建议

			$.get("http://localhost:5000/traveladvice?t="+data.out,res=>{
				if(res.status==100){
					//建议可能太长影响显示，需要处理
					$("#sug-text").text(res.out);
				}
			});
		}
	});

	//湿度
	$.get("http://localhost:5000/humidity",data=>{
		if(data.status==100){
			$("#wea-hum").text(data.out);
		}
	});
	//天气描述
	$.get("http://localhost:5000/weather",data=>{
		if(data.status==100){
			//获取编码，映射图标
			//$("#wea-icon").attr('src',"../res/weather-icon/"+??".png");
			$("#wea-txt").text(data.out);
		}
	});

	//风力
	$.get("http://localhost:5000/wind",data=>{
		if(status==100){
			$("#wea-wind").text(data.out);
		}
	});

	//pm2.5
	$.get("http://localhost:5000/pm25",data=>{
		if(data.status==100){
			$("#wea-pm").text(data.out);
		}
	});
}
// function fetchWeather(){
	//百度普通id定位的服务接口
    // let bd_KEY = 'c2niE7ExcK2izOZ0RWHxShaVVCuPzXvx';
    // let city = '';
    // $.get("https://api.map.baidu.com/location/ip?ak="+bd_KEY,function(res){
    //     city = res.content.address_detail.city;
    //     $("#city").text(city);
    //     //删除“市”字
    //     if(city.indexOf("市")!=-1){
    //         city = city.substring(0,city.indexOf("市"));
    //     }
    //     //和风天气
    //     let KEY = '519e0e63ae8e4a7888e44729ec91f0f2';
    //     let API = "https://free-api.heweather.com/s6/weather/hourly"
    //     let LOCATION = city;
    //     let url = API + '?location=' + LOCATION + '&key=' + KEY + '&' + 'lang=en' + '&' + 'unit=m';

    //     $.ajax({
    //         type: 'POST',
    //         async: true,
    //         cache: false,
    //         url: url,
    //         dataType: 'json',
    //         success: (data) => {
    //         	//实况天气
    //             // let weather = data.HeWeather6[0].now;
    //             let weather = data.HeWeather6[0].hourly[1];
    //             //主要指标
    //             $('#wea-txt').text(weather.cond_txt);
    //             $('#city-temporary').text(weather.tmp+"℃");

    //             //次要指标
    //             //风向+风速  "西北风3级"
    //             $("#wea-wind").text(weather.wind_dir+weather.wind_sc+"级");
    //             //降雨概率
    //             $("#wea-rainpop").text(weather.pop);
    //             //图标
    //             let weather_code = weather.cond_code;
    //             $("#weather-icon").attr("src","../res/weather-icon/"+ weather_code +".png");
    //         }
    //     });        
    // },'jsonp');	
// }
function scanning(){
	//扫描人脸
	$.get("http://localhost:5000/login",res=>{
		if(res.status==100){
			if(out!=="unknown"){
				current_user = res.out;
				//清除interval
				clearInterval(S_ID);
				//设置一个新的interval

				//登录
				login(current_user);
			}
			else{
				//未知用户
				$("#greeting").text("新用户，请扫码进行注册");
			}
		}
		else if(res.status==301){
			//没有检测到人脸
		}
	});

}
function login(current_user){
	
	//改变greeting
	$("#greeting").text(current_user+"你好");
	//隐藏扫描特效
	$("#scanning").css('visibility','hidden');

	$("#body-info").show();

	getHeartrate();
	getWeight();
}
function Logout(){

}
function getHeartrate(){
	$.get("http://localhost:5000/heartrate",res=>{
		if(res.status==100){
			$("#heartrate").text(res.out);
		}
	});
}
function getWeight(){
	$.get("http://localhost:5000/weight",res=>{
		if(res.status==100){
			$("#weight").text(res.out);
		}
	});
}
function fetchContent(){
	fetchWeather();
	fetchDateTime();
}

fetchContent();

//定时检测人脸
S_ID = setInterval(() => {
	  scanning();
	}, 10000);
