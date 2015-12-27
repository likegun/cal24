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
		let operation = ['+', '-', '*', '/'];
		var possibleNumOrder = permutation.amn(this.gameNumArr, 4);
		var symbolOrderArr = permutation.amnWithRepetition(operation, 3);
		possibleNumOrder.forEach(numOrder => {
			symbolOrderArr.forEach(symbolOrder => {
				self.cal(numOrder, symbolOrder, []).forEach(e => {
					if (e.calResult === 24) {
						let exist = self.results.find(result => compareCalArray(result, e.tracks));
						if (!exist) self.results.push(e.tracks);
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
				console.log(`new game: ${self.gameNumArr}`);
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
		var [self, data] = [this, []];
		if (symbolArr.length !== numOrder.length - 1) {
			throw new Error(`Wrong numOrder [%s] and symbolArr [${numOrder, symbolArr}]`);
		}
		symbolArr.forEach((symbol, index) => {
			var result = calASymbolB(numOrder[index], numOrder[index + 1], symbol);
			var [tempTracks, tempNumOrder, tempSymbolArr] = [tracks, numOrder, symbolArr].map(e => copyArr(e))
			tempTracks.push(`${numOrder[index]} ${symbol} ${symbol, numOrder[index + 1]}`);
			tempNumOrder.splice(index, 2, result);
			tempSymbolArr.splice(index, 1);

			var subData = tempSymbolArr.length ? self.cal(tempNumOrder, tempSymbolArr, tempTracks) : [{
				calResult: tempNumOrder[0],
				tracks: tempTracks
			}]
			data = [...data, ...subData];
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
			return console.log(`抱歉 ${this.gameNumArr}并没有算到24点的算法～_~`);
		}
		console.log('有这些计算结果:\n', this.getResults());
	}
}