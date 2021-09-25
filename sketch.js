var grid = []
var gsize
var res = 25
var brushSize = 1
var viewMode = 0
var boids = []

function disableRightClickContextMenu(element) {
  element.addEventListener('contextmenu', function(e) {
    if (e.button == 2) {
      // Block right-click menu thru preventing default action.
      e.preventDefault();
    }
  });
}

function setup() {
  let canvas = createCanvas(500, 500)
  disableRightClickContextMenu(canvas.elt)
  generateGrid(20, 20)
  for (let i = 0; i < 200; i++) {
    boids.push(new Boid(random(gsize.x), random(gsize.y), 0.7))
  }
}

function generateGrid(w, h) {
  grid = []
  gsize = createVector(w, h)
  for (let y = 0; y < h; y++) {
    grid[y] = []
    for (let x = 0; x < h; x++) {
      grid[y][x] = new Node(x, y, false ,1)
    }
  }
}

function generateField(startNodes) {
  for (let y = 0; y < gsize.y; y++) {
    for (let x = 0; x < gsize.x; x++) {
      grid[y][x].cost = Infinity
      grid[y][x].vec = null
    }
  }
  let openSet = []
  for (let s of startNodes){
    s.cost=0
    openSet.push(s)
  }
  
  
  while (openSet.length != 0) {
    let currentNode = openSet[0]
    openSet.splice(0, 1)
    let neighbors = currentNode.getNeighbors(false)
    for (let n of neighbors) {
      let newCost = currentNode.cost + n.weight
      if (newCost < n.cost) {
        if (!openSet.includes(n)) {
          openSet.push(n)
          n.cost = newCost
        }
      }
    }
  }
  for (let y = 0; y < gsize.y; y++) {
    for (let x = 0; x < gsize.x; x++) {
      grid[y][x].getVector()
    }
  }
}

function blurGrid(size){
  let tempGrid=grid.slice()
  
  
  for (let y=0;y<gsize.y;y++){
    for (let x=0;x<gsize.x;x++){
      let total=0
      let average=0
      for (let yy=y-floor(size/2);yy<y+ceil(size/2);yy++){
        for (let xx=x-floor(size/2);xx<x+ceil(size/2);xx++){
          if (yy>=0 && xx>=0 && yy<gsize.y && xx<gsize.x){
            average+=tempGrid[yy][xx].weight
            total++
          }
        } 
      }
      grid[y][x].weight=average/total
    }
    
  }
}

function draw() {
  background(0)
  drawGrid(10)
  editGrid()
  generateField([grid[getMousePos().y][getMousePos().x]])
  blendMode(ADD)
  for (let b of boids) {
    b.update()
  }
  blendMode(BLEND)

  fill(255)
  noStroke()
  textSize(width / 30)
  textAlign(LEFT, TOP)
  if (viewMode == 1) {
    text('Viewing weights', 0, 0)
  } else if (viewMode == 2) {
    text('Viewing distances', 0, 0)
  } else if (viewMode == 3) {
    text('Viewing vector field', 0, 0)
  }
  textAlign(RIGHT, TOP)
  textSize(width / 35)
  text(int(frameRate()), width, 0)
  
  //noLoop()
}

function getMousePos() {
  return createVector(constrain(int(mouseX / res), 0, gsize.x - 1), constrain(int(mouseY / res), 0, gsize.y - 1))
}

function drawGrid() {
  for (let y = 0; y < gsize.y; y++) {
    for (let x = 0; x < gsize.x; x++) {
      noStroke()
      if (grid[y][x].isSolid) {
        fill(255)
        rect(x * res, y * res, res, res)
      } else if (viewMode > 0) {
        if (viewMode == 1) {
          let v=map(grid[y][x].weight, 0, 10, 0, 255)
          fill(0,v,0)
          rect(x * res, y * res, res, res)
        } else {
          if (grid[y][x].cost != Infinity) {
            let v = map(grid[y][x].cost, 0, getHighest(), 255, 0)
            fill(0, v / 4, v)
            rect(x * res, y * res, res, res)
            if (viewMode == 2) {
              fill(255)
              noStroke()
              textSize(res / 2)
              textAlign(CENTER, CENTER)
              text(grid[y][x].cost, (x + 0.5) * res, (y + 0.5) * res)
            } else if (viewMode == 3) {
              if (grid[y][x].vec != null && grid[y][x].vec.mag()!=0) {
                noFill()
                stroke(255)
                strokeWeight(res / 10)
                push()
                translate((x + 0.5) * res, (y + 0.5) * res)
                rotate(grid[y][x].vec.heading())
                line(0, 0, res / 2, 0)
                fill(255)
                noStroke()
                triangle(res / 2.5, res / 8, res / 2.5, -res / 8, res / 1.7, 0)
                pop()
              }
            }
          }
        }
      }
    }
  }
}

function getHighest() {
  let highest = 0
  for (let y = 0; y < gsize.y; y++) {
    for (let x = 0; x < gsize.x; x++) {
      if (grid[y][x].cost != Infinity && grid[y][x].cost > highest) {
        highest = grid[y][x].cost
      }
    }
  }
  return highest
}

function editGrid() {
  let m = getMousePos()
  if (mouseIsPressed) {
    for (let y = m.y - floor(brushSize / 2); y < m.y + ceil(brushSize / 2); y++) {
      for (let x = m.x - floor(brushSize / 2); x < m.x + ceil(brushSize / 2); x++) {
        if (x >= 0 && y >= 0 && x < gsize.x && y < gsize.y) {
          if (mouseButton == LEFT) {
            grid[y][x] = new Node(x, y, true, 10)
          } else if (mouseButton == RIGHT) {
            grid[y][x] = new Node(x, y, false, 1)
          }
        }
      }
    }
  }
  noFill()
  stroke(255, 0, 0)
  strokeWeight(res / 10)
  rect((m.x - floor(brushSize / 2)) * res, (m.y - floor(brushSize / 2)) * res, res * brushSize, res * brushSize)
}

function keyPressed() {
  if (keyCode == 86) {
    viewMode = (viewMode + 1) % 4
  }
}

function mouseWheel(event) {
  brushSize -= event.delta / abs(event.delta)
  brushSize = constrain(brushSize, 1, max(gsize.x, gsize.y))
}