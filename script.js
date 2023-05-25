class Area {
    constructor(element, width, height, fontSize=100) {
        this.element = element;
        this.context = element.getContext('2d')
        
        this.element.width = width;
        this.element.height = height;

        this.fontSize = fontSize
        this.context.font = fontSize + 'px Helvetica'
    }

    addText(text){
        this.context.fillStyle = "red";
        this.context.textAlign = "center";
        this.context.fillText(text, this.element.width/2, this.element.height/2)
    }
}

class GridSet {
    constructor(area, cellSize, width=1, gridStyle="grid") {
        this.area = area;
        this.zoom = 1;
        this.cellSize = cellSize / this.zoom;
        this.cols = Math.ceil(area.element.width / this.cellSize)
        this.rows = Math.ceil(area.element.height / this.cellSize)
        this.width = width
        this.gridStyle = gridStyle
    }

    render() {
        this.area.context.strokeStyle = "white"
        this.area.context.fillStyle = "white"
        this.area.context.lineWidth = this.width

        this.area.context.clearRect(0,0, this.area.element.width, this.area.element.height)
        if (this.gridStyle === "grid") {
            for (let x = 0; x < this.cols; x++) {
                this.area.context.beginPath()
                this.area.context.moveTo(this.cellSize * x, 0) 
                this.area.context.lineTo(this.cellSize * x, this.area.element.height) 
                this.area.context.stroke();
            }
            for (let y = 0; y < this.rows; y++) {
                this.area.context.beginPath()
                this.area.context.moveTo(0, this.cellSize * y) 
                this.area.context.lineTo(this.area.element.width, this.cellSize * y) 
                this.area.context.stroke();
            }
        } else if (this.gridStyle === "point")  {
            for (let x = 0; x < this.cols; x++) {
                for (let y = 0; y < this.rows; y++) {
                    this.area.context.fillRect(x*this.cellSize, y*this.cellSize, this.width, this.width)
                }
            }
        }
    }

    setZoom(zoom){
        this.zoom = zoom;
        this.cellSize = this.zoom < 0 ? this.cellSize / (this.zoom * -1)  : this.cellSize * this.zoom;
        this.cols = Math.ceil(this.area.element.width / this.cellSize)
        this.rows = Math.ceil(this.area.element.height / this.cellSize)
        
        const prevFont = this.area.context.font.split(' ');
        const prevFontSize = prevFont[0].replace('px', '');
        const newFontSize = Number(prevFontSize) + (10 * this.zoom);
        this.area.context.font = newFontSize + 'px ' + prevFont[1];
        this.render()
    }

    getParticlesAlpha(scale=0.03) {
        const currCellSize = Math.floor(this.area.fontSize * scale);
        const particles = []

        const pixels = this.area.context.getImageData(0, 0, this.area.element.width, this.area.element.height).data;
        for (let y = 0; y < this.area.element.height; y+=currCellSize) {
            for (let x = 0; x < this.area.element.width; x+=currCellSize) {
                const pixelIndex = (y * this.area.element.width + x) * 4;
                if (pixels[pixelIndex + 3] > 0) {
                    // alpha
                    particles.push(
                        new Particle(new Point(x, y, this), "blue", currCellSize)
                    )
                }
            }
        }

        return particles
    }
}

class Point {
    constructor(x, y, gridSet) {
        this.x = x
        this.y = y
        this.treeX = Math.ceil(gridSet.cellSize / x)
        this.treeY = Math.ceil(gridSet.cellSize / y)
        this.gridSet = gridSet
    }

    move(toPoint) {
        this.x = toPoint.x
        this.y = toPoint.y
        this.treeX = toPoint.treeX
        this.treeY = toPoint.treeY
    }
}

class Particle {
    constructor(point, color, size) {
        this.point = point;
        this.originX = new Point(0, 0, this.point.gridSet);
        this.originY = new Point(0, 0, this.point.gridSet);

        this.color = color;
        this.size = size
    }

    render() {
        this.point.gridSet.area.context.fillStyle = this.color;
        this.point.gridSet.area.context.fillRect(this.point.x, this.point.y, this.size, this.size)
    }

    moving() {
        let x, y;
        x += (this.originX - this.point.x)
        y += (this.originY - this.point.y)
        this.point.move(new Point(x, y, this.point.gridSet))
    }
}

const area = new Area(
    document.getElementById('particle-area'), 
    globalThis.window.innerWidth, 
    globalThis.window.innerHeight
);

const gridSet = new GridSet(area, 256, 1, "point");
gridSet.render()
gridSet.setZoom(-2)
area.addText("Blue particles")

const particles = gridSet.getParticlesAlpha();

// remove particles.forEach for only text displayed
particles.forEach(element => {
    // element.moving()
    element.render()
});





