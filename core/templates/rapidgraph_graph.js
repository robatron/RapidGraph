// rapidgraph_graph.js

/*
the following functions take a one node or edge, or an array of nodes or edges
remove()
select()
deselect()

nodes.createNew()
nodes.get.all()
nodes.get.selected()
nodes.get.unselected()

edges.createNew()
edges.get.all
*/

function rapidgraph_graph( surface )
{    
    ////////////////
    // GRAPH DATA //
    ////////////////
    
    // nodes and edges arrays
    var nodes = [];    // an array of the nodes
    var edges = [];    // an array of the edges
    
    // mouse handling data
    var grabbedNodeObj = null;  // the currently grabbed node Raphael object
    var hasMoved = true;        // did the object move between click & release?
    
    var idCounter = 0; // an ID counter so every object may have a unique ID
    
    /* grab the surface offset values. (For some reason the .offset() values
    // of the surface canvas change after each call)
    var offset = {
        x: $(surface.canvas).offset().left,
        y: $(surface.canvas).offset().top
    };
    */
    
    // run init as soon as a graph object is instantiated
    init();
    
    //////////.////////////////
    // WHOLE GRAPH FUNCTIONS //
    ///////////////////////////
    
    function init()
    // initialize the graph
    {
        console.group("graph.init()");
        
        surface.canvas.onmousemove = function(e)
        // if there's currently a grabbed node, move it to the mouse's position
        {                     
            if( grabbedNodeObj ){
                
                var n = grabbedNodeObj;
                n.translate( e.clientX - n.dx, e.clientY - n.dy );
                n.dx = e.clientX;
                n.dy = e.clientY;
                
                // set the hasMoved flag, for the node has moved
                hasMoved = true;
            }
        };
        
        surface.canvas.onmousedown = function( e )
        // if no node is under the pointer, make a new node
        {
            //console.group("surface.onmousedown");
            
            /*
            if( !grabbedNodeObj ){
                
                var x = e.clientX - offset.x;
                var y = e.clientY - offset.y;
                
                grabbedNodeObj = new node({x:x, y:y}).object;
            }
            */
            
            //console.groupEnd();
        };
        
        surface.canvas.onmouseup = function()
        // if the mouse button is lifted, clear any grabbed nodes
        { 
            //console.group("surface.onmouseup");
            
            // if the mouse hasn't moved between mouse down and up, and the
            // cursor is over a node, toggle its selection
            if( grabbedNodeObj && !hasMoved )
                $(grabbedNodeObj).data("node").toggleSelect();
                
            // if there are no nodes under the cursor, deselect everything
            if( !grabbedNodeObj ){
                // deselect all nodes
            }
            
            // clear the grabbed node
            grabbedNodeObj = null;
            
            //console.groupEnd();
        };
        
        console.groupEnd();
    }
    
    this.clear = function()
    // clear all elements from the graph
    {
        console.group("graph.clear()");

        console.log("clearing Raphael surface");
        surface.clear();
        
        console.log("purging the nodes set");
        nodes = [];
        
        console.groupEnd();
    }

    ///////////////////////
    // ELEMENT FUNCTIONS //
    ///////////////////////

    this.remove = function( element )
    // remove the specified node, nodes, edge, or edges
    {
    };
    
    this.select = function()
    // select the specified node, nodes, edge, or edges
    {
    };
    
    this.deselect = function()
    // deselectthe specified node, nodes, edge, or edges
    {
    };
    
    ////////////////////////////
    // ELEMENT SETS FUNCTIONS //
    ////////////////////////////
    
    this.nodes = 
    {
        createNew: function( attr )
        // create a new node
        {            
            console.log("nodes.createNew");
            
            // create the new node with the specified attributes
            var newNode = new node( attr );
            
            // push the new node onto the nodes stack
            nodes.push( newNode );
            
            // return the new node
            return newNode;   
        },
        
        getAll: function()
        // return all of the nodes in an array
        {
            console.log("fetching all of the nodes");
            return nodes;
        },
            
        getSelected: function()
        // return the selected nodes in an array
        {
            console.log("fetching the selected nodes");
            
            var selected = [];
            
            for( var i = 0; i<nodes.length; i++ )
                if( nodes[i].attr.selected )
                    selected.push( nodes[i] );
                    
            return selected;
        },
            
        getUnselected: function()
        // return the unselected nodes in an array
        {
            console.log("fetching the unselected nodes");
            
            var unselected = [];
            
            for( var i = 0; i<nodes.length; i++ )
                if( !nodes[i].attr.selected )
                    selected.push( nodes[i] );
                    
            return unselected;
        }
    };
    
    ////////////////////////////
    // NODE OBJECT DEFINITION //
    ////////////////////////////
    
    // a node object
    function node( attr )
    {   
        console.group("graph.node");

        // NODE ATTRIBUTES -----------------------------------------------------

        // default attributes
        var defaultAttr = {
            radius:     20,
            x:          surface.width/2,
            y:          surface.height/2,
            selected:   false,
            label:      null,
            fill:       "black",
            stroke:     "white",
            selFill:    "black",
            selStroke:  "red"
        }
        
        // extend the default attributes with the passed-in attributes
        $.extend( defaultAttr, attr );
        
        // make the attributes public
        this.attr = defaultAttr;
        
        // CREATE THE NEW NODE -------------------------------------------------
        
        // give this new node a unique ID
        this.id = idCounter;
        idCounter++;
        
        // create the raphael object
        this.object = surface.circle( 
            this.attr.x, 
            this.attr.y, 
            this.attr.radius 
        ).attr({
            fill: this.attr.fill,
            stroke: this.attr.stroke
        }); 
        
        // attach this node to the Raphael object
        $(this.object).data("node", this);
        
        // change the mouseover cursor to the "move" symbol
        this.object.node.style.cursor = "move";
        
        // set the mousedown for this new node
        this.object.mousedown( function(e)
        {            
            // set the grabbed node to this node
            grabbedNodeObj = this;
            
            // set this node's position to the mouse's position
            grabbedNodeObj.dx = e.clientX;
            grabbedNodeObj.dy = e.clientY;
            
            // prevent the default event action
            e.preventDefault();
            
            // reset the hasMoved flag
            hasMoved = false;
        });
        
        console.log( 
            "new node %d created at %d, %d", 
            this.id, this.attr.x, this.attr.y
        );
        
        // SELECTION ----------------------------------------------------------- 
        
        this.toggleSelect = function()
        // toggle the selection of this node
        {
            if( this.attr.selected ) this.deselect();
            else this.select();
        }
        
        this.select = function()
        // select this node
        {
            this.attr.selected = true;
            this.object.attr( "fill", this.attr.selFill );
            this.object.attr( "stroke", this.attr.selStroke );
            
            console.log("node %d selected", this.id);
        }
        
        this.deselect = function()
        // deselect this node
        {
            this.attr.selected = false;
            this.object.attr( "fill", this.attr.fill );
            this.object.attr( "stroke", this.attr.stroke );
            
            console.log("node %d deselected", this.id);
        }
        
        console.groupEnd();
        
        // return this newly created node
        return this;
    }

    ////////////////////////////
    // EDGE OBJECT DEFINITION //
    ////////////////////////////

    function edge( obj1, obj2, line, bg ) 
    {
        // prevent self-connections
        //if( obj1 == obj2 ) return -1;
        
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
        
        for( var i = 0; i < 4; i++ ){
            
            for( var j = 4; j < 8; j++ ){
                
                var dx = Math.abs(p[i].x - p[j].x);
                var dy = Math.abs(p[i].y - p[j].y);
                
                if( (i == j - 4) 
                    || (((i != 3 && j != 6) || p[i].x < p[j].x) 
                    && ((i != 2 && j != 7) || p[i].x > p[j].x) 
                    && ((i != 0 && j != 5) || p[i].y > p[j].y) 
                    && ((i != 1 && j != 4) || p[i].y < p[j].y))){
                        
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
                    surface.path(path).attr({
                        stroke: bg.split("|")[0], 
                        fill: "none", 
                        "stroke-width": bg.split("|")[1] || 3
                    }),
                line: surface.path(path).attr({stroke: color, fill: "none"}),
                from: obj1,
                to: obj2
            };
        }
    };
}
