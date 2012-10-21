'use strict';
var TM = {};
TM.timeController = {
	
	timerInt: null,
	targetTime: null,
	paused: true,
	hours: 0,
	mins: 0,
	secs: 0,
	alarm: new Audio('audio/alarm.ogg'),
	
	startCountdown : function() {
		if (this.secs == 0 && this.hours + this.mins == 0) {
			return false;
		}
		this.paused = false;
		this.targetTime = new Date(Date.now() + (((this.hours * 60 + this.mins) * 60 + this.secs) * 1000) - 10);
		this.timerInt = window.setInterval(function() {
			TM.timeController.tick(); } , 1000);
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
		TM.UIManager.updateOutput();
		if (this.secs == 0 && this.mins + this.hours == 0 || currentTime >= this.targetTime) {
			window.clearInterval(this.timerInt);
			TM.UIManager.toggleCountdown();
			this.alarm.play();
		}
		
	} // tick end
};

TM.UIManager = {
	
	hourOut: $('#hourDisp'),
	minOut: $('#minDisp'),
	secOut: $('#secDisp'),
	buttonToggle: $('#toggler'),

	formatNum : function(num) {
		if (num >= 10)
			return num.toString();
		return ('0' + num.toString());
	},

	updateOutput: function() {
		this.hourOut.html(this.formatNum(TM.timeController.hours));
		this.minOut.html(this.formatNum(TM.timeController.mins));
		this.secOut.html(this.formatNum(TM.timeController.secs));
	},

	toggleCountdown: function() {
		if (TM.timeController.paused) {
			if (TM.timeController.startCountdown()) {
				this.buttonToggle.html('Stop Countdown');
			}
		}
		else {
			TM.timeController.stopCountdown();
			this.buttonToggle.html('Start Countdown');
		}
	},
	
	// function called from clicks on time boxes
	getHours: function() {
		if (!TM.timeController.paused) {
			return;
		}
		var hours = parseInt(prompt('Enter Hours'), 10);
		if (isNaN(hours) || hours < 0) {
			hours = 0;
		}
		TM.timeController.hours = hours;
		this.updateOutput();
	},

	getMinutes: function() {
		if (!TM.timeController.paused) {
			return;
		}
		var minutes = parseInt(prompt('Enter Minutes'), 10);
		if (isNaN(minutes) || minutes < 0) {
			minutes = 0;
		}
		TM.timeController.mins = minutes;
		this.updateOutput();
	},

	getSeconds: function() {
		if (!TM.timeController.paused) {
			return;
		}
		var seconds = parseInt(prompt('Enter Seconds'), 10);
		if (isNaN(seconds) || seconds < 0) {
			seconds = 0;
		}
		TM.timeController.secs = seconds;
		this.updateOutput();
	},

	// resize font when window width is small
	resizeTimerFont: function() {
		if(window.innerWidth <= 450) {
			this.hourOut.removeClass('timeValue').addClass('timeValueSmall');	
			this.minOut.removeClass('timeValue').addClass('timeValueSmall');	
			this.secOut.removeClass('timeValue').addClass('timeValueSmall');	
		}
		else {
			this.hourOut.removeClass('timeValueSmall').addClass('timeValue');	
			this.minOut.removeClass('timeValueSmall').addClass('timeValue');	
			this.secOut.removeClass('timeValueSmall').addClass('timeValue');	
		}
	},
};
$(function() {
	$('body').ready(function() {
		TM.UIManager.resizeTimerFont();
	});
	$(window).resize(function() {
		TM.UIManager.resizeTimerFont();
	});
	$('#hourDisp').bind('click', function (e) {
		e.preventDefault();
		TM.UIManager.getHours();
	});
	$('#minDisp').bind('click', function (e) {
		e.preventDefault();
		TM.UIManager.getMinutes();
	});
	$('#secDisp').bind('click', function (e) {
		e.preventDefault();
		TM.UIManager.getSeconds();
	});
	$('#toggler').bind('click', function (e) {
		e.preventDefault();
		TM.UIManager.toggleCountdown();
	});
	$('.button').each(function () {
		var self = $(this);
		self.bind('mouseup mouseleave', function () {
			self.removeClass('buttonDown').addClass('buttonUp');	
		});
		self.bind('mousedown', function () {
			self.removeClass('buttonUp').addClass('buttonDown');	
		});
	});
});

