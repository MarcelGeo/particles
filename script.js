class Area {
    constructor(element, width, height) {
        this.element = element;
        this.context = element.getContext('2d')
        this.element.width = width;
        this.element.height = height;
    }
}

class GridSet {
    constructor(cellSize, area) {
        this.area = area;
        this.zoom = 1;
        this.cellSize = cellSize / this.zoom;
        this.cols = Math.ceil(area.element.width / this.cellSize)
        this.rows = Math.ceil(area.element.height / this.cellSize)
        this.fontSize = 100 * this.zoom;
        this.area.context.font = this.fontSize + "px Helvetica";
    }

    _getZoom(){
        return this.zoom
    }

    render(width, style="grid") {
        this.area.context.strokeStyle = "white"
        this.area.context.fillStyle = "white"
        this.area.context.lineWidth = width

        if (style === "grid") {
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
        } else if (style === "point")  {
            for (let x = 0; x < this.cols; x++) {
                for (let y = 0; y < this.rows; y++) {
                    this.area.context.fillRect(x*this.cellSize, y*this.cellSize, width, width)
                }
            }
        }
    }

    setZoom(zoom){
        this.zoom = zoom;
        this.cellSize = this.cellSize / this.zoom;
        this.cols = Math.ceil(this.area.element.width / this.cellSize)
        this.rows = Math.ceil(this.area.element.height / this.cellSize)
        this.fontSize = 100 * this.zoom;
        this.area.context.font = this.fontSize + "px Helvetica";
        this.render()
    }
}

const area = new Area(
    document.getElementById('particle-area'), 
    globalThis.window.innerWidth, 
    globalThis.window.innerHeight
);

const gridSet = new GridSet(256, area);
gridSet.render(1, "point")
gridSet.setZoom(2)

area.context.fillStyle = "red";
area.context.textAlign = "center";
area.context.fillText('Jeeej', area.element.width/2, area.element.height/2)