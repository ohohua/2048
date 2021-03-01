class Game {
  constructor() {
    this.data = []; // 存储所有游戏数据
    this.score = 0; // 分数
    this.gamerunning = 1; // 游戏运行状态，将1与其他状态分开
    this.gameover = 0; // 定义一个游戏结束的状态
    this.status = 0; // 定义目前游戏的状态
  }

  start() { // 游戏开始
    this.status = this.gamerunning
    this.score = 0
    this.data = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]
      // 游戏开始时需要生成两个随机数
    this.randomNum()
    this.randomNum()
      // 更新视图
    this.dataView()
  }

  // 生成随机数位置
  randomNum() {
    while (true) {
      // row column
      const r = Math.floor(Math.random() * 4)
      const c = Math.floor(Math.random() * 4)

      // 位置r行c列此处没有数字时为其生成一个随机数
      if (this.data[r][c] == 0) {
        const randomNumber = Math.random() > 0.5 ? 2 : 4 // 出现2的概率会略微大一些
        this.data[r][c] = randomNumber
        break;
      }
    }

  }

  // 更新视图的方法 
  dataView() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const div = document.getElementById('c' + r + c)
        if (this.data[r][c] != 0) {
          div.innerHTML = this.data[r][c]
          div.className = "cell n" + this.data[r][c]
        } else {
          // 将重新置0的数字的样式取消（没有样式也不影响）
          div.innerHTML = ""
          div.className = "cell"
        }
      }

    }
    // 更新分数
    document.getElementById('score').innerHTML = this.score
      // 判断游戏是否满足结束条件
    if (this.status == this.gamerunning) {
      document.getElementById('gameover').style.display = "none";
    } else {
      document.getElementById('gameover').style.display = "block";
    }
  }

  // 游戏是否结束
  isGameover() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        // 有空格子
        if (this.data[r][c] == 0) {
          return false; // 游戏没有结束
        }
        // 左右还可以合并
        if (c < 3 && this.data[r][c] == this.data[r][c + 1]) {
          return false;
        }
        // 上下还可以合并
        if (r < 3 && this.data[r][c] == this.data[r + 1][c]) {
          return false;
        }
      }
    }
    // 游戏结束
    return true;
  }

  // 播放按键音效
  playaudo() {
    const audio = document.getElementById('music');
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  // 向上移动
  moveUp() {
    const before = String(this.data)
      // 固定c(列),逐行判断r(行)
    for (let c = 0; c < 4; c++) {
      this.moveUpInColumn(c);
    }
    const after = String(this.data)
      // 循环前后不相等说明一定发生了改变
    if (before != after) {
      // 生成随机数
      this.randomNum()
        // 生成随机数之后判断游戏是否结束、
      if (this.isGameover()) {
        //更改游戏状态
        this.status = this.gameover
      }
      // 更新视图
      this.dataView()
    }
  }
  moveUpInColumn(c) {
    for (let r = 0; r < 4; r++) {
      const nextr = this.getNextInColumnUp(r, c)
      if (nextr != -1) {
        if (this.data[r][c] == 0) {
          this.data[r][c] = this.data[nextr][c]
          this.data[nextr][c] = 0
          r-- // 将位置还原，生成的随机数可能还能合并
        } else if (this.data[r][c] == this.data[nextr][c]) {
          this.data[r][c] *= 2
          this.data[nextr][c] = 0
            // 更新分数
          this.score += this.data[r][c]
        }
      } else {
        break;
      }
    }
  }
  getNextInColumnUp(r, c) {
    for (let j = r + 1; j < 4; j++) {
      if (this.data[j][c] != 0) {
        return j; // 将有数字的位置返回
      }
    }
    // 返回一个标识符
    return -1;
  }

  // 向下移动
  moveDown() {
    const before = String(this.data)
    for (let c = 0; c < 4; c++) {
      this.moveDownInColumn(c)
    }
    const after = String(this.data)
      // 循环前后不相等说明位置一定发生了变化
    if (before != after) {
      // 生成随机数
      this.randomNum()
        // 生成随机数之后，可能造成游戏结束
      if (this.isGameover()) {
        this.status = this.gameover
      }
      // 更新视图
      this.dataView()
    }
  }
  moveDownInColumn(c) {
    for (let r = 3; r >= 0; r--) {
      const nextr = this.getNextInColumnDown(r, c)
      if (nextr != -1) {
        if (this.data[r][c] == 0) {
          this.data[r][c] = this.data[nextr][c]
          this.data[nextr][c] = 0
          r++ // 将位置还原，可能生成随机数在之前的位置
        } else if (this.data[r][c] == this.data[nextr][c]) {
          // 两个数字相等表示可以合并
          this.data[r][c] *= 2
          this.data[nextr][c] = 0
            // 增加分数
          this.score += this.data[r][c]
        }
      } else {
        break;
      }
    }
  }
  getNextInColumnDown(r, c) {
    for (let j = r - 1; j >= 0; j--) {
      // 寻找不为0的位置
      if (this.data[j][c] != 0) {
        return j;
      }
    }
    // 返回未找到标识符
    return -1;
  }

  // 向左移动
  moveLeft() {
    const before = String(this.data)
      // 将移动所需要处理的逻辑变成直接处理每一行
    for (let r = 0; r < 4; r++) {
      this.moveLeftInRow(r)
    }
    const after = String(this.data)
      // 移动之前和移动之后不相等表明一定发生了移动
    if (before != after) {
      // 生成随机数
      this.randomNum();
      // 生成随机数可能造成游戏结束
      if (this.isGameover()) {
        this.status = this.gameover
      }
      // 更新视图
      this.dataView()
    }
  }
  moveLeftInRow(r) {
    for (let c = 0; c < 3; c++) {
      // 找到(r, c+1)不为0的位置
      let nextc = this.getNextInRowLeft(r, c)
      if (nextc != -1) {
        if (this.data[r][c] == 0) {
          this.data[r][c] = this.data[r][nextc]
          this.data[r][nextc] = 0
          c-- // 让位置恢复到原地,需要判断新出现的数字是否可以合并
        } else if (this.data[r][c] == this.data[r][nextc]) {
          this.data[r][c] *= 2 // 相同数字翻倍
          this.data[r][nextc] = 0;
          // 增加分数
          this.score += this.data[r][c]
        }
      } else {
        break;
      }

    }
  }
  getNextInRowLeft(r, c) {
    for (let i = c + 1; i < 4; i++) {
      // 进入判断代表已经找到不为0的位置
      if (this.data[r][i] != 0) {
        return i
      }
    }
    return -1 // 返回一个标识符
  }

  // 向右移动 
  moveRight() {
    const before = String(this.data)
    for (let r = 0; r < 4; r++) {
      this.moveRightInRow(r)
    }
    const after = String(this.data)
      // 移动之前和移动之后不相等表明一定发生了移动\
    if (before != after) {
      // 生成随机数
      this.randomNum()
        // 生成随机数数后需要判断游戏是否结束
      if (this.isGameover()) {
        this.status = this.gameover
      }
      // 更新视图
      this.dataView()
    }
  }
  moveRightInRow(r) {
    for (let c = 3; c >= 0; c--) {
      // 找到(r, c-1)不为0的位置
      const nextc = this.getNextInRowRight(r, c)
      if (nextc != -1) {
        if (this.data[r][c] == 0) {
          this.data[r][c] = this.data[r][nextc]
          this.data[r][nextc] = 0
          c++ //左边随机生成的数字可能可以合并，所以要重新判断一次
        }
        if (this.data[r][c] == this.data[r][nextc]) {
          this.data[r][c] *= 2;
          this.data[r][nextc] = 0;
          this.score += this.data[r][c]
        }
      } else {
        break;
      }
    }
  }
  getNextInRowRight(r, c) {
    for (let i = c - 1; i >= 0; i--) {
      if (this.data[r][i] != 0) {
        return i;
      }
    }
    return -1;
  }
}
const game = new Game();
game.start();
// 监听键盘按下
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      game.moveUp()
      game.playaudo()
      break;
    case "ArrowDown":
      game.moveDown()
      game.playaudo()
      break;
    case "ArrowLeft":
      game.moveLeft()
      game.playaudo()
      break;
    case "ArrowRight":
      game.moveRight()
      game.playaudo()
      break;
    default:
      break;
  }
})

// new game
function btnclick() {
  const game = new Game()
  game.start()
  game.playaudo()
}