const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const width = context.canvas.width;
const height = context.canvas.height;

const target = {
  x: width / 2,
  y: 10
};

const distance = (x1, x2, y1, y2) => {
  let a = x1 - x2
  let b = y1 - y2
  return Math.sqrt(a*a + b*b);
};


class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 0.25;
    this.color = '#fff';
  }

  die() {
    if ((this.x < 0 || this.x > width) || (this.y < 0 || this.y > height)) {
      return true;
    }
    return false;
  }

  update() {
    this.x += 1 * (Math.floor(Math.random() * 2) ? -this.speed : this.speed);
    this.y -= this.speed;
    this.distance = distance(this.x - target.x, this.y - target.y);
  }

  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, 2, 2);
  }
}


let dotsFarm = [];

for (let x = 0; x < 10; x++) {
  dotsFarm.push(new Dot(width/2, height));
}

const update = () => {
  for (let x = 0; x < 10; x++) {
    let dot = dotsFarm[x];
    dot.update();

    if (dot.die()) {
      console.log(dot)
    }
  }
};

const draw = () => {
  context.clearRect(0, 0, width, height);
  context.fillStyle = '#333';
  context.fillRect(0, 0, width, height);
};

function main() {
  update();
  draw();
  requestAnimationFrame(main);
}

main();
