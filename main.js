const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const width = context.canvas.width;
const height = context.canvas.height;

const target = {
  x: width / 2,
  y: 10,
  colors: ['#f00', '#0f0'],
  reached: 0
};

const distance = (x1, x2, y1, y2) => {
  let a = x1 - x2;
  let b = y1 - y2;
  return Math.sqrt(a*a + b*b);
};

let generationIndex = 0;

class Dot {
  constructor(data = {}) {
    this.x = width / 2;
    this.y = height - 20;

    this.generation = generationIndex;

    this.velocityX = data.velocityX || Math.random();
    this.velocityY = data.velocityY || Math.random();

    this.color = data.steps ? '#0ff' : '#fff';
    this.distance = distance(this.x, target.x, this.y, target.y);
    this.direction = data.direction || Math.floor(Math.random() * 4);

    this.steps = [];
    this.genes = data.steps || [];

    this.hits = 0;

    this.bornAt = Date.now();

    this.timer = setInterval(() => {
      this.tick();
    }, 1000);

    this.tick();
  }

  destroy() {
    clearInterval(this.timer);
  }

  die() {
    if ((this.x < 0 || this.x > width) || (this.y < 0 || this.y > height) || this.steps.length > 20) {
      return true;
    }
    return false;
  }

  tick() {
    let gene = this.genes.shift() || {};

    this.accelerationX = gene.accelerationX || Math.random() * (Math.floor(Math.random() * 2) ? -1 : 1);
    this.accelerationY = gene.accelerationY || Math.random() * (Math.floor(Math.random() * 2) ? -1 : 1);

    this.direction = gene.direction || Math.floor(Math.random() * 4);

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
      accelerationX: this.accelerationX + (Math.random() * (Math.floor(Math.random() * 2) ? -1 : 1) / this.generation),
      accelerationY: this.accelerationY + (Math.random() * (Math.floor(Math.random() * 2) ? -1 : 1) / this.generation),
      direction: this.direction
    });
  }

  hitTarget() {
    if ((this.x > target.x - 10 && this.x < target.x + 10) && (this.y > target.y - 10 && this.y < target.y + 10)) {
      return true;
    }
    return false;
  }

  update() {
    this.x += this.accelerationX;
    this.y += this.accelerationY;
    this.distance = distance(this.x, target.x, this.y, target.y);

    if (this.hitTarget()) {
      this.hits += 1;
    }

    if (this.die()) {
      this.diedAt = Date.now();
      this.lifeTime = this.diedAt - this.bornAt;
      this.destroy();
    }

    this.y -= 0.9;
  }

  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, 2, 2);
  }
}

let dotsFarm = [];
const generation = (dotsGenes = []) => {
  generationIndex++;
  console.log('new generation', dotsGenes)
  for (let x = 0; x < 10; x++) {
    dotsFarm.push(new Dot(dotsGenes[x]));
  }
};
generation();

let dotsGenes = [];
const update = () => {
  if (!dotsFarm.length) {
    generation(dotsGenes);
    dotsGenes.length = 0;
  }

  target.reached = 0;

  dotsFarm.forEach((dot, i) => {
    dot.update();
    if (dot.hitTarget()) {
      target.reached = 1;
    }
    if (dot.die()) {
      let diedDot = dotsFarm.splice(i, 1)[0];

      if (Math.floor(diedDot.distance) < 25 || diedDot.hits > 20 + generationIndex) {
        dotsGenes.push(diedDot);
      }
    }
  });
};

const draw = () => {
  context.clearRect(0, 0, width, height);
  context.fillStyle = '#333';
  context.fillRect(0, 0, width, height);

  context.fillStyle = target.colors[target.reached];
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
