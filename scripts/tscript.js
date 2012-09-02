"use strict";

var timeController = {
	
	timerInt: null,
	targetTime: null,
	paused: true,
	hours: 0,
	mins: 0,
	secs: 0,
	
	startCountdown : function() {
		if (this.secs == 0 && this.hours + this.mins == 0) {
			return false;
		}
		this.paused = false;
		this.targetTime = new Date(Date.now() + (((this.hours * 60 + this.mins) * 60 + this.secs) * 1000));
		this.timerInt = window.setInterval(function() {
			timeController.tick(); } , 1000);
		return true;
	},
	
	stopCountdown : function() {
		window.clearInterval(this.timerInt);
		this.targetTime = null;
		this.paused = true;
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
			UIManager.toggleCountdown();
			var alarm = new Audio("../audio/alarm.ogg");
			alarm.play();
		}
		
	} // tick end
};

var UIManager = {
	
	hourOut: document.getElementById("hourDisp"),
	minOut: document.getElementById("minDisp"),
	secOut: document.getElementById("secDisp"),
	buttonToggle: document.getElementById("toggler"),

	formatNum : function(num) {
		if (num >= 10)
			return num.toString();
		return ('0' + num.toString());
	},

	updateOutput: function() {
		this.hourOut.innerHTML = this.formatNum(timeController.hours);
		this.minOut.innerHTML = this.formatNum(timeController.mins);
		this.secOut.innerHTML = this.formatNum(timeController.secs);
	},

	toggleCountdown: function() {
		if (timeController.paused) {
			if (timeController.startCountdown()) {
				this.buttonToggle.value = "Stop Countdown";
			}
		}
		else {
			timeController.stopCountdown();
			this.buttonToggle.value = "Start Countdown";
		}
	},
	
	// function called from clicks on time boxes
	getHours: function() {
		if (!timeController.paused) {
			return;
		}
		var hours = parseInt(prompt("Enter Hours"), 10);
		if (isNaN(hours)) {
			hours = 0;
		}
		timeController.hours = hours;
		this.updateOutput();
	},

	getMinutes: function() {
		if (!timeController.paused) {
			return;
		}
		var minutes = parseInt(prompt("Enter Minutes"), 10);
		if (isNaN(minutes)) {
			minutes = 0;
		}
		timeController.mins = minutes;
		this.updateOutput();
	},

	getSeconds: function() {
		if (!timeController.paused) {
			return;
		}
		var seconds = parseInt(prompt("Enter Seconds"), 10);
		if (isNaN(seconds)) {
			seconds = 0;
		}
		timeController.secs = seconds;
		this.updateOutput();
	},

	resizeTimerFont: function() {
		if(window.innerWidth <= 450) {
			this.hourOut.className = "timeValueSmall"
			this.minOut.className = "timeValueSmall"
			this.secOut.className = "timeValueSmall"
		}
		else {
			this.hourOut.className = "timeValue"
			this.minOut.className = "timeValue"
			this.secOut.className = "timeValue"
		}
	}

};
document.body.onload=function() { UIManager.resizeTimerFont(); };
document.body.onresize=function() { UIManager.resizeTimerFont(); };

