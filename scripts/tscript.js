"use strict";

var timeController = {
	
	timerInt: null,
	targetTime: null,
	
	startCountdown : function() {
		var regResults = /\?tc=(\d+)-(\d+)-(\d+)/.exec(window.location.href);
		if (regResults == null) {
			hours = 0;
			mins = 15;
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
	},
	
	formatNum : function(num) {
		if (num >= 10)
			return num.toString();
		return ('0' + num.toString());
	},
	
	tick : function() {
		var currentTime = new Date();
		var diffTime = new Date(this.targetTime.getTime() - currentTime.getTime());
		document.getElementById("hourBox").innerHTML = this.formatNum(diffTime.getUTCHours());
		document.getElementById("minBox").innerHTML = this.formatNum(diffTime.getUTCMinutes());
		document.getElementById("secBox").innerHTML = this.formatNum(diffTime.getUTCSeconds());
		
		if (diffTime.getTime() <= 0) {
			window.clearInterval(this.timerInt);
		}
		
	} // tick end
};
timeController.startCountdown();
timeController.timerInt = window.setInterval("timeController.tick()", 450);

