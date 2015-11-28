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
		if (cal24)
			cal24.clear();
		return gameNumber;
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
		var gameNumber = getGameNumber();
		cal24 = new Cal24(gameNumber);
		if (cal24.getTracks().length !== 0) {
			console.log("游戏数字是:" + gameNumber)
		}
	}
};

r.commands['answer'] = {
	help: "查看答案",
	action: function () {
		console.log("有这些算法:");
		console.log(cal24.getTracks());
	}
};

r.commands['cal'] = {
	help: "输入4个数字，列出计算24的所有算法",
	action: function () {
		var numberArray = arguments['0'].split(',');

		numberArray = numberArray.map(function (e) {
			var number = parseInt(e);
			if (isNaN(number))
				return;
			return number;
		})

		if (numberArray.length !== 4) {
			return console.log('必须输入四个数字');
		}
		if (cal24)
			cal24.clear();
		cal24 = new Cal24(numberArray);
		console.log("有这些算法:");
		console.log(cal24.getTracks());
	}
};