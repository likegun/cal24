# cal24

## 过年的时候和兄弟姐妹玩24点的时候，会碰到算不出来的情况，所以写了这个。

### Usage

1. `git clone https://github.com/likegun/cal24.git`
2. `cd cal24`
3. `npm i`
4. `node index.js`
5.  输入'.help'查看所有可用的命令 

### 自定义了三个repl命令，分别是:

* .new 开始一个新24点游戏，程序会随机给出4个数字
* .answer 查看.new之后的游戏的答案
* .cal num1,num2,num3,num4 给定四个数字，查看所有可能的24点算法(如.cal 1,2,3,4)
