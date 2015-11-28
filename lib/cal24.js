var _ = require('lodash');
var util = require('util');
var amn = require('./amn.js');

module.exports = Cal24;

var tracks = [];

function Cal24(numberArray, track) {
	this.numberArray = numberArray;
	this.track = track || [];
	this.cal();
}

Cal24.prototype.cal = function () {
	var self = this;
	var len = self.numberArray.length;
	if (len < 2) {
		throw new Error('numberArray\'s length less than 2');
	} else if (len === 2) {
		var numberPairs = amn(self.numberArray, 2);
		numberPairs.forEach(function (numberPair) {
			switch (24) {
			case numberPair[0] * numberPair[1]:
				self.output('*', numberPair);
				break;
			case numberPair[0] - numberPair[1]:
				self.output('-', numberPair);
				break;
			case numberPair[0] + numberPair[1]:
				self.output('+', numberPair);
				break;
			case numberPair[0] / numberPair[1]:
				self.output('/', numberPair);
				break;
			default:
				break;
			}
		})
	} else {
		//获得self.numberArray选取2个元素的所有组合情况(元素顺序不同视作不同的组合)
		var numberPairs = amn(self.numberArray, 2);

		numberPairs.forEach(function (numberPair) {
			//copy array
			var tempArray = self.numberArray.slice(0)

			//对于每一个numberPair，在tempArray中去除它
			tempArray.splice(tempArray.indexOf(numberPair[0]), 1);
			tempArray.splice(tempArray.indexOf(numberPair[1]), 1);

			//这个对象的计算工作结束了，再来4个新的对象完成接下来的工作
			new Cal24(self.getTempArray(tempArray, numberPair, '*'), self.output('*', numberPair, true));
			new Cal24(self.getTempArray(tempArray, numberPair, '-'), self.output('-', numberPair, true));
			new Cal24(self.getTempArray(tempArray, numberPair, '+'), self.output('+', numberPair, true));
			new Cal24(self.getTempArray(tempArray, numberPair, '/'), self.output('/', numberPair, true));
		});
	}

}

/**
 * 当计算到最后结果为24时被调用，输出算24的过程
 * @param  {String} symbol 最后一步计算的计算符号
 * @param  {Boolean} retrunOrNot 是否返回消息,false则直接输出
 */
Cal24.prototype.output = function (symbol, numberPair, returnOrNot) {
	var self = this;
	var tempTrack = self.track.slice(0)
	tempTrack.push(util.format(numberPair[0] + ' %s ' + numberPair[1], symbol))
	if (returnOrNot)
		return tempTrack;
	var track = _.find(tracks, function (e) {
		return compareCalArray(e, tempTrack);
	})
	if (!track)
		tracks.push(tempTrack);
}

/**
 * 根据symbol，创建array的copy，并往copy中添加numberPair的计算结果
 * @param  {[type]} array      [description]
 * @param  {[type]} numberPair [description]
 * @param  {[type]} symbol     [description]
 * @return {[type]}            [description]
 */
Cal24.prototype.getTempArray = function (array, numberPair, symbol) {
	var tempArray = array.slice(0);
	var res;
	switch (symbol) {
	case '+':
		res = numberPair[0] + numberPair[1];
		break;
	case '*':
		res = numberPair[0] * numberPair[1];
		break;
	case '-':
		res = numberPair[0] - numberPair[1];
		break;
	case '/':
		res = numberPair[0] / numberPair[1];
		break;
	default:
		break;
	}
	tempArray.push(res);
	return tempArray;
}


Cal24.prototype.getTracks = function () {
	return tracks;
}

Cal24.prototype.clear = function () {
	tracks = [];
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