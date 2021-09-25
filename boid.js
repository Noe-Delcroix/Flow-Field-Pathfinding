class Boid {
  constructor(x, y, size) {
    this.pos = createVector(x, y)
    this.vel = createVector()
    this.acc = createVector()
    this.size = size

    this.maxSpeed = 0.2
    this.maxForce = 0.01
  }
  render() {
    fill(255,128,0,100)
    noStroke()
    rectMode(CORNER)
    rect(this.pos.x * res, this.pos.y * res, this.size * res, this.size * res)
  }
  steer() {
    let desired = createVector(0, 0)
    let total = 0

    for (let y = floor(this.pos.y) - 1; y <= ceil(this.pos.y) + 1; y++) {
      for (let x = floor(this.pos.x) - 1; x <= ceil(this.pos.x) + 1; x++) {

        if (x >= 0 && x < gsize.x && y >= 0 && y < gsize.y) {
          if (this.collideWith(createVector(grid[y][x].pos.x, grid[y][x].pos.y), createVector(grid[y][x].pos.x + 1, grid[y][x].pos.y + 1)) && grid[y][x].vec != null) {
            desired.add(grid[y][x].vec)
            total++
          }
        }
      }
    }

    if (total != 0) {
      desired.div(total)
    }


    desired.setMag(this.maxSpeed)
    let steer = p5.Vector.sub(desired, this.vel)
    steer.limit(this.maxForce)
    return steer

  }
  separe(distance) {
    let averageVec = createVector()
    let total = 0
    for (let other of boids) {
      let d = this.pos.dist(other.pos)
      if (other != this && d < distance) {
        let diff = p5.Vector.sub(this.pos, other.pos)
        diff.div(d)
        averageVec.add(diff)
        total++
      }
    }
    if (total != 0) {
      averageVec.div(total)
      averageVec.limit(this.maxSpeed)
      averageVec.sub(this.vel)
      averageVec.limit(this.maxForce)
    }
    return averageVec
  }

  update() {
    this.acc.add(this.steer())
    this.acc.add(this.separe(this.size))
    this.vel.add(this.acc)

    this.pos.x += this.vel.x
    if (this.collide()) {
      while (this.collide()) {
        this.pos.x += abs(this.vel.x) / this.vel.x * -1 / res
      }
    }
    this.pos.y += this.vel.y
    if (this.collide()) {
      while (this.collide()) {
        this.pos.y += abs(this.vel.y) / this.vel.y * -1 / res
      }
    }
    this.acc.mult(0)

    this.render()


  }
  collide() {
    for (let y = floor(this.pos.y) - 1; y <= ceil(this.pos.y) + 1; y++) {
      for (let x = floor(this.pos.x) - 1; x <= ceil(this.pos.x) + 1; x++) {

        if (x >= 0 && x < gsize.x && y >= 0 && y < gsize.y) {
          if (grid[y][x].isSolid) {
            if (this.collideWith(createVector(grid[y][x].pos.x, grid[y][x].pos.y), createVector(grid[y][x].pos.x + 1, grid[y][x].pos.y + 1))) {
              return true
            }
          }
        }
      }
    }
    if (this.collideWith(createVector(0, 0), createVector(gsize.x, 0)) || this.collideWith(createVector(0, 0), createVector(0, gsize.y)) || this.collideWith(createVector(gsize.x, 0), createVector(gsize.x, gsize.y)) || this.collideWith(createVector(0, gsize.y), createVector(gsize.x, gsize.y))) {
      return true
    }


    return false
  }

  collideWith(p1, p2) {
    let l1 = createVector(this.pos.x, this.pos.y)
    let r1 = createVector(this.pos.x + this.size, this.pos.y + this.size)
    let l2 = p1
    let r2 = p2

    if (l1.x >= r2.x || l2.x >= r1.x) {
      return false
    }
    if (l1.y >= r2.y || l2.y >= r1.y) {
      return false
    }
    return true


  }
}