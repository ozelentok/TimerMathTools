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

// checks if input boxes are vaild
var boxValidator = {

	checkQuadBoxes: function() {
		var a, b, c;
		a = parseFloat(document.getElementById("a_eq").value);
		b = parseFloat(document.getElementById("b_eq").value);
		c = parseFloat(document.getElementById("c_eq").value);
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
		k = parseFloat(document.getElementById("success").value);
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
				document.getElementById("passGenErrorMessage").innerHTML = "ERROR! Non-Negative Integers Only!"
				document.getElementById("passGenResults").innerHTML = "";
			}
			else {
				var passw = passGen.generate(passLen, lowcase, upcase, nums);
				document.getElementById("passGenErrorMessage").innerHTML = "";
				document.getElementById("passGenResults").innerHTML = passw;
			}
		}
	}
};
