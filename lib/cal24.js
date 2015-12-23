'use strict';
import * as _ from 'lodash';
import * as util from 'util';
import * as permutation from 'math-permutation';
import {
	generateNumber,
	compareCalArray,
	copyArr,
	calASymbolB
}
from './mylib.js';

export default class Cal24 {

	construct(gameNumArr) {
		this.gameNumArr = gameNumArr;
		this.results = [];
	}

	start() {
		var self = this;
		var possibleNumOrder = permutation.amn(this.gameNumArr, 4);
		var symbolOrderArr = permutation.amnWithRepetition(['+', '-', '*', '/'], 3);
		possibleNumOrder.forEach(function (numOrder) {
			symbolOrderArr.forEach(function (symbolOrder) {
				self.cal(numOrder, symbolOrder, []).forEach(function (e) {
					if (e.calResult === 24) {
						var exist = _.find(self.results, function (result) {
							return compareCalArray(result, e.tracks);
						})
						if (!exist)
							self.results.push(e.tracks);
					}
				})
			})
		})
	}

	getResults() {
		return this.results;
	}

	newGame() {
		var self = this;
		self.clear();
		while (true) {
			self.gameNumArr = generateNumber(1, 13, 4);
			self.start();
			if (self.haveResults()) {
				console.log('new game: %s', self.gameNumArr);
				break;
			}
		}
	}

	calByNumberArr(numberArr) {
		var self = this;
		self.clear();
		self.gameNumArr = numberArr;
		self.start();
		self.print();
	}

	/**
	 * 计算在numOrder和symbolArr下的所有计算情况并返回
	 * @param  {Array} numOrder 数字数组
	 * @param  {Array} symbolArr 运算符数组
	 * @param {Array} tracks 计算过程数组
	 * @return {Array of Object}         包含计算结果和计算过程数组的对象 如{tracks: ['1 + 2', '3 + 5', '3 * 8'], calResult: 24}
	 */
	cal(numOrder, symbolArr, tracks) {
		var self = this;
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
				data = data.concat(self.cal(tempNumOrder, tempSymbolArr, tempTracks));
		})
		return data;
	}

	/**
	 * 判断当前的游戏是否有结果
	 * @return {Boolean}
	 */
	haveResults() {
		return this.results.length !== 0;
	}

	/**
	 * 清空当前结果数组
	 */
	clear() {
		this.results = [];
	}

	/**
	 * 打印出计算结果
	 */
	print() {
		if (!this.haveResults()) {
			return console.log('抱歉 %s 并没有算到24点的算法～_~', this.gameNumArr);
		}
		console.log('有这些计算结果:');
		console.log(this.results);
	}
}