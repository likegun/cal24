import repl from 'repl';
import Cal24 from './lib/cal24.js';

var r = repl.start('> '),
	c = r.context,
	cal24 = new Cal24();

r.commands['new'] = {
	help: "新游戏",
	action: function () {
		cal24.newGame();
	}
};

r.commands['answer'] = {
	help: "查看答案",
	action: function () {
		cal24.print();
	}
};

r.commands['cal'] = {
	help: "输入4个数字，列出计算24的所有算法",
	action: function () {
		var numberArray = arguments['0'].split(',');
		var hasNaN = false;

		numberArray = numberArray.map(function (e) {
			let number = parseInt(e);
			return isNaN(number) ? hasNaN = true : number;
		});

		hasNaN ? console.log('必须输入四个数字') : cal24.calByNumberArr(numberArray);
	}
};