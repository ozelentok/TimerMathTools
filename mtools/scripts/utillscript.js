'use strict';
var MT = {};
MT.mathSolver = {
	// Returns solutions to quadric equation
	solveQuadric: function (a, b, c) {
		var solutions = [];
		var temp;
		if (a == 0) {
			if (b != 0) { // bx + c
				solutions[0] = (-c / b);
			}
		}
		else if (b == 0) { // ax^2 + c
			temp = (-c / a);
			if (temp >= 0) { 
				solutions[0] = Math.sqrt(temp);
				solutions[1] = -solutions[0];
			}
		}
		else if (c == 0) { // ax^2 + bx
			solutions[0] = 0;
			solutions[1] = (-b / a);
		}
		else { // ax^2 + bx + c
			temp = b * b - 4 * a * c;
			if (temp >= 0) {
				temp = Math.sqrt(temp);
				solutions[0] = (-b + temp) / (2 * a);
				if (temp > 0) {
					solutions[1] = (-b - temp) / (2 * a);
				}
			}
		}
		return solutions;
	}, // solveQuadric
	
	
	
	// Returs binomial probability
	calcBinominal: function(p, n, k) {
		// returns binomial coefficient
		// n >= k must!
		function nChooseK(n, k) {
			if (n == 0 || k == 0 || n == k) {
				return 1;
			}
			var chance = 1;
			var i, divider;
			if(k > n - k) {
				i = k + 1;
				divider = n - k;
			}
			else {
				i = n - k;
				divider = k + 1;
			}
			for (; i <= n; i += 1) {
				chance *= i;
			}
			for (; divider >= 1; divider -= 1) {
				chance /= divider;
			}
			return chance;
		}
		return nChooseK(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
	} // calcBinominal
};




MT.passGenerator = {
	
	db: [ 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '0123456789' ],
	
	// Generates a password according to allowed characters
	// lc - lower case
	// uc - upper case
	// num - numeric digits
	generate: function(plen, lc, uc, num) {
		var bank = []; // characters database
		var bankLimits = []; // current number of characters for each type
		var limit;
		var pass = '';
		var chIndex = 0;
		var chType;
		var loc = 0;
		// at least one of the parameters(lc, uc, num) will be true;
		if(lc) {	bank.push(this.db[0]);	}
		if(uc) {	bank.push(this.db[1]);	}
		if(num) {	bank.push(this.db[2]);	}
		// resize maximum amount of every type
		if (plen % bank.length == 0) {
			limit = plen / bank.length;
		}
		else {
			limit = Math.floor(plen / bank.length + 1);
		}
		for (var i = 0; i < bank.length; i += 1) {
			bankLimits[i] = 0;
		}
		while (loc < plen) {
			chType = Math.floor(Math.random()*bank.length);
			if (bankLimits[chType] < limit) {
				chIndex = Math.floor(Math.random()*bank[chType].length);
				pass += bank[chType][chIndex]
				loc += 1
				bankLimits[chType] += 1
			}
		}
		return pass;
	}
};


MT.unitConverter = {

	unitBank: {	'len': { 'm': 1, 'km': 1E3, 'cm': 1E-2, 'mm': 1E-3, 'in': 2.54E-2, 'foot': 0.3048, 'yard': 0.9144, 'mile': 1609}, 
							'area': { 'm2': 1, 'km2': 1E9, 'cm2': 1E-4, 'mm2': 1E-9, 'in2': 6.4516E-4, 'foot2': 0.0929, 'yard2': 0.8361, 'mile2': 2.5888E6},
							'volume': { 'm3': 1, 'km3': 1E27, 'cm3': 1E-8, 'mm3': 1E-27, 'in3': 1.6387E-5, 'foot3': 2.8316E-2, 'yard3': 0.76455, 'mile3': 4.165E9},
							'mass':	{ 'ton':1E3, 'kg': 1, 'g': 1E-3, 'mg': 1E-6, 'oz':28E-3, 'lb': 0.4536},
							'time':	{	'h': 3600, 'min': 60, 'sec': 1},
						},
	
	// unitName - name of the unit to find in unitBank
	// if found, returns the type of the unit
	// else, returns null
	findType: function(unitName) {
		for (var unitType in this.unitBank) {
			for(var unit in this.unitBank[unitType]) {
				if(unit == unitName) {
					return unitType;
				}
			}
		}
		return null;
	},
	
	
	// type - base quantitiy
	// sourceUnit, resultUnit - name of the units
	// sourceValue - numeric value of the sourceUnit
	// returns the value of sourceValue in result unit
	calcOutUnit: function(type, sourceUnit, resultUnit, sourceValue) {
		var resultValue = sourceValue;
		resultValue *= this.unitBank[type][sourceUnit]; // turn value to it's according SI unit
		resultValue /= this.unitBank[type][resultUnit]; // turn value to result unit
		return resultValue;
	}
	
};

// checks if input boxes are vaild
MT.boxValidator = {
	
	checkQuadBoxes: function() {
		var a, b, c;
		a = parseFloat($('#a_quadeq').val());
		b = parseFloat($('#b_quadeq').val());
		c = parseFloat($('#c_quadeq').val());
		if (isNaN(a) || isNaN(b) || isNaN(c)) {
			$('#quadErrorMessage').html('ERROR! Numbers Only!');
			$('#quadResults').html('');
		}
		else {
			$('#quadErrorMessage').html('');
			var results = MT.mathSolver.solveQuadric(a, b, c);
			if(results.length == 2) {
				$('#quadResults').html('Solutions:<br> ' + results[0].toFixed(3) + '<br /> ' + results[1].toFixed(3));
			}
			else if(results.length == 1) {
				$('#quadResults').html('Solution:<br> ' + results[0].toFixed(3));
			}
			else {
				$('#quadResults').html('No Solutions');
			}
		}
	}, // checkQuadBoxes
	
	
	
	checkBinomialBoxes: function() {
		var p, n, k;
		p = parseFloat($('#prob').val());
		n = parseFloat($('#trials').val());
		k = parseFloat($('#successes').val());
		if (isNaN(p) || isNaN(n) || isNaN(k)) {
			$('#bionErrorMessage').html('ERROR! Numbers Only!');
			$('#bionResult').html('');
		}
		else if (n < 0 || k < 0 || k > n || n % 1 != 0 || k % 1 != 0) {
			$('#bionErrorMessage').html('ERROR! Non-Negative Integers Only!(and N \u2265 K)');
			$('#bionResult').html('');
		}
		else {
			$('#bionErrorMessage').html('');
			var result = MT.mathSolver.calcBinominal(p, n, k);
			$('#bionResult').html('Binomial probability: ' + result.toFixed(5));
		}
	}, // checkBinomialBoxes



	checkPassGenBoxes: function() {
		var lowcase, upcase, nums;
		lowcase = $('#lcase').attr('checked');
		upcase = $('#ucase').attr('checked');
		nums = $('#nums').attr('checked');
		if(!lowcase && !upcase && !nums) {
			$('#passGenErrorMessage').html('ERROR! at least one option must be enabled');
			$('#passGenResults').html('');
		}
		else {
			var passLen = parseInt($('#plen').val());
			if(isNaN(passLen) || passLen <= 0) {
				$('#passGenErrorMessage').html('ERROR! Positive Integers Only!');
				$('#passGenResults').html('');
			}
			else {
				var passw = MT.passGenerator.generate(passLen, lowcase, upcase, nums);
				$('#passGenErrorMessage').html('');
				$('#passGenResults').html(passw);
			}
		}
	}, // checkPassGenBoxes
	
	
	
	
	convPattern: /(\d+\.?\d*)\s*(\w+)\s+to\s+(\w+)/,
	
	checkConvertBoxes: function() {
		var text = $('#convText').val();
		var patResult = text.match(this.convPattern);
		if(!patResult) {
			$('#convertErrorMessage').html('ERROR! Incorrect Format');
			$('#convertResults').html('');
		}
		else {
			var number = parseFloat(patResult[1]);
			var fromUnit = patResult[2];
			var toUnit = patResult[3];
			var fromType = MT.unitConverter.findType(fromUnit);
			var toType = MT.unitConverter.findType(toUnit);
			if(!fromType || !toType) {
				$('#convertErrorMessage').html('ERROR! Unsupported Units');
				$('#convertResults').html('');
			}
			else if(fromType != toType) {
				$('#convertErrorMessage').html('ERROR! Units from diffrent base quantities');
				$('#convertResults').html('');
			}
			else {
				var resultVal = MT.unitConverter.calcOutUnit(fromType, fromUnit, toUnit, number);
				$('#convertErrorMessage').html('');
				$('#convertResults').html(resultVal + ' ' + toUnit);
			}
		}
	}
};

$(function() {

	$('#quadButton').bind('click', function (e) {
		e.preventDefault();
		MT.boxValidator.checkQuadBoxes();
	});
	$('#chanceButton').bind('click', function (e) {
		e.preventDefault();
		MT.boxValidator.checkBinomialBoxes();
	});
	$('#passGenButton').bind('click', function (e) {
		e.preventDefault();
		MT.boxValidator.checkPassGenBoxes();
	});
	$('#convertButton').bind('click', function (e) {
		e.preventDefault();
		MT.boxValidator.checkConvertBoxes();
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
