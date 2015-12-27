import repl from 'repl';
import Cal24 from './lib/cal24.js';

var r = repl.start('> '),
	c = r.context,
	cal24 = new Cal24();

r.commands['new'] = {
	help: "新游戏",
	action: () => {
		cal24.newGame();
	}
};

r.commands['answer'] = {
	help: "查看答案",
	action: () => {
		cal24.print();
	}
};

r.commands['cal'] = {
	help: "输入4个数字，列出计算24的所有算法",
	action: (numberArray) => {
		numberArray = numberArray.split(',');
		var hasNaN = false;

		for (let number of numberArray) {
			if (isNaN(parseInt(number))) {
				hasNaN = true;
				break;
			}
		}

		hasNaN ? console.log('必须输入四个数字') : cal24.calByNumberArr(numberArray);
	}
};