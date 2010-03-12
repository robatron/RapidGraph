// core.js

function core()
{
    this.preload = function()
    {
        Raphael.fn.connection = function( obj1, obj2, line, bg ) 
        {
            if( obj1.line && obj1.from && obj1.to ){
                line = obj1;
                obj1 = line.from;
                obj2 = line.to;
            }
            
            var bb1 = obj1.getBBox();
            var bb2 = obj2.getBBox();
            
            var p = [
                {x: bb1.x + bb1.width / 2, y: bb1.y - 1},
                {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
                {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
                {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
                {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
                {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
                {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
                {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}
            ];
            
            var d = {};
            var dis = [];
            
            for (var i = 0; i < 4; i++) {
                for (var j = 4; j < 8; j++) {
                    var dx = Math.abs(p[i].x - p[j].x),
                        dy = Math.abs(p[i].y - p[j].y);
                    if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                        dis.push(dx + dy);
                        d[dis[dis.length - 1]] = [i, j];
                    }
                }
            }
            
            if (dis.length == 0) {
            
                var res = [0, 4];
            
            } else {
            
                var res = d[Math.min.apply(Math, dis)];
            }
            
            var x1 = p[res[0]].x;
            var y1 = p[res[0]].y;
            var x4 = p[res[1]].x;
            var y4 = p[res[1]].y;
            var dx = Math.max(Math.abs(x1 - x4) / 2, 10);
            var dy = Math.max(Math.abs(y1 - y4) / 2, 10);
            var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3);
            var y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3);
            var x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3);
            var y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
            
            var path = [
                "M", x1.toFixed(3), 
                y1.toFixed(3), 
                "C", 
                x2, 
                y2, 
                x3, 
                y3, 
                x4.toFixed(3), 
                y4.toFixed(3)
            ].join(",");
            
            if (line && line.line) {
            
                line.bg && line.bg.attr({path: path});
                line.line.attr({path: path});
            
            } else {
            
                var color = null;
                if( typeof(line) == "string" ) color = line;
                else color = "#000";
            
                return {
                    bg: 
                        bg && 
                        bg.split && 
                        this.path(path).attr({
                            stroke: bg.split("|")[0], 
                            fill: "none", 
                            "stroke-width": bg.split("|")[1] || 3
                        }),
                    line: this.path(path).attr({stroke: color, fill: "none"}),
                    from: obj1,
                    to: obj2
                };
            }
        };
    }
    
    this.main = function()
    {
        var el;
        var isDrag = false;
        
        var dragger = function(e) 
        {
            this.dx = e.clientX;
            this.dy = e.clientY;
            isDrag = this;
            this.animate({"fill-opacity": .2}, 500);
            e.preventDefault && e.preventDefault();
        };
        
        // create a new raphael SVG in the "workspace" div
        var r = Raphael("workspace", 640, 480);
        
        var connections = new Array();
        
        var shapes = [
            r.circle(190, 100, 30),
            r.circle(290, 80, 30),
            r.circle(290, 180, 30),
            r.circle(450, 100, 30)
        ];
                    
        for( var i = 0; i < shapes.length; i++ ){
            
            var color = "green" //Raphael.getColor();
            
            shapes[i].attr({
                
                fill: color, 
                stroke: color, 
                "fill-opacity": 0, 
                "stroke-width": 2
            });
            
            shapes[i].node.style.cursor = "move";
            
            shapes[i].mousedown(dragger);
        }
        
        var edgeFG = "black";
        var edgeBG = "white";
        
        connections.push(r.connection(shapes[0], shapes[1], edgeFG, edgeBG));
        connections.push(r.connection(shapes[1], shapes[2], edgeFG, edgeBG));
        connections.push(r.connection(shapes[1], shapes[3], edgeFG, edgeBG));        
        
        $(document).mousemove( function( e )
        {
            e = e || window.event;
            
            if( isDrag ){
                
                isDrag.translate(e.clientX - isDrag.dx, e.clientY - isDrag.dy);
                
                for( var i = connections.length; i--; ) {
                
                    r.connection(connections[i]);
                }
                
                r.safari();
                
                isDrag.dx = e.clientX;
                isDrag.dy = e.clientY;
            }
        });
        
        $(document).mouseup( function()
        {
            isDrag && isDrag.animate({"fill-opacity": 0}, 500);
            isDrag = false;
        });
    }
    
} core = new core();
