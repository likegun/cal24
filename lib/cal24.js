var _ = require('lodash');
var util = require('util');
var mymath = require('./mymath.js');

module.exports = Cal24;

function Cal24(gameNumArr) {
	var self = this;
	var results = [];
	this.gameNumArr = gameNumArr;

	this.start = function () {
		var possibleNumOrder = mymath.amn(this.gameNumArr, 4);
		var symbolOrderArr = mymath.amn2(['+', '-', '*', '/'], 3);
		possibleNumOrder.forEach(function (numOrder) {
			symbolOrderArr.forEach(function (symbolOrder) {
				cal(numOrder, symbolOrder, []).forEach(function (e) {
					if (e.calResult === 24) {
						var exist = _.find(results, function (result) {
							return compareCalArray(result, e.tracks);
						})
						if (!exist)
							results.push(e.tracks);
					}
				})
			})
		})
	}

	this.getResults = function () {
		return results;
	}

	this.newGame = function () {
		clear();
		while (true) {
			self.gameNumArr = mymath.generateNumber(1, 13, 4);
			self.start();
			if (haveResults()) {
				console.log('new game: %s', self.gameNumArr);
				break;
			}
		}
	}

	this.calByNumberArr = function (numberArr) {
		clear();
		self.gameNumArr = numberArr;
		self.start();
		print();
	}

	/**
	 * 计算在numOrder和symbolArr下的所有计算情况并返回
	 * @param  {Array} numOrder 数字数组
	 * @param  {Array} symbolArr 运算符数组
	 * @param {Array} tracks 计算过程数组
	 * @return {Array of Object}         包含计算结果和计算过程数组的对象 如{tracks: ['1 + 2', '3 + 5', '3 * 8'], calResult: 24}
	 */
	function cal(numOrder, symbolArr, tracks) {
		var data = [];
		if (symbolArr.length !== numOrder.length - 1) {
			throw new Error('Wrong numOrder [%s] and symbolArr [%s]', numOrder, symbolArr);
		}
		var calProcessArr = [];
		symbolArr.forEach(function (symbol, index) {
			var result = calASymbolB(numOrder[index], numOrder[index + 1], symbol);
			var tempTracks = copyArr(tracks);
			tempTracks.push(util.format('%d %s %d', numOrder[index], symbol, numOrder[index + 1]));
			var tempNumOrder = copyArr(numOrder);
			tempNumOrder.splice(index, 2, result);
			var tempSymbolArr = copyArr(symbolArr);
			tempSymbolArr.splice(index, 1);
			if (tempSymbolArr.length === 0) {
				data = data.concat([{
					calResult: tempNumOrder[0],
					tracks: tempTracks
				}]);
			} else
				data = data.concat(cal(tempNumOrder, tempSymbolArr, tempTracks));
		})
		return data;
	}

	/**
	 * 根据symbol计算a和b
	 * @param  {Number} a    
	 * @param  {Number} b      
	 * @param  {String} symbol 计算符号，只支持+,-,*,/
	 * @return {Number}        计算结果
	 */
	function calASymbolB(a, b, symbol) {
		var result;
		switch (symbol) {
		case '*':
			result = a * b;
			break;
		case '/':
			result = a / b;
			break;
		case '+':
			result = a + b;
			break;
		case '-':
			result = a - b;
			break;
		default:
			throw new Error('Wrong symbol [%s]', symbol);
		}
		return result;
	}

	/**
	 * 拷贝一个数组
	 * @param  {Array} arr 数组
	 * @return {Array}     
	 */
	function copyArr(arr) {
		return arr.slice(0);
	}

	function compareCalArray(calArray1, calArray2) {
		if (compareCal(calArray1[2], calArray2[2])) {
			return compareCal(calArray1[1], calArray2[1]) && compareCal(calArray1[0], calArray2[0]) || compareCal(calArray1[1], calArray2[0]) && compareCal(calArray1[0], calArray2[1]);
		}
		return false;
	}

	/**
	 * 比较两个二元计算表达式是否相等 (2*12 == 2*12 而且 2*12=12*2)
	 * @param  {String} cal1 二元计算表达式1
	 * @param  {String} cal2 二元计算表达式2
	 * @return {Boolean}      是否相等
	 */
	function compareCal(cal1, cal2) {
		if (cal1 === cal2 || reverseCal(cal1) === cal2) return true;
		return false;

	}

	/**
	 * 将一个二元计算表达式的两个计算数互换位置 比如 12*2 -> 2*12
	 * @param  {String} cal 二元计算表达式
	 * @return {String}
	 */
	function reverseCal(cal) {
		var symbol = cal.match(/-?\d+\s(\*|\/|\+|-)\s-?\d+/)[1]
		return cal.split(' ' + symbol + ' ').reverse().join(' ' + symbol + ' ');
	}

	/**
	 * 判断当前的游戏是否有结果
	 * @return {Boolean}
	 */
	function haveResults() {
		return results.length !== 0;
	}

	/**
	 * 清空当前结果数组
	 */
	function clear() {
		results = [];
	}

	/**
	 * 打印出计算结果
	 */
	function print() {
		if (results.length === 0) {
			return console.log('抱歉 %s 并没有算到24点的算法～_~');
		}
		console.log('有这些计算结果:');
		console.log(results);
	}
}