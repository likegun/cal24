module.exports = function (arr, n) {
	if (!(arr instanceof Array)) {
		throw new Error('arr is not instanceof Array');
	}

	var len = arr.length;
	if (len < n || n < 0) {
		throw new Error('Illegal n [%d]', n);
	}

	return amn(arr, n);
}

/**
 * 从数组中选出n个元素组合的全部情况(元素的顺序不同，组合情况也不同)
 * @param  {Array} arr 数组
 * @param  {Int} n   选出n个元素组合
 * @return {Array}   所有组合的情况 
 */
function amn(array, n) {
	if (n === 1)
		return array.map(function (e) {
			return [e];
		});
	var res = [];
	array.forEach(function (num, index) {
		//copy array
		var tempArray = array.slice(0);
		tempArray.splice(index, 1);
		amn(tempArray, n - 1).forEach(function (e) {
			e.unshift(num);
			res.push(e);
		})
	});
	return res;
}