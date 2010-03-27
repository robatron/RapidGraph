// rapidgraph_graph.js
// depends on jQuery and Raphael

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
    
    var idCounter = 0; // an ID counter so every element may have a unique ID
    
    // run init as soon as a graph object is instantiated
    init();
    
    //////////.////////////////
    // WHOLE GRAPH FUNCTIONS //
    ///////////////////////////
    
    function init()
    // initialize the graph
    {
        var consoleID = "rapidgraph_graph: init: ";
        
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
            /* Create a new node if the background is clicked.
            if( !grabbedNodeObj ){
                
                var x = e.clientX - offset.x;
                var y = e.clientY - offset.y;
                
                grabbedNodeObj = new node({x:x, y:y}).object;
            }
            */
        };
        
        surface.canvas.onmouseup = function()
        // if the mouse button is lifted, clear any grabbed nodes
        {            
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
        };
    }
    
    this.clear = function()
    // clear all elements from the graph
    {
        var consoleID = "rapidgraph_graph: clear: ";

        console.log(consoleID+"Clearing Raphael surface");
        surface.clear();
        
        console.log(consoleID + "Purging the element sets");
        nodes = [];
        edges = [];
    }

    //////////////////////////////
    // PRIVATE HELPER FUNCTIONS //
    //////////////////////////////
    
    function getElementIndex( element )
    // find the index of the element in the nodes or edges array. If the element
    // was not found in either array, return a -1
    {
        // try to find the element in the nodes array
        for( var i = 0; i<nodes.length; i++ ) 
            if( element == nodes[i] ) 
                return i;
            
        // if the element wasn't found in the nodes array, try to find it in the
        // edges array
        for( var i = 0; i<edges.length; i++ )
            if( element == edges[i] )
                return i;
                
        // if the element wasn't found in either array, return -1
        return -1;
    }

    ///////////////////////
    // ELEMENT FUNCTIONS //
    ///////////////////////

    this.remove = function( elements )
    // remove the specified node, nodes, edge, or edges
    {   
        var consoleID = "rapidgraph_graph: remove: ";
        
        // if elements is not an array, make it one (of length 1)
        if( !$.isArray( elements ) ){
            console.log(consoleID+"A single element recieved.");
            elements = [elements];
        }
        
        console.log(consoleID+"Element set size = "+elements.length);
        
        for( var i = 0; i<elements.length; i++ ){
            
            var e = elements[i];
            var eIndex = getElementIndex(e);
            
            // make sure element exists in one of the element arrays
            if( eIndex != -1 ){
                
                console.log(consoleID+"Removing element "+e.id);
                
                // remove the element's object from the Raphael surface
                e.object.remove();
                
                // remove the element from it's array
                if( e.elementType == "node" )
                    nodes.splice( eIndex, 1 );
                    
                else if( e.elementType == "edge" )
                    edges.splice( eIndex, 1 );
                    
                else
                    console.error(consoleID+
                        "Recieved unexpected element type: "+e.elementType
                    );
            
            // otherwise, the element was not found. Error out.
            } else
                console.error(
                    consoleID+"Element not found in either element arrays."
                );
        }
    };
    
    this.select = function( elements )
    // select the specified node, nodes, edge, or edges
    {
        var consoleID = "rapidgraph_graph: select: ";
        
        // if elements is not an array, make it one (of length 1)
        if( !$.isArray( elements ) ){
            console.log(consoleID+"A single element recieved.");
            elements = [elements];
        }
        
        console.log(consoleID+"Element set size = "+elements.length);
        
        for( var i = 0; i<elements.length; i++ ){           
            
            // make sure element exists in one of the element arrays
            if( getElementIndex(elements[i]) != -1 )
                elements[i].select();
                
            // otherwise, the element was not found. Error out.
            else
                console.error(
                    consoleID+"Element not found in element arrays."
                );
        }
    };
    
    this.deselect = function( elements )
    // deselectthe specified node, nodes, edge, or edges
    {
        var consoleID = "rapidgraph_graph: deselect: ";
        
        // if elements is not an array, make it one (of length 1)
        if( !$.isArray( elements ) ){
            console.log(consoleID+"A single element recieved.");
            elements = [elements];
        }
        
        console.log(consoleID+"Element set size = "+elements.length);
        
        for( var i = 0; i<elements.length; i++ ){           
            
            // make sure element exists in one of the element arrays
            if( getElementIndex(elements[i]) != -1 )
                elements[i].deselect();
                
            // otherwise, the element was not found. Error out.
            else
                console.error(
                    consoleID+"Element not found in element arrays."
                );
        }
    };
    
    ////////////////////////////
    // ELEMENT SETS FUNCTIONS //
    ////////////////////////////
    
    this.nodes = 
    {
        createNew: function( attr )
        // create a new node
        {            
            var consoleID = "rapidgraph_graph: nodes: createNew: ";
            
            console.log(consoleID+
                "Creating a new node with the specified attributes"
            );
            var newNode = new node( attr );
            
            console.log(consoleID+"Pushing the new node onto the stack");
            nodes.push( newNode );
            
            console.log(consoleID+"Returning with the new node");
            return newNode;   
        },
        
        getAll: function()
        // return all of the nodes in an array
        {
            var consoleID = "rapidgraph_graph: nodes: getAll: ";
            console.log(consoleID+"Returning all nodes");
            return nodes;
        },
            
        getSelected: function()
        // return the selected nodes in an array
        {
            var consoleID = "rapidgraph_graph: nodes: getSelected: ";
            console.log(consoleID+"Returning selected nodes");
            
            var selected = [];
            
            for( var i = 0; i<nodes.length; i++ )
                if( nodes[i].attr.selected )
                    selected.push( nodes[i] );
                    
            return selected;
        },
            
        getUnselected: function()
        // return the unselected nodes in an array
        {
            var consoleID = "rapidgraph_graph: nodes: getUnselected: ";
            console.log(consoleID+"Returning deselected nodes");
            
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
        var consoleID = "rapidgraph_graph: node: ";

        // READ-ONLY ATTRIBUTES ------------------------------------------------

        this.id = idCounter++;      // the node's unique ID
        this.elementType = "node";  // the type of this element

        // WRITABLE ATTRIBUTES -------------------------------------------------

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
            consoleID+"New node %d created at %d, %d", 
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
            
            console.log(consoleID+"select: Node %d selected", this.id);
        }
        
        this.deselect = function()
        // deselect this node
        {
            this.attr.selected = false;
            this.object.attr( "fill", this.attr.fill );
            this.object.attr( "stroke", this.attr.stroke );
            
            console.log(consoleID+"deselect: Node %d deselected", this.id);
        }
        
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
