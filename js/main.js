/**
 *
 * @authors Wang Ping
 * @date    2018-10-23
 * @version 1.5
 *
 **/
let S_ID;

function fetchDateTime() {
	//渲染日期+时间
	let ch_weekday = ['日', '一', '二', '三', '四', '五', '六'];

	let now = new Date();
	let hr = now.getHours();
	hr = hr < 10 ? "0" + hr : hr;
	let min = now.getMinutes();
	min = min < 10 ? "0" + min : min;
	let time = hr + " : " + min;
	$('#time').text(time);

	let year = now.getFullYear();
	let month = now.getMonth() + 1;
	let day = now.getDate();
	let weekday = now.getDay();
	$('#date').text(year + "-" + month + "-" + day + " 周" + ch_weekday[weekday]);

}

function fetchWeather() {
	//渲染天气+地区

	//指定杭州市
	$("#city").text("杭州市");

	//plan B： 用百度的接口定位
	//let bd_KEY = 'c2niE7ExcK2izOZ0RWHxShaVVCuPzXvx';
	// let city = '';
	// $.get("https://api.map.baidu.com/location/ip?ak="+bd_KEY,function(res){
	//     city = res.content.address_detail.city;
	//     $("#city").text(city);
	//});


	//温度
	$.get("http://localhost:5000/temperature", data => {
		if (data.status == 100) {
			$("#city-temporary").text(data.out + "℃");
			//根据温度=>出行建议
			$.get("http://localhost:5000/traveladvice?t=" + data.out, res => {
				if (res.status == 100) {
					$("#sug-text").text(res.out);
				}
			});
		}
	});

	//湿度
	$.get("http://localhost:5000/humidity", data => {
		if (data.status == 100) {
			$("#wea-hum").text(data.out);
		}
	});
	//天气描述
	$.get("http://localhost:5000/weather", data => {
		if (data.status == 100) {
			//示例data.out=["阴","d02"]

			//获取编码，映射图标??????
			//$("#wea-icon").attr('src',"../res/weather-icon/"+data.out[1]+".png");

			//获取描述文字
			$("#wea-txt").text(data.out[0]);
		}
	});

	//风力
	$.get("http://localhost:5000/wind", data => {
		if (status == 100) {
			$("#wea-wind").text(data.out);
		}
	});

	//pm2.5
	$.get("http://localhost:5000/pm25", data => {
		if (data.status == 100) {
			$("#wea-pm").text(data.out);
		}
	});
}

function scanning() {
	//扫描人脸
	$.get("http://localhost:5000/login", res => {
		if (res.status == 100) {
			if (res.out !== "unknown") {
				current_user = res.out[0];
				//clearInterval(S_ID);
				if(S_ID) clearTimeout(S_ID);

				//登录
				login(current_user);
			} else {
				//未知用户
				$("#greeting").html('新用户您好，请扫码进行注册<img src="../res/regrcode.png" alt="" >');
			}
		} else if (res.status == 301) {
			//err:没有检测到人脸
			//10s后再扫描一次
			S_ID = setTimeout(function () {
				scanning();
			}, 1000 * 10);
		} else {
			//unknow err
			//10s后再扫描一次
			S_ID = setTimeout(function () {
				scanning();
			}, 1000 * 10);
		}
	});

}

function login(current_user) {

	//改变greeting
	$("#greeting").text(current_user + " 你好:)");
	//隐藏扫描特效
	$("#scanning").css('visibility', 'hidden');

	$("#body-info").show();

	getHeartrate();
	getWeight();
}

function Logout() {

}

function resetBand() {
	$.get("http://localhost:5000/util/reset", res => {
		if (res.status == 100) {
			//reset success
			$.get("http://localhost:5000/util/initband", res => {

			});
		}
		else {
			resetBand();
		}
	});

}

function getHeartrate() {
	$.get("http://localhost:5000/heartrate", res => {
		if (res.status == 100) {
			$("#heartrate").text(res.out);
		} else if (res.status == 206) {
			//error => reset
			resetBand();
		}
	});
}

function getWeight() {
	$.get("http://localhost:5000/weight", res => {
		if (res.status == 100) {
			$("#weight").text(res.out);
		} else {
			getWeight();
		}
	});
}

function fetchContent() {
	fetchWeather();
	//每小时更新天气
	W_ID = setInterval(() => {
		fetchWeather();
	}, 1000 * 60 * 60);


	fetchDateTime();
	//每分钟更新时间
	D_ID = setInterval(() => {
		fetchDateTime();
	}, 1000 * 60);
}

fetchContent();
scanning();
//每10s检测人脸
// S_ID = setInterval(() => {
//	  scanning();
// 	}, 1000*10);