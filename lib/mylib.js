'use strict';

/**
 * 生成一个整型数组，长度为length，取值范围为min~max
 * @return {Array of Int}
 */
export function generateNumber(min, max, length) {
	var numberArray = [];
	while (length-- > 0) {
		//保证1、2...12、13等可能出现
		numberArray.push(Math.floor(parseInt(Math.random() * (max - 0.0000001))) + 1 + min)
	}
	return numberArray;
}

/**
 * 根据symbol计算a和b
 * @param  {Number} a    
 * @param  {Number} b      
 * @param  {String} symbol 计算符号，只支持+,-,*,/
 * @return {Number}        计算结果
 */
export function calASymbolB(a, b, symbol) {
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
export function copyArr(arr) {
	return arr.slice(0);
}

export function compareCalArray(calArray1, calArray2) {
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
export function compareCal(cal1, cal2) {
	if (cal1 === cal2 || reverseCal(cal1) === cal2) return true;
	return false;
}


/**
 * 将一个二元计算表达式的两个计算数互换位置 比如 12*2 -> 2*12
 * @param  {String} cal 二元计算表达式
 * @return {String}
 */
export function reverseCal(cal) {
	var symbol = cal.match(/-?\d+\s(\*|\/|\+|-)\s-?\d+/)[1]
	return cal.split(' ' + symbol + ' ').reverse().join(' ' + symbol + ' ');
}