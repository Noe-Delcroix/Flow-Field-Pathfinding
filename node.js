class Node{
  constructor(x,y,isSolid,weight){
    this.pos=createVector(x,y)
    this.isSolid=isSolid
    this.weight=weight
    this.cost=0
    this.vec=null
  }
  getNeighbors(fillWithNull){
    let n=[]
    
    //gauche,droite,haut,bas
    
    if (this.pos.x!=0 && !grid[this.pos.y][this.pos.x-1].isSolid){
      n.push(grid[this.pos.y][this.pos.x-1])
    }else if (fillWithNull){
      n.push(null)
    }
    if (this.pos.x!=gsize.x-1 && !grid[this.pos.y][this.pos.x+1].isSolid){
      n.push(grid[this.pos.y][this.pos.x+1])
    }else if (fillWithNull){
      n.push(null)
    }
    if (this.pos.y!=0 && !grid[this.pos.y-1][this.pos.x].isSolid){
      n.push(grid[this.pos.y-1][this.pos.x])
    }else if (fillWithNull){
      n.push(null)
    }
    if (this.pos.y!=gsize.y-1 && !grid[this.pos.y+1][this.pos.x].isSolid){
      n.push(grid[this.pos.y+1][this.pos.x])
    }else if (fillWithNull){
      n.push(null)
    }
    return n
  }
  
  getVector(){
    if (!this.isSolid && this.cost!=Infinity){
    let neighbors=this.getNeighbors(true).slice()
    for (let i=0;i<neighbors.length;i++){
      if (neighbors[i]==null){
        neighbors[i]=this
      }
    }
    this.vec=createVector(0,0)
    this.vec.x=neighbors[0].cost-neighbors[1].cost
    this.vec.y=neighbors[2].cost-neighbors[3].cost
    this.vec.limit(1)
  }
    
  }
  
}