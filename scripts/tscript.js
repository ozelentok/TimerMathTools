"use strict";

var timeController = {
	
	timerInt: null,
	targetTime: null,
	hours: 0,
	mins: 0,
	secs: 0,
	
	startCountdown : function() {
		this.hours = parseInt(document.getElementById("hourSelect").value);
		this.mins = parseInt(document.getElementById("minSelect").value);
		this.secs = parseInt(document.getElementById("secSelect").value);
		this.targetTime = new Date(Date.now() + (((this.hours * 60 + this.mins) * 60 + this.secs) * 1000));
		this.timerInt = window.setInterval(function() {
			timeController.tick(); } , 1000);
	},
	
	stopCountdown : function() {
		this.targetTime = null;
		window.clearInterval(this.timerInt);
	},
	
	
	tick : function() {
		var currentTime = new Date();
		this.hours = this.targetTime.getUTCHours() - currentTime.getUTCHours();
		this.mins = this.targetTime.getUTCMinutes() - currentTime.getUTCMinutes();
		this.secs = this.targetTime.getUTCSeconds() - currentTime.getUTCSeconds();
		if (this.secs < 0) {
			this.secs += 60;
			this.mins -= 1;
		}
		if (this.mins < 0) {
			this.mins += 60;
			this.hours -= 1;
		}
		if (this.hours < 0) {
			this.hours += 24;
		}
		UIManager.updateOutput();
		if (this.secs == 0 && this.hours + this.mins == 0) {
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

	formatNum : function(num) {
		if (num >= 10)
			return num.toString();
		return ('0' + num.toString());
	},

	updateOutput: function() {
		if (this.visible == 'd') {
			document.getElementById("hourDisp").innerHTML = this.formatNum(timeController.hours);
			document.getElementById("minDisp").innerHTML = this.formatNum(timeController.mins);
			document.getElementById("secDisp").innerHTML = this.formatNum(timeController.secs);
		}
		else {
			document.getElementById("hourSelect").value = this.formatNum(timeController.hours);
			document.getElementById("minSelect").value = this.formatNum(timeController.mins);
			document.getElementById("secSelect").value = this.formatNum(timeController.secs);

		}
	},
	toggleCountdown : function() {
		if (this.visible == 's') {
			timeController.startCountdown();
			this.timeSelect.style.display = "none";
			this.timeDisplay.style.display = "block";
			this.buttonToggle.value = "Stop Countdown";
			this.visible = 'd';
		}
		else {
			timeController.stopCountdown();
			this.timeSelect.style.display = "block";
			this.timeDisplay.style.display = "none";
			this.buttonToggle.value = "Start Countdown";
			this.visible = 's';
		}
		this.updateOutput();
	}
	
};

