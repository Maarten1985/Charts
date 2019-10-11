class GridSystem {
    constructor(columns) {
        
    }
}
// https://stackoverflow.com/questions/326679/choosing-an-attractive-linear-scale-for-a-graphs-y-axis
class MyChart {
    constructor(obj, data, config = []) {
        // Set params
        this.obj = obj;
        this.data = data;
        this.ig = config
        this.pixelCorrection = 0.5;
        // Bind methods
        this.setSize = this.setSize.bind(this);
        this._line = this._line.bind(this);
        this.drawGrid = this.drawGrid.bind(this);
        this.addEvent = this.addEvent.bind(this);
        this.setPixel = this.setPixel.bind(this);
        this.bline = this.bline.bind(this);
        this.getYAxis = this.getYAxis.bind(this);
        this.calculate = this.calculate.bind(this);
        this.mousemove = this.mousemove.bind(this);
        this._square = this._square.bind(this);
        // Check config and start events
        // auto resize
        if(typeof config.scalable == "undefined" || config.scalable == true) {
           window.addEventListener('resize', this.calculate);
        }
        // interactive
        if(typeof config.static == "undefined" || config.static == false) {
            this.obj.addEventListener('mousemove', this.mousemove);
            this.obj.addEventListener('mouseout', this.calculate);
        }
        // Calculate some stuff
        this.calculate();
        
        // Draw
        //this.draw();
    }
    mousemove(e) {
        
        let m_posx = 0, m_posy = 0, e_posx = 0, e_posy = 0;
        //get mouse position on document crossbrowser
        if (!e){e = window.event;}
        if (e.pageX || e.pageY){
            m_posx = e.pageX;
            m_posy = e.pageY;
        } else if (e.clientX || e.clientY){
            m_posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            m_posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        var woppajo = this.obj.offsetParent;
        var tmpObj = this.obj;
        //get parent element position in document
        if (tmpObj.offsetParent){
            do { 
                e_posx += tmpObj.offsetLeft;
                e_posy += tmpObj.offsetTop;
            } while (tmpObj = tmpObj.offsetParent);
        }
        this.calculate(m_posx-e_posx, m_posy-e_posy)
        $('#xC').text(m_posx-e_posx);
        $('#yC').text(m_posy-e_posy);
    }
    calculate(x = null, y = null) {
        // Grid size
        $(this.obj).attr('height', $('#cWrap1').height());
        $(this.obj).attr('width', $('#cWrap1').width());
        this.cWidth = this.obj.width;
        var cHeight = this.obj.height;
        
        
        let min = this.data[0].data[0];
        let max = this.data[0].data[0];
        for (var i=0; i<this.data.length; i++) {
            for (var q=0; q<this.data[i].data.length; q++) {
                if (this.data[i].data[q] < min) {
                    min = this.data[i].data[q];
                }
                if (this.data[i].data[q] > max) {
                    max = this.data[i].data[q];
                }
            }
        }

        this.yAxis = this.getYAxis(min, max, 10);
        this.xColumns = this.data.length;
        this.yColumns = this.yAxis.length - 1;
        
        //this.yAxis
        this.gWidth = this.obj.width - (this.xColumns) - 1 - 50;
        this.gHeight = this.obj.height - (this.yColumns) - 1 - 20;
        var columnHSize = Math.floor(this.gWidth / this.xColumns);
        var columnVSize = Math.floor(this.gHeight / this.yColumns);
        var fWidth = this.cWidth - ((columnHSize * this.xColumns) + this.xColumns + 1);
        var fHeight = cHeight - ((columnVSize * this.yColumns) + this.yColumns + 1);
        var x0 = Math.floor((fWidth / 5) * 4);
        var x1 = this.cWidth - (fWidth - x0);
        var y0 = Math.floor(fHeight / 2);
        var y1 = cHeight - (fHeight - y0);
        this.ctx = this.obj.getContext("2d");
        var imgData = this.ctx.getImageData(0, 0, this.cWidth, cHeight);

        this.mydata = imgData.data;

        var vLines = [];
        var hLines = [];
        
         // Vertical lines
        for (i=0; i<=this.xColumns; i++) {
            var color = 'rgba(0, 0, 0, 0.2)';
            if (i == 0) {
                color =  'rgba(0, 0, 0, 1)';
            }
            vLines.push(
                {
                    x0: (i*(columnHSize + 1)) + x0 + this.pixelCorrection, 
                    y0: y0, 
                    x1: (i*(columnHSize + 1)) + x0 + this.pixelCorrection, 
                    y1: y1 - 1
                }
            );

            if (i==0 || i==this.xColumns) {
                this.ctx.strokeStyle = color;
                this.ctx.beginPath();
                this.ctx.moveTo(vLines[vLines.length - 1].x0, vLines[vLines.length - 1].y0);
                this.ctx.lineTo(vLines[vLines.length - 1].x1, vLines[vLines.length - 1].y1);
                this.ctx.stroke();
                this.ctx.closePath();
            }

        }
        
        // Horizontal lines
        for (i=0; i<=this.yColumns; i++) {
            color = 'rgba(0, 0, 0, 0.2)';
            if (this.yAxis[i] == 0) {
                this.yZeroPos = (i*(columnVSize + 1)) + y0;
                color = 'rgba(0, 0, 0, 1)';
            }
            hLines.push(
                {
                    x0: x0, 
                    y0: (i*(columnVSize + 1)) + y0/* + this.pixelCorrection*/, 
                    x1: x1 - 1, 
                    y1: (i*(columnVSize + 1)) + y0/* + this.pixelCorrection*/
                }
            );

            this._line(
                [
                    {x: hLines[hLines.length - 1].x0, y: hLines[hLines.length - 1].y0},
                    {x: hLines[hLines.length - 1].x1, y: hLines[hLines.length - 1].y1}
                ],
                color
            );

        }
        
        
        //this.ctx.putImageData(imgData, 0, 0);
        this.ctx.font = "12px Courier";

        for (i=0; i<hLines.length; i++) {
            this.ctx.fillText(this.yAxis[i],10,hLines[i].y0 + 5);
        }
        
        var scale = this.yAxis[0] - this.yAxis[this.yAxis.length-1];
        scale = this.gHeight / scale;
        //window.alert(scale);
        
        //var my_gradient=this.ctx.createLinearGradient(0,0,0,170);
            var my_gradient='rgba(255, 165, 0, 0.5)';
            //my_gradient.addColorStop(0,"black");
            //my_gradient.addColorStop(1,"white");
        
        for (var it=0; it<this.data.length; it++) {
            my_gradient='rgba(255, 165, 0, 0.5)';
            if (x != null && y != null){
               /*window.alert(
                    x + ' - ' + 
                   (((it*(columnHSize + 1)) + x0 + 10) + this.pixelCorrection) + ' - ' + 
                   ((it*(columnHSize + 1)) + x0 + 10 + columnHSize - 20 + this.pixelCorrection + 1)
               );*/
                if (
                    x > (((it*(columnHSize + 1)) + x0 + 10) + this.pixelCorrection) &&
                    x < ((it*(columnHSize + 1)) + x0 + 10 + columnHSize - 20 + this.pixelCorrection + 1) && 
                    y > ((this.yZeroPos) + Math.ceil(0-(this.data[it].data[1]) * scale) + this.pixelCorrection - 1) && 
                    y < this.yZeroPos
                ) {
                   my_gradient='rgba(134, 165, 242, 0.5)';
                }
            }
            
            this._square({
                x0: (it*(columnHSize + 1)) + x0 + 10,
                y0: this.yZeroPos,
                x1: columnHSize - 20,
                y1: Math.ceil(0-(this.data[it].data[1]) * scale)
            },
            my_gradient);
            /*this.ctx.fillStyle=my_gradient;
            this.ctx.fillRect(
                (it*(columnHSize + 1)) + x0 + 10,
                this.yZeroPos,
                columnHSize - 20,
                Math.ceil(0-(this.data[it].data[1]) * scale)
            );*/
            //this.ctx.strokeStyle = /*'rgba(255, 165, 0, 1)'*/'rgba(255, 165, 0, 1)';
/*let yZerPosCorrection = (this.data[it].data[1] < 0 ? -1 : 1);
            let lineWidth = 1;
            this._line([
                {x: (it*(columnHSize + 1)) + x0 + 10 - (1 - lineWidth), y: this.yZeroPos-yZerPosCorrection},
                {x: (it*(columnHSize + 1)) + x0 + 10 - (1 - lineWidth), y: this.yZeroPos + Math.ceil(0-(this.data[it].data[1]) * scale) - (1 - lineWidth)}, 
                {x: (it*(columnHSize + 1)) + x0 + 10 + columnHSize - 20, y: this.yZeroPos + Math.ceil(0-(this.data[it].data[1]) * scale) - (1 - lineWidth)},
                {x: (it*(columnHSize + 1)) + x0 + 10 + columnHSize - 20, y: this.yZeroPos - yZerPosCorrection}
            ],'rgba(255, 165, 0, 1)', lineWidth);
            */
        }
        
        // mousemposition crosshsir
        if (x != null && y != null) {
            this._line([{x: x, y: 0}, {x: x, y: y-20}], 'rgba(0, 0, 0, 0.4)');
            this._line([{x: x, y: y+20}, {x: x, y: cHeight}], 'rgba(0, 0, 0, 0.4)');
            this._line([{x: 0, y: y}, {x: x-20, y: y}], 'rgba(0, 0, 0, 0.4)');
            this._line([{x: x+20, y: y}, {x: this.cWidth, y: y}], 'rgba(0, 0, 0, 0.4)');
        }

    }
    
    _square(coords, color, stroke = false) {
        let lineWidth = 2;
        this.ctx.fillStyle=color;
        console.log(coords);
            this.ctx.fillRect(
                coords.x0,
                coords.y0,
                coords.x1,
                coords.y1
            );
        console.log(coords);
        let xL = Math.floor(coords.x0 - lineWidth + (lineWidth / 2)) - 0;
        let xR = coords.x0 + (Math.floor(coords.x1 + lineWidth - (lineWidth / 2)) + 0);
        let yB = coords.y0 - (coords.y1 < 0 ? 1 : - 1);
        let yT = Math.floor(coords.y0 + coords.y1 - lineWidth + (lineWidth / 2)) - 0;
        if (coords.y1 > 0 ) {
            yT = Math.floor(coords.y0 + coords.y1 + lineWidth - (lineWidth / 2)) + 0;
        }
        this._line([
            {x: xL, y: yB},
            {x: xL, y: yT},
            {x: xR, y: yT},
            {x: xR, y: yB}
        ], 'rgba(255, 165, 0, 1)', lineWidth)
    }
    
    _line(coords, color = '#000000', width = 1) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.lineCap = 'square';
        this.ctx.beginPath();
        for (var i=1; i<coords.length; i++) {
            let x0 = coords[i-1].x;
            let x1 = coords[i].x;
            let y0 = coords[i-1].y;
            let y1 = coords[i].y;
            if ((width%2) == 1) {
                y0 += 0.5;
                y1 += 0.5;
                x0 += 0.5;
                x1 += 0.5;
            }
            this.ctx.moveTo(x0, y0);
            this.ctx.lineTo(x1, y1);
        }
        
        this.ctx.stroke();
        this.ctx.closePath();
    }
    
    addEvent(event, fn) {
        window.addEventListener(event, fn);
    }
    
    setSize(e = false) {
        //window.alert(document.getElementById('cWrap1').width);
        this.obj.width = $($(this.obj).parent()).width();
        this.obj.height = $($(this.obj).parent()).height();
        if (e != false) {
            this.draw();
        }
    }
    
    draw() {
        //window.alert(this.woppa);
        //window.addEventListener("resize", this.draw);
        //this.setSize();
    }
    drawGrid() {
        
    }
    
    setPixel(x, y, r, g, b, a) {
            var n = (y * this.cWidth + x) * 4;
            this.mydata[n] = r;
            this.mydata[n + 1] = g;
            this.mydata[n + 2] = b;
            this.mydata[n + 3] = a;
    }
    bline(x0, y0, x1, y1, r, g, b, a) {
        var dx = Math.abs(x1 - x0),
        sx = x0 < x1 ? 1 : -1;
        var dy = Math.abs(y1 - y0),
        sy = y0 < y1 ? 1 : -1;
        var err = (dx > dy ? dx : -dy) / 2;
        while (true) {
            this.setPixel(x0, y0, r, g, b, a);
            if (x0 === x1 && y0 === y1) break;
                var e2 = err;
                if (e2 > -dx) {
                    err -= dy;
                    x0 += sx;
                }
                if (e2 < dy) {
                    err += dx;
                    y0 += sy;
                }
            }
        }
    
    getYAxis(min, max, ticks) {
    var result = [];
    
    if(min == max)
    {
        min = min - 10;   // some small value
        max = max + 10;   // some small value
    }
    // Determine Range
    var range = max - min;
    // Adjust ticks if needed
    if(ticks < 2) {
        ticks = 2;
    } else if(ticks > 2) {
        ticks -= 2;
    }
    // Get raw step value
    var tmpStep = range / ticks;
    // Calculate pretty step value
    var mag = Math.floor(Math.log10(tmpStep));
    var magPow = Math.pow(10,mag);
    var magMsd = Math.floor(tmpStep / magPow + 0.5);
    var stepSize = magMsd * magPow;

    // build Y label array.
    // Lower and upper bounds calculations
    var lb = stepSize * Math.floor(min / stepSize);
    var ub = stepSize * Math.ceil((max / stepSize));
    // Build array
    var val = lb;
    while(1)
    {
        result.push(val);
        val += stepSize;
        if(val > ub) {
            break;
        }
    }
    return result.reverse();
}
    
}

window.onload = function() {
   
    var Chart1 = new MyChart(
        document.getElementById("myCanvas"), 
        [
            {
                'title': 'Column 1',
                'data': [21, 22, 42]
            },
            {
                'title': 'Column 2',
                'data': [150, 200, 25]
            },
            {
                'title': 'Column 3',
                'data': [130, 489, 25]
            },
            {
                'title': 'Column 4',
                'data': [164, 200, 25]
            },
            {
                'title': 'Column 5',
                'data': [101, 200, 25]
            },
            {
                'title': 'Column 6',
                'data': [-91, -50, 20]
            }
        ],
        {scalable: true, interactive: false}
    );
    
};