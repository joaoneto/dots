const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const width = context.canvas.width;
const height = context.canvas.height;

const target = {
  x: width / 2,
  y: 10
};

const distance = (x1, x2, y1, y2) => {
  let a = x1 - x2;
  let b = y1 - y2;
  return Math.sqrt(a*a + b*b);
};

class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.velocityX = Math.random();
    this.velocityY = Math.random();

    this.color = '#fff';
    this.distance = distance(this.x, target.x, this.y, target.y);
    this.direction = Math.floor(Math.random() * 4);

    this.steps = [];

    this.bornAt = Date.now();

    this.timer = setInterval(() => {
      this.tick();
    }, 1000);

    this.stepForward();
    this.tick();
  }

  destroy() {
    clearInterval(this.timer);
  }

  die() {
    if ((this.x < 0 || this.x > width) || (this.y < 0 || this.y > height) || this.steps.length > 19) {
      this.diedAt = Date.now();
      this.lifeTime = this.diedAt - this.bornAt;
      this.destroy();
      return true;
    }
    return false;
  }

  tick() {
    this.accelerationX = Math.random() * (Math.floor(Math.random() * 2) ? -1 : 1);
    this.accelerationY = Math.random() * (Math.floor(Math.random() * 2) ? -1 : 1);

    this.direction = Math.floor(Math.random() * 4);

    switch (this.direction) {
      case 0: // to top
        this.y -= this.velocityY;
        break;
      case 1: // to right
        this.x += this.velocityX;
        break;
      case 2: // to bottom
        this.y += this.velocityY;
        break;
      case 3: // to left
        this.x -= this.velocityX;
        break;
    }

    this.stepForward();
  }

  stepForward() {
    this.steps.push({
      x: this.x,
      y: this.y,
      velocityX: this.velocityX,
      velocityY: this.velocityY,
      accelerationX: this.accelerationX,
      accelerationY: this.accelerationY,
      direction: this.direction
    })
  }

  update() {
    this.x += this.accelerationX;
    this.y += this.accelerationY;
    this.distance = distance(this.x, target.x, this.y, target.y);
  }

  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, 2, 2);
  }
}

let dotsFarm = [];
const generation = () => {
  for (let x = 0; x < 10; x++) {
    dotsFarm.push(new Dot(width / 2, height - 20));
  }
};
generation();

const update = () => {
  if (!dotsFarm.length) generation();

  dotsFarm.forEach((dot, i) => {
    dot.update();
    if (dot.die()) {
      dotsFarm.splice(i, 1);
    }
  });
};

const draw = () => {
  context.clearRect(0, 0, width, height);
  context.fillStyle = '#333';
  context.fillRect(0, 0, width, height);

  context.fillStyle = '#f00';
  context.fillRect(target.x - 10, target.y - 5, 20, 20);

  dotsFarm.forEach((dot) => {
    dot.draw();
  });
};

function main() {
  update();
  draw();
  requestAnimationFrame(main);
}

main();
