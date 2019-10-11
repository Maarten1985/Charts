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
        this.config = config;
        // Bind methods
        this.setSize = this.setSize.bind(this);
        this.draw = this.draw.bind(this);
        this.drawGrid = this.drawGrid.bind(this);
        this.addEvent = this.addEvent.bind(this);
        this.setPixel = this.setPixel.bind(this);
        this.bline = this.bline.bind(this);
        this.getYAxis = this.getYAxis.bind(this);
        this.calculate = this.calculate.bind(this);
        this.mousemove = this.mousemove.bind(this);
        // Check config
        if(typeof config.scalable == "undefined" || config.scalable == true) {
            this.addEvent('resize', this.calculate);
        }
        window.alert(typeof config.static);
        if(typeof config.static == "undefined" || config.static == false) {
            window.alert('dingie');
            this.addEvent('mousemove', this.mousemove);
        }
        // Calculate some stuff
        this.calculate();
        
        // Draw
        this.draw();
    }
    
    mousemove(e) {
        window.alert();
    }
    
    calculate() {
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
        
        // Calculate ceil
        /*var mx = max;
        let len = Math.pow(10, Math.floor(Math.log10(mx)));
        mx = Math.ceil(mx / len) * len;*/
        //window.alert(mx);
        
        // Calculate floor
        /*var positive = true;
        if (min<0) {positive = false;}
        let mn = Math.abs(min);
        if (positive) {
            len = Math.pow(10, Math.floor(Math.log10(mn)));
            mn = Math.floor(mn / len) * len;
            if (mn > 0) mn = 0;
        } else {
            len = Math.pow(10, Math.floor(Math.log10(mn)));
            mn = Math.ceil(mn / len) * len;
            mn = mn - (mn*2);
        }*/
        //window.alert(mn);
        
        
        
        /*let woppa = mx - mn;
        woppa = woppa / this.yColumns;
        len = Math.pow(10, Math.floor(Math.log10(woppa)));
        woppa = Math.ceil(woppa / len) * len;*/
        
        /*window.alert(woppa);*/
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
        //var c=document.getElementById("myCanvas");
        var ctx = this.obj.getContext("2d");
        var imgData = ctx.getImageData(0, 0, this.cWidth, cHeight);

        this.mydata = imgData.data;

        var vLines = [];
        var hLines = [];
        
         // Vertical lines
        for (i=0; i<=this.xColumns; i++) {
            var color = {r: 0, g: 0, b: 0, a: 50}
            if (i == 0) {
                color.a = 100;
            }
            vLines.push({x0: (i*(columnHSize + 1)) + x0, y0: y0, x1: (i*(columnHSize + 1)) + x0, y1: y1 - 1});
            //if (x != null && y != null) {
            //    if (Math.abs(x - ((i*(columnHSize + 1)) + x0)) <= 10) //{
            //        color.r = 255;
            //        color.a = 100;
            //    }
            //}
            this.bline(
                (i*(columnHSize + 1)) + x0,
                y0,
                (i*(columnHSize + 1)) + x0,
                y1 - 1,
                color.r, color.g, color.b, color.a
            );
        }
        
        // Horizontal lines
        for (i=0; i<=this.yColumns; i++) {
            var color = {r: 0, g: 0, b: 0, a: 50}
            if (this.yAxis[i] == 0) {
                color.a = 100;
            }
            hLines.push({x0: x0, y0: (i*(columnVSize + 1)) + y0, x1: x1 - 1, y1: (i*(columnVSize + 1)) + y0});
            //if (x != null && y != null) {
            //    if (Math.abs(y - ((i*(columnVSize + 1)) + y0)) <= 10) //{
            //        color.r = 255;
            //        color.a = 100;
            //    }
            //}
            this.bline(
                x0,
                (i*(columnVSize + 1)) + y0,
                x1 - 1,
                (i*(columnVSize + 1)) + y0,
                color.r, color.g, color.b, color.a
            );
        }
        
        ctx.putImageData(imgData, 0, 0);
        ctx.font = "12px Courier";

        for (i=0; i<hLines.length; i++) {
            ctx.fillText(this.yAxis[i],10,hLines[i].y0 + 5);
        }
        
        //for (ii=0; ii<this.data.length; ii++) {
        //    for (var qq=0; qq<this.data[ii].length; qq++) {
                //ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.fillRect(20,20,150,100);
                //ctx.stroke();
                //ctx.closePath();
       //     }
       // }
        
//        var total = Math.abs(min) + Math.abs(max);
  //      let len = Math.pow(10, (Math.ceil(Math.log10(total + 1)) - 1));
    //    total = Math.ceil(total/len)*len;
      //  window.alert(
        //total);

        //let total = Math.abs(min) + Math.abs(max);
        //let variable = Math.ceil(max / len) * len;
        //window.alert(variable)
        
        //window.alert(min);
        //window.alert(max);
        //indow.alert(this.xColumns);
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
        document.getElementById("myCanvas1"), 
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
                'data': [150, 489, 25]
            },
            {
                'title': 'Column 4',
                'data': [150, 200, 25]
            },
            {
                'title': 'Column 5',
                'data': [150, 200, 25]
            },
            {
                'title': 'Column 6',
                'data': [-91, -50, 20]
            }
        ],
        {scalable: true}
    );
    
    var wrapper = document.getElementById("cWrap");
    /*wrapper.onresize(function() {
        draw();
    });*/
    window.addEventListener("resize", draw);
    cnv = document.getElementById("myCanvas");
    cnv.addEventListener("mousemove", handlemouse);
    cnv.addEventListener("mouseout", draw);
    function handlemouse(e) {
        onMousemove(e);
    }
    
    draw();
    function draw(x = null, y = null) {
                var obj = document.getElementById("myCanvas");
        $(obj).attr('height', $('#cWrap').height());
        $(obj).attr('width', $('#cWrap').width());
        var cWidth = obj.width;
        var cHeight = obj.height;
       // window.alert(cHeight);

        var gWidth = cWidth - 31;
        var gHeight = cHeight - 31;
        var columns = 10;
        var columnHSize = Math.floor(gWidth / columns);
        var columnVSize = Math.floor(gHeight / columns);
        var fWidth = cWidth - ((columnHSize * 10) + 11);
        var fHeight = cHeight - ((columnVSize * 10) + 11);
        var x0 = Math.floor(fWidth / 2);
        var x1 = cWidth - (fWidth - x0);
        var y0 = Math.floor(fHeight / 2);
        var y1 = cHeight - (fHeight - y0);
        //var c=document.getElementById("myCanvas");
        var ctx = obj.getContext("2d");
        var imgData = ctx.getImageData(0, 0, cWidth, cHeight);

        var data = imgData.data;

        var vLines = [];
        var hLines = [];
        
        // Vertical lines
        for (i=0; i<=columns; i++) {
            var color = {r: 0, g: 0, b: 0, a: 50}
            vLines.push({x0: (i*(columnHSize + 1)) + x0, y0: y0, x1: (i*(columnHSize + 1)) + x0, y1: y1 - 1});
            if (x != null && y != null) {
                if (Math.abs(x - ((i*(columnHSize + 1)) + x0)) <= 10) {
                    color.r = 255;
                    color.a = 100;
                }
            }
            bline(
                (i*(columnHSize + 1)) + x0,
                y0,
                (i*(columnHSize + 1)) + x0,
                y1 - 1,
                color.r, color.g, color.b, color.a
            );
        }
        // Horizontal lines
        for (i=0; i<=columns; i++) {
            var color = {r: 0, g: 0, b: 0, a: 50}
            hLines.push({x0: x0, y0: (i*(columnVSize + 1)) + y0, x1: x1 - 1, y1: (i*(columnVSize + 1)) + y0});
            if (x != null && y != null) {
                if (Math.abs(y - ((i*(columnVSize + 1)) + y0)) <= 10) {
                    color.r = 255;
                    color.a = 100;
                }
            }
            bline(
                x0,
                (i*(columnVSize + 1)) + y0,
                x1 - 1,
                (i*(columnVSize + 1)) + y0,
                color.r, color.g, color.b, color.a
            );
        }
        
        if (x != null && y != null) {
            bline(
                x,
                0,
                x,
                y - 20,
                0,0,0,100
            );
            bline(
                x,
                y + 20,
                x,
                cHeight,
                0,0,0,100
            );
            bline(
                0,
                y,
                x - 20,
                y,
                0,0,0,100
            );
            bline(
                x + 20,
                y,
                cWidth,
                y,
                0,0,0,100
            );
        }
        
        // Set inage data
        ctx.putImageData(imgData, 0, 0);

        
        
        function setPixel(x, y, r, g, b, a) {
            var n = (y * cWidth + x) * 4;
            data[n] = r;
            data[n + 1] = g;
            data[n + 2] = b;
            data[n + 3] = a;
        }
        function bline(x0, y0, x1, y1, r, g, b, a) {
            var dx = Math.abs(x1 - x0),
                sx = x0 < x1 ? 1 : -1;
            var dy = Math.abs(y1 - y0),
                sy = y0 < y1 ? 1 : -1;
            var err = (dx > dy ? dx : -dy) / 2;
            while (true) {
                setPixel(x0, y0, r, g, b, a);
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

       //var width = ;
       //window.alert(document.getElementById("myCanvas").offsetWidth);
    };
    
    function onMousemove(e){
    var m_posx = 0, m_posy = 0, e_posx = 0, e_posy = 0,
           obj = document.getElementById("myCanvas");
    //get mouse position on document crossbrowser
    if (!e){e = window.event;}
    if (e.pageX || e.pageY){
        m_posx = e.pageX;
        m_posy = e.pageY;
    } else if (e.clientX || e.clientY){
        m_posx = e.clientX + document.body.scrollLeft
                 + document.documentElement.scrollLeft;
        m_posy = e.clientY + document.body.scrollTop
                 + document.documentElement.scrollTop;
    }
    //get parent element position in document
    if (obj.offsetParent){
        do { 
            e_posx += obj.offsetLeft;
            e_posy += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
        draw(m_posx-e_posx, m_posy-e_posy)
        $('#xC').text(m_posx-e_posx);
        $('#yC').text(m_posy-e_posy);
    // mouse position minus elm position is mouseposition relative to element:

}
    
};