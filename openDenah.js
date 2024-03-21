console.log("OpenDenah Development")

class Denah {
    constructor(element,size, width=100){
        this.element = element
        this.isDown = false
        this.width = width
        this.size = size
        this.data
        this.dataTemp
        this.globalPos
    }

    setWidth(width){
        this.width = width
    }

    setSize(size){
        this.size = size
    }

    createRoom = () => {
        const newArray = []
        for (let a = 0; a < this.size[1]; a++) {
            newArray.push([])
            for (let b = 0; b < this.size[0]; b++) {
                newArray[a].push([0])
            }
        }
        this.data = newArray
    }

    printRoom = (data = this.data) => {
        const temp = []
        for (let a = 0; a < data.length; a++) {
            temp.push(`${data[a].join(' ')}`)
        }
        console.log(temp.join('\n'))
        return true
    }

    paintRoom = (from,to,value=1) => {
        let x = [parseInt(from[0]),parseInt(to[0])]
        let y = [parseInt(from[1]),parseInt(to[1])]
        if(x[0]>x[1]){
            x = [parseInt(to[0]),parseInt(from[0])]
        }
        if(y[0]>y[1]){
            y = [parseInt(to[1]),parseInt(from[1])]
        }

        for (let a = y[0]; a <= y[1]; a++) {
            for (let b = x[0]; b <= x[1]; b++) {
                this.data[a][b] = value
            }        
        }
        this.render()
    }
  
    myMouseDown = (pos) => {
        this.isDown = true
        this.globalPos = pos.srcElement.id + ','
        this.dataTemp = JSON.parse(JSON.stringify(this.data))
    }

    myMouseEnter = (pos) => {
        if (this.isDown){
            const newCoor = this.globalPos.split(",")
            const thisCoor = pos.srcElement.id.split(",")
            this.data = JSON.parse(JSON.stringify(this.dataTemp))
            this.render()
            this.paintRoom([newCoor[0],newCoor[1]],[thisCoor[0],thisCoor[1]])
        }
    }

    myMouseUp = (pos) => {
        this.isDown = false
        this.globalPos += pos.srcElement.id
        const newCoor = this.globalPos.split(",")
        this.paintRoom([newCoor[0],newCoor[1]],[newCoor[2],newCoor[3]])
        this.printRoom(this.data)
    }

    getTile = (color, blockWidth, position) => {
        return `<div class="denahBlock" id="${position}" style="background-color:${color};height:${blockWidth}px;width:${blockWidth}px;"></div>`
    }

    render = () => {
        const groundColor = "#E9E9E9"
        const buildingColor = "green"
        let size=[this.data[0].length,this.data.length]
        const blockWidth = this.width/size[0]
        let template = ''
        let container = document.querySelector(`${this.element}`)
        container.style.display = "flex"
        container.style.flexDirection = "column"
        container.style.gap = "0px"
        container.style.height = "100px!important"
        this.data.forEach((tile,y) => {
            template += `<div style="height:${blockWidth}px; display:flex">`
            tile.forEach((element,x) => {
                template += element==0?this.getTile(groundColor,blockWidth,`${x},${y}`):this.getTile(buildingColor,blockWidth,`${x},${y}`)
            })
            template += '</div>'
        })
        container.innerHTML = template
        this.data.forEach((tile,y2) => {
            tile.forEach((element,x2) => {
                document.getElementById(`${x2},${y2}`).addEventListener("mousedown", (event)=> {this.myMouseDown(event)})
                document.getElementById(`${x2},${y2}`).addEventListener("mouseup", (event)=> {this.myMouseUp(event)})
                document.getElementById(`${x2},${y2}`).addEventListener("mouseenter", (event)=> {this.myMouseEnter(event)})
            })
        })
    }
}