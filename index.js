var repl = require('repl');
var r = repl.start('> ');
var c = r.context;
var Cal24 = require('./lib/cal24.js');
var cal24 = new Cal24();

r.commands['new'] = {
	help: "新游戏",
	action: function () {
		cal24.newGame();
	}
};

r.commands['answer'] = {
	help: "查看答案",
	action: function () {
		console.log(cal24.getResults());
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
		cal24.calByNumberArr(numberArray);
	}
};