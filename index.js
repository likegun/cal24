var repl = require('repl');
var r = repl.start('> ');
var c = r.context;
var Cal24 = require('./lib/cal24.js');

var cal24;

//生成游戏数字
function getGameNumber() {
	//因为随机生成的4个数字可能是没有解的，所以要一直找到一个有解的数字组合
	while (true) {
		var gameNumber = generateNumber();
		cal24 = new Cal24(gameNumber);
		if (cal24.getTracks().length !== 0) {
			console.log("游戏数字是:" + gameNumber)
			break;
		}
	}
}

/**
 * 生成一个整型数组，长度为4，取值范围为1~13
 * @return {Array of Int}
 */
function generateNumber() {
	var i = 4,
		numberArray = [];
	while (i-- > 0) {
		//保证1、2...12、13等可能出现
		numberArray.push(Math.floor(parseInt(Math.random() * 12.9999999)) + 1)
	}
	return numberArray;
}

r.commands['new'] = {
	help: "新游戏",
	action: function () {
		getGameNumber();
	}
};

r.commands['answer'] = {
	help: "查看答案",
	action: function () {
		console.log("有这些算法:");
		console.log(cal24.getTracks());
		cal24.clear();
	}
};

r.commands['cal'] = {
	help: "输入4个数字，列出计算24的所有算法",
	action: function () {
		console.log(arguments);
		var numberArray = arguments['0'].split(',');
		if (numberArray.length !== 4) {
			throw new Error('必须输入4个数字参数');
		}

		numberArray = numberArray.map(function (e) {
			var number = parseInt(e);
			if (isNaN(number))
				throw new Error('必须输入数字');
			return number;
		})

		var cal24 = new Cal24(numberArray);
		console.log("有这些算法:");
		console.log(cal24.getTracks());
	}
};