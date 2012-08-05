"use strict";

var timeController = {
	
	timerInt: null,
	targetTime: null,
	
	startCountdown : function() {
		var hours = parseInt(document.getElementById("hourSelect").value);
		var mins = parseInt(document.getElementById("minSelect").value);
		var secs = parseInt(document.getElementById("secSelect").value);
		document.getElementById("hourDisp").innerHTML = this.formatNum(hours);
		document.getElementById("minDisp").innerHTML = this.formatNum(mins);
		document.getElementById("secDisp").innerHTML = this.formatNum(secs);
		this.targetTime = new Date(Date.now() + (((hours * 60 + mins) * 60 + secs) * 1000));
		this.timerInt = window.setInterval(function() {
			timeController.tick(); } , 450);
	},
	
	stopCountdown : function() {
		document.getElementById("hourSelect").value = document.getElementById("hourDisp").innerHTML;
		document.getElementById("minSelect").value = document.getElementById("minDisp").innerHTML;
		document.getElementById("secSelect").value = document.getElementById("secDisp").innerHTML;
		this.targetTime = null;
		window.clearInterval(this.timerInt);
	},
	
	formatNum : function(num) {
		if (num >= 10)
			return num.toString();
		return ('0' + num.toString());
	},
	
	tick : function() {
		var currentTime = new Date();
		var diffTime = new Date(this.targetTime.getTime() - currentTime.getTime());
		document.getElementById("hourDisp").innerHTML = this.formatNum(diffTime.getUTCHours());
		document.getElementById("minDisp").innerHTML = this.formatNum(diffTime.getUTCMinutes());
		document.getElementById("secDisp").innerHTML = this.formatNum(diffTime.getUTCSeconds());
		
		if (diffTime.getTime() < 1000) {
			window.clearInterval(this.timerInt);
			var alarm = new Audio("../audio/alarm.ogg");
			alarm.play();
		}
		
	} // tick end
};

var UIManager = {
	
	visible: 's', // 's' - select, 'd' - display
	timeSelect: document.getElementById("selectTime"),
	timeDisplay: document.getElementById("dispTime"),
	buttonToggle: document.getElementById("toggler"),
	
	toggleCountdown : function() {
		if (this.visible == 's') {
			this.timeSelect.style.display = "none";
			this.timeDisplay.style.display = "block";
			this.buttonToggle.value = "Stop Countdown";
			this.visible = 'd';
			timeController.startCountdown();
		}
		else {
			this.timeSelect.style.display = "block";
			this.timeDisplay.style.display = "none";
			this.buttonToggle.value = "Start Countdown";
			this.visible = 's';
			timeController.stopCountdown();
		}
	}
	
};

