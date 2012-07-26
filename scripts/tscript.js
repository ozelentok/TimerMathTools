"use strict";

var timeController = {
	
	startCountdown : function() {
		var regResults = /\?tc=(\d+)-(\d+)-(\d+)/.exec(window.location.href);
		if (regResults == null) {
			hours = 0;
			mins = 5;
			secs = 0;
		}
		else {
			var hours = parseInt(regResults[1]);
			var mins = parseInt(regResults[2]);
			var secs = parseInt(regResults[3]);
		}
		if (mins >= 60)
			mins = 0;
		if (secs >= 60)
			secs = 0;
		document.getElementById("hourBox").innerHTML = this.formatNum(hours);
		document.getElementById("minBox").innerHTML = this.formatNum(mins);
		document.getElementById("secBox").innerHTML = this.formatNum(secs);
		this.targetTime = new Date(Date.now() + (((hours * 60 + mins) * 60 + secs) * 1000));
		console.log(new Date());
		console.log(this.targetTime);
	},
	
	formatNum : function(num) {
		if(num >= 10)
			return num.toString();
		return ('0' + num.toString());
	},
	
	tick : function() {
		var currentTime = new Date();
		var diffTime = new Date(this.targetTime.getTime() - currentTime.getTime());
		if(diffTime < 0) {
			diffTime = new Date(0);
			window.clearInterval(timerInt);
		}
		document.getElementById("hourBox").innerHTML = this.formatNum(diffTime.getUTCHours());
		document.getElementById("minBox").innerHTML = this.formatNum(diffTime.getUTCMinutes());
		document.getElementById("secBox").innerHTML = this.formatNum(diffTime.getUTCSeconds());
	}
	
};

timeController.startCountdown();
var timerInt = window.setInterval("timeController.tick()", 400);

