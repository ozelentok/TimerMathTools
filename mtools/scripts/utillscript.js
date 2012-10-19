"use strict";
var mathSolver = {
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




var passGen = {
	
	db: [ "abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "0123456789" ],
	
	// Generates a password according to allowed characters
	// lc - lower case
	// uc - upper case
	// num - numeric digits
	generate: function(plen, lc, uc, num) {
		var bank = []; // characters database
		var bankLimits = []; // current number of characters for each type
		var limit;
		var pass = "";
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


var unitConverter = {

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
		var resultValue = sourceValue
		resultValue *= this.unitBank[type][sourceUnit]; // turn value to it's according SI unit
		resultValue /= this.unitBank[type][resultUnit]; // turn value to result unit
		return resultValue;
	}
	
};

// checks if input boxes are vaild
var boxValidator = {


	checkQuadBoxes: function() {
		var a, b, c;
		a = parseFloat(document.getElementById("a_quadeq").value);
		b = parseFloat(document.getElementById("b_quadeq").value);
		c = parseFloat(document.getElementById("c_quadeq").value);
		if (isNaN(a) || isNaN(b) || isNaN(c)) {
			document.getElementById("quadErrorMessage").innerHTML = "ERROR! Numbers Only!";
			document.getElementById("quadResults").innerHTML = "";
		}
		else {
			document.getElementById("quadErrorMessage").innerHTML = "";
			var results = mathSolver.solveQuadric(a, b, c);
			if(results.length == 2) {
				document.getElementById("quadResults").innerHTML = "Solutions:<br> " + results[0].toFixed(3) + "<br /> " + results[1].toFixed(3);
			}
			else if(results.length == 1) {
				document.getElementById("quadResults").innerHTML = "Solution:<br> " + results[0].toFixed(3);
			}
			else {
				document.getElementById("quadResults").innerHTML = "No Solutions";
			}
		}
	}, // checkQuadBoxes
	
	
	
	checkBinomialBoxes: function() {
		var p, n, k;
		p = parseFloat(document.getElementById("prob").value);
		n = parseFloat(document.getElementById("trials").value);
		k = parseFloat(document.getElementById("successes").value);
		if (isNaN(p) || isNaN(n) || isNaN(k)) {
			document.getElementById("bionErrorMessage").innerHTML = "ERROR! Numbers Only!";
			document.getElementById("bionResult").innerHTML = "";
		}
		else if (n < 0 || k < 0 || k > n || n % 1 != 0 || k % 1 != 0) {
			document.getElementById("bionErrorMessage").innerHTML = "ERROR! Non-Negative Integers Only!(and N \u2265 K)";
			document.getElementById("bionResult").innerHTML = "";
		}
		else {
			document.getElementById("bionErrorMessage").innerHTML = "";
			var result = mathSolver.calcBinominal(p, n, k);
			document.getElementById("bionResult").innerHTML = "Binomial probability: " + result.toFixed(5);
		}
	}, // checkBinomialBoxes



	checkPassGenBoxes: function() {
		var lowcase, upcase, nums;
		lowcase = document.getElementById("lcase").checked;
		upcase = document.getElementById("ucase").checked;
		nums = document.getElementById("nums").checked;
		if(!lowcase && !upcase && !nums) {
			document.getElementById("passGenErrorMessage").innerHTML = "ERROR! at least one option must be enabled";
			document.getElementById("passGenResults").innerHTML = "";
		}
		else {
			var passLen = parseInt(document.getElementById("plen").value);
			if(isNaN(passLen) || passLen <= 0) {
				document.getElementById("passGenErrorMessage").innerHTML = "ERROR! Positive Integers Only!"
				document.getElementById("passGenResults").innerHTML = "";
			}
			else {
				var passw = passGen.generate(passLen, lowcase, upcase, nums);
				document.getElementById("passGenErrorMessage").innerHTML = "";
				document.getElementById("passGenResults").innerHTML = passw;
			}
		}
	}, // checkPassGenBoxes
	
	
	
	
	convPattern: /(\d+\.?\d*)\s*(\w+)\s+to\s+(\w+)/,
	
	checkConvertBoxes: function() {
		var text = document.getElementById("convText").value;
		var patResult = text.match(this.convPattern);
		if(!patResult) {
			document.getElementById("convertErrorMessage").innerHTML = "ERROR! Incorrect Format";
			document.getElementById("convertResults").innerHTML = "";
		}
		else {
			var number = parseFloat(patResult[1]);
			var fromUnit = patResult[2];
			var toUnit = patResult[3];
			var fromType = unitConverter.findType(fromUnit);
			var toType = unitConverter.findType(toUnit);
			if(!fromType || !toType) {
				document.getElementById("convertErrorMessage").innerHTML = "ERROR! Unsupported Units";
				document.getElementById("convertResults").innerHTML = "";
			}
			else if(fromType != toType) {
				document.getElementById("convertErrorMessage").innerHTML = "ERROR! Units from diffrent base quantities";
				document.getElementById("convertResults").innerHTML = "";
			}
			else {
				document.getElementById("convertErrorMessage").innerHTML = "";
				var resultVal = unitConverter.calcOutUnit(fromType, fromUnit, toUnit, number);
				document.getElementById("convertResults").innerHTML = resultVal + " " + toUnit;
			}
		}
	}
};

var UIManager = {

	// change button style according to mode
	toButtonUp: function(button) {
			button.className = "button buttonUp";	
	},
	toButtonDown: function(button) {
			button.className = "button buttonDown";	
	}
};

(function() {
	var buttons = document.getElementsByClassName("button");
	for (var i = 0; i < buttons.length; i += 1) {
		buttons[i].onmouseup = function() { UIManager.toButtonUp(this) };
		buttons[i].onmouseleave = function() { UIManager.toButtonUp(this) };
		buttons[i].onmousedown = function() { UIManager.toButtonDown(this); };
	}
})();
