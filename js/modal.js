/**
 *
 * @authors He xi & Wang Ping
 * @date    2018-11-06
 * @version 1.3
 *
 **/

(function ($) {

	//30秒倒计时
	var intDiff = parseInt(10);//倒计时总秒数量
	timer(intDiff);
	function timer(intDiff) {
		window.setInterval(function () {
			var day = 0,
				hour = 0,
				minute = 0,
				second = 0;//时间默认值        
			if (intDiff > 0) {
				day = Math.floor(intDiff / (60 * 60 * 24));
				hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
				minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
				second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
			}
			if (minute <= 9) minute = '0' + minute;
			if (second <= 9) second = '0' + second;
			$('.footer-tip-time').text(second);
			intDiff--;
		}, 1000);
	}
	// 倒计时结束之后自动退出到登陆界面
//	setTimeout(function () {
//		window.location.href = '../page/main.html';
//	}, 30000);

	function fetchContext() { //右下角 日期时间的获取
		let time = moment().format('HH:mm');
		let second = moment().format(':ss');
		let date = moment().format('YYYY-MM-DD');
		let week = moment().format('dddd');
		$('#time-element').text(time);
		$('#second-element').text(second);
		$('#date-element').text(date);
		$('#week-element').text(week);
		//模态框
		switch (week) {
			case 'Monday': week = "周一"; break;
			case 'Tuesday': week = "周二"; break;
			case 'Wednesday': week = "周三"; break;
			case 'Thursday': week = "周四"; break;
			case 'Friday': week = "周五"; break;
			case 'Saturday': week = "周六"; break;
			case 'Sunday': week = "周日"; break;
		}
		$(".week").text(week);
		$(".date").text(date);
	}
	//let fetchTimer1 = window.setInterval(fetchContext, 1000);

	
	//姓名
	function getUserName(){
		$.get("http://localhost:5000/user", data => {
			if (data.status == 100) {
				$(".user-name-item").text(data.out[0]);
			}
		});	
	}
	//身高
	function getUserHeight(){
		$.get("http://localhost:5000/user", data => {
			if (data.status == 100) {
				$(".height-item-value").text(data.out[3]+"cm");
			}
		});	
	}
	//BMI
	function getUserBMI(){
		$.get("http://localhost:5000/data/BMI", data => {
			if (data.status == 100) {
				//保留2位小数
				$(".BMI-value").text(parseInt(data.out*100)/100);
			}
		});		
	}
	//体重
	function getUserWeight(){
		let date = new Date();
		//构造年月日字符串 20181029，作为get的参数
		let date_str = ""+date.getFullYear();//年
		if(date.getMonth()+1<10){
			date_str += "0";
		}
		date_str += (date.getMonth()+1);//月
		if(date.getDate()<10){
			date_str += "0";
		}
		date_str += date.getDate();//日

		$.get("http://localhost:5000/data/weight?text="+date_str, data => {
			if (data.status == 100) {
				$(".weight-item-value").text(data.out+"kg");
			}
		});		
	}
	var calorie = 0.0;
	//获取运动时长
	function getSportsTime() {
		var sportsTime = 0;
		//获取热身运动的时长
		$.get("http://localhost:5000/sport/warmup", data => {
			if (data.status == 100) {
				//单位换成分钟并取整
				sportsTime += parseInt(data.out[4]/60);
//				$("#sports-length-value").text();
			}
		});
		//获取热身运动消耗的卡路里
		calorie += getCalorie();
		console.log("showWarmUpCaloire:",calorie);
		
		//获取正式运动的时长
		$.get("http://localhost:5000/sport/start ", data => {
			if (data.status == 100) {
				//热身时长+正式运动时长
				sportsTime += parseInt(data.out[4]/60); 
				//单位换成分钟并取整
				$("#sports-length-value").text(sportsTime);
			}
		});
		
		//获取正式运动消耗的卡路里
		calorie += getCalorie();
		console.log("showAllCaloire:",calorie);
		//填写卡路里值

	}
		$("#calorie-value").text(calorie);
	
//	获取卡路里
		function getCalorie(){
			$.get("http://localhost:5000/sport/calorie", data => {
				if (data.status == 100) {
//					$("#calorie-value").text(parseInt(data.out*10)/10);
					console.log("getCalorie:",parseInt(data.out*10)/10)
					return (parseInt(data.out*10)/10);
				}
			});	
		}
	//获取最高心率
	function getHighestHeartRate() {
		$.get("http://localhost:5000/data/max_heartrate ", data => {
			if (data.status == 100) {
				$("#Highest-heart-rate-value").text(data.out);
			}
		});
	}
	//获取平均心率
	function getAverageHeartRate() {
		$.get("http://localhost:5000/data/avg_heartrate ", data => {
			if (data.status == 100) {
				//取整
				$("#heart-rate-item-value").text(parseInt(data.out));
			}
		});
	}

	function onSportEnded(){
		//视频结束事件处理函数

		//渲染modal

		//时间获取
		//fetchContext();

		//用户信息的获取
		getUserName();
		getUserHeight();
		getUserBMI();
		getUserWeight();

		//运动时长
		getSportsTime();

		//生理参数的获取
		getHighestHeartRate();
		getAverageHeartRate();
//		getCalorie();

		
		//show
		$('#myModal').modal('show');
	}

	// return {
	// 	onSportEnded:onSportEnded(),
	// };
onSportEnded();
})(jQuery)
