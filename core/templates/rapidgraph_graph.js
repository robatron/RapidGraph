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
edges.get.all()
...
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
    var grabbedElement = null;  // the currently grabbed element
    var hasMoved = true;        // did the object move between click & release?
    
    var idCounter = 0; // an ID counter so every element may have a unique ID
    
    var currentGraph = this; // a reference to this graph instance
    
    // run init as soon as a graph object is instantiated
    init();

    function init()
    // initialize the graph
    {
        var consoleID = "graph.init: ";
        
        $(document).bind('mousemove', {graph:currentGraph}, function(e)
        // when the mouse moves...
        {
            // if there's a node under the cursor, move all of the selected
            // nodes to follow
            if( grabbedElement && grabbedElement.elementType == "node" ){
                
                grabbedElement.moveTo( e.clientX, e.clientY );
                
                /* move all selected nodes
                var selNodes = e.data.graph.nodes.get.selected();
                for( var i = 0; i<selNodes.length; i++ ){
                    var n = selNodes[i].object;
                    n.translate( e.clientX - n.dx, e.clientY - n.dy );
                    n.dx = e.clientX;
                    n.dy = e.clientY;
                }
                */

                // update the edge paths
                for( var i = 0; i<e.data.graph.edges.get.all().length; i++ )
                    edges[i].update();
                
                // set the hasMoved flag, for the node has moved
                hasMoved = true;
            }
        });
        
        $(surface.canvas).bind('mousedown', {graph:currentGraph}, function(e)
        // when the mouse button is pressed...
        {   
            var consoleID = "graph.surface.mousedown: ";
            
            // if there are no elements under the cursor, deselect everything
            if( !grabbedElement ){
                
                console.log(
                    consoleID+"no elements under cursor. "+
                    "Deselecting everything."
                );
                
                e.data.graph.deselect(  e.data.graph.nodes.get.all() );
                e.data.graph.deselect(  e.data.graph.edges.get.all() );
            }
            
            // draw a selection box
        });
        
        $(document).bind('mouseup', {graph:currentGraph}, function(e)
        // when the mouse button is released...
        {    
            // if there's a grabbed element...
            if( grabbedElement ){
                
                // if the mouse hasn't moved between mouse down and up, toggle 
                // the element's selection
                if( !hasMoved ) grabbedElement.toggleSelect();

                // if the grabbed element is a node and it's out of bounds, 
                // remove it
                if( 
                    grabbedElement.elementType == "node" && 
                    !inBounds( grabbedElement ) 
                )
                    e.data.graph.remove( grabbedElement );
                
                // clear the grabbed element
                grabbedElement = null;
            }
        });
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

    function inBounds( object )
    // returns if the specified Raphael object is in-bounds
    {
        var position = object.getPosition();
        var dimensions = object.getDimensions();
        
        var x = position.x;
        var y = position.y;
        
        var w = -dimensions.width/2;
        var h = -dimensions.height/2;
        
        var W = surface.width - w;
        var H = surface.height - h;
        
        if( x >= w && y >= h && x < W && y < H )
            return true;
            
        return false;
    }

    ///////////////////////
    // ELEMENT FUNCTIONS //
    ///////////////////////
    
    this.clear = function()
    // clear all elements from the graph
    {
        var consoleID = "graph.clear: ";

        console.log(consoleID+"Clearing Raphael surface");
        surface.clear();
        
        console.log(consoleID + "Purging the element sets");
        nodes = [];
        edges = [];
    }

    this.remove = function( elements )
    // remove the specified node, nodes, edge, or edges
    {   
        var consoleID = "graph.remove: ";
        
        // if elements is not an array, make it one (of length 1)
        if( !$.isArray( elements ) ) elements = [elements];
        
        console.log(
            consoleID+"Preparing to remove "+elements.length+" elements"
        );
        
        for( var i = 0; i<elements.length; i++ ){
            
            var e = elements[i];
            var eIndex = getElementIndex(e);
            
            // make sure element exists in one of the element arrays
            if( eIndex != -1 ){
                
                console.log(consoleID+"Removing "+e.elementType+" "+e.id);

                // remove the element from the Raphael surface
                e.remove();

                // if the element is a node, remove it and any edges that may 
                // be attached to it
                if( e.elementType == "node" ){
                    
                    nodes.splice( eIndex, 1 );
                    
                    // remove any edges that may be attached to the node
                    for( var ii = 0; ii<edges.length; ii++ ){
                        if( edges[ii].attachedTo( e ) ){
                            this.remove( edges[ii] );
                            ii--; // since the edge was removed, roll back index
                        }
                    }
                    
                // if the element is an edge, just remove it from the edge list
                } else if( e.elementType == "edge" )
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
        var consoleID = "graph.select: ";
        
        // if elements is not an array, make it one (of length 1)
        if( !$.isArray( elements ) ) elements = [elements];
        
        console.log(
            consoleID+"Preparing to select "+elements.length+" elements."
        );
        
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
    // deselect the specified node, nodes, edge, or edges
    {
        var consoleID = "graph.deselect: ";
        
        // if elements is not an array, make it one (of length 1)
        if( !$.isArray( elements ) ) elements = [elements];
        
        console.log(
            consoleID+"Preparing to deselect "+elements.length+" elements."
        );
        
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
    // functions related to the nodes set
    {
        createNew: function( attr )
        // create a new node
        {            
            var consoleID = "graph.nodes.createNew: ";
            
            console.log(consoleID+"Creating a new node");
            
            var newNode = new node( attr );
            
            console.log(consoleID+"Pushing the new node onto the stack");
            nodes.push( newNode );

            return newNode;   
        },
        
        get: 
        // get functions
        {
            all: function(){ return nodes },
            // return all of the nodes in an array
                
            selected: function()
            // return the selected nodes in an array
            {
                var selected = [];
                for( var i = 0; i<nodes.length; i++ )
                    if( nodes[i].attr.selected )
                        selected.push( nodes[i] );
                return selected;
            },
                
            unselected: function()
            // return the unselected nodes in an array
            {   
                var unselected = [];
                for( var i = 0; i<nodes.length; i++ )
                    if( !nodes[i].attr.selected )
                        selected.push( nodes[i] );
                return unselected;
            }
        }
    };
    
    this.edges = 
    // functions related to the edges set
    {
        createNew: function( attr )
        // create a new edge
        {
            var consoleID = "graph.edges.createNew: ";
            
            console.log(consoleID+"Creating a new edge");
            
            var newEdge = new edge( attr );
            
            console.log(consoleID+"Pushing the new edge onto the stack");
            edges.push( newEdge );
            
            return newEdge;   
        },
        
        get: 
        // get functions
        {
            all: function(){ return edges },
            // return all of the edges in an array
                
            selected: function()
            // return the selected edges in an array
            {
                var selected = [];
                for( var i = 0; i<edges.length; i++ )
                    if( edges[i].attr.selected )
                        selected.push( edges[i] );
                return selected;
            },
                
            unselected: function()
            // return the unselected edges in an array
            {
                var unselected = [];
                for( var i = 0; i<edges.length; i++ )
                    if( !edges[i].attr.selected )
                        selected.push( edges[i] );
                return unselected;
            }
        }
    };
   
    ////////////////////////////
    // NODE OBJECT DEFINITION //
    ////////////////////////////
    
    // a node object
    function node( attr )
    {   
        var consoleID = "graph.node: ";

        // READ-ONLY ATTRIBUTES ------------------------------------------------

        this.id = idCounter++;      // the node's unique ID
        this.elementType = "node";  // the type of this element

        // WRITABLE ATTRIBUTES -------------------------------------------------

        // default attributes
        var defaultAttr = {
            radius:     20,
            x:          surface.width/2,
            y:          surface.height/2,
            label:      null,
            selected:   false,
            fill:       "black",
            stroke:     "white",
            selFill:    "black",
            selStroke:  "red"
        }
        
        // extend the default attributes with the passed-in attributes
        $.extend( defaultAttr, attr );
        
        // make the attributes public
        this.attr = defaultAttr;
        
        // PRIVATE VARIABLES ---------------------------------------------------
        
        var currentNode = this; // capture this node
        var objects = [];       // the node's Raphael objects
        
        // CREATE THE NEW NODE -------------------------------------------------
        
        // create the raphael object
        objects[0] = surface.circle( 
            this.attr.x, 
            this.attr.y, 
            this.attr.radius 
        ).attr({
            fill: this.attr.fill,
            stroke: this.attr.stroke
        });
        
        // change the mouseover cursor to the "move" symbol
        objects[0].node.style.cursor = "move";
        
        // set the mousedown for this new node
        objects[0].mousedown( function(e)
        {            
            // set the grabbed node to this node
            grabbedElement = currentNode;
            
            // set this node's position to the mouse's position (makes movement
            // smoother. Should be fixed, but low priority.)
            //grabbedElement.object.dx = e.clientX;
            //grabbedElement.object.dy = e.clientY;
            
            // prevent the default event action
            e.preventDefault();
            
            // reset the hasMoved flag
            hasMoved = false;
        });
        
        console.log(
            consoleID+"New node %d created at %d, %d", 
            this.id, this.attr.x, this.attr.y
        );
        
        // PUBLIC FUNCTIONS----------------------------------------------------- 
        
        this.moveTo = function( x, y )
        // move this node to the specified coordinates on the Raphael surface
        {
            for( var i = 0; i<objects.length; i++ )
            {
                objects[i].translate( x - objects[i].dx, y - objects[i].dy );
                objects[i].dx = x;
                objects[i].dy = y;
            }
        }
        
        this.getPosition = function()
        // get this node's position on the Raphael surface
        {
            return {
                x: objects[0].attr("cx"),
                y: objects[0].attr("cy")
            };
        }
        
        this.getDimensions = function()
        // get this node's dimensions
        {
            return {
                height: objects[0].getBBox().height,
                width:  objects[0].getBBox().width
            };
        }
        
        this.getBBox = function()
        // return the node's object's bounding box
        {
            return objects[0].getBBox();
        }
        
        this.remove = function()
        // remove this node's objects from the Raphael surface
        {
            for( var i = 0; i<objects.length; i++ )
                objects[i].remove();
        }
        
        this.toggleSelect = function()
        // toggle the selection of this node
        {
            if( this.attr.selected ) 
                this.deselect();
            else 
                this.select();
        }
        
        this.select = function()
        // select this node
        {
            this.attr.selected = true;
            objects[0].attr( "fill", this.attr.selFill );
            objects[0].attr( "stroke", this.attr.selStroke );
            
            console.log(consoleID+"select: Node %d selected", this.id);
        }
        
        this.deselect = function()
        // deselect this node
        {
            this.attr.selected = false;
            objects[0].attr( "fill", this.attr.fill );
            objects[0].attr( "stroke", this.attr.stroke );
            
            console.log(consoleID+"deselect: Node %d deselected", this.id);
        }
        
        // return this newly created node
        return this;
    }

    ////////////////////////////
    // EDGE OBJECT DEFINITION //
    ////////////////////////////

    function edge( attr )
    {
        var consoleID = "graph.edge: ";
        
        // READ-ONLY ATTRIBUTES ------------------------------------------------

        this.id = idCounter++;      // the edge's unique ID
        this.elementType = "edge";  // the type of this element

        // WRITABLE ATTRIBUTES -------------------------------------------------

        // default attributes
        var defaultAttr = {
            node1:      null,
            node2:      null,
            label:      null,
            selected:   false,
            line:       "black",
            bg:         "white",
            selLine:    "black",
            selBg:      "red",
        }
        
        // extend the default attributes with the passed-in attributes
        $.extend( defaultAttr, attr );
        
        // make the attributes public
        this.attr = defaultAttr;
        
        // PRIVATE DATA --------------------------------------------------------
        
        // structure to hold prevous node positions for update need testing
        var prevPos = {
            node1: {
                x: null,
                y: null
            },
            node2: {
                x: null,
                y: null
            }
        }
        
        var currentEdge = this; // capture this edge
        
        objects = [];           // this edge's Raphael objects
        
        // PUBLIC FUNCTIONS ----------------------------------------------------
        
        this.update = function()
        // update the path
        {
            // grab the bounding box of each node's Raphael object
            var bb1 = this.attr.node1.getBBox();
            var bb2 = this.attr.node2.getBBox();
                
            // figure out if the path needs to be updated (if the path object
            // has not yet been defined or the nodes have been moved since the
            // last update)
            if( 
                objects.length == 0 ||
                prevPos.node1.x != bb1.x ||
                prevPos.node1.y != bb1.y ||
                prevPos.node2.x != bb2.x ||
                prevPos.node2.y != bb2.y
            ){
                // calculate the path in relation to the nodes
                var p = [
                    {x: bb1.x + bb1.width / 2,  y: bb1.y - 1},
                    {x: bb1.x + bb1.width / 2,  y: bb1.y + bb1.height + 1},
                    {x: bb1.x - 1,              y: bb1.y + bb1.height / 2},
                    {x: bb1.x + bb1.width + 1,  y: bb1.y + bb1.height / 2},

                    {x: bb2.x + bb2.width / 2,  y: bb2.y - 1},
                    {x: bb2.x + bb2.width / 2,  y: bb2.y + bb2.height + 1},
                    {x: bb2.x - 1,              y: bb2.y + bb2.height / 2},
                    {x: bb2.x + bb2.width + 1,  y: bb2.y + bb2.height / 2}
                ];
                
                var d = {};
                var dis = [];
                
                for( var i = 0; i < 4; i++ )
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
                
                if (dis.length == 0)
                    var res = [0, 4];
                else
                    var res = d[Math.min.apply(Math, dis)];
                
                var x1 = p[res[0]].x;
                var y1 = p[res[0]].y;
                var x4 = p[res[1]].x;
                var y4 = p[res[1]].y;
                var dx = Math.max(Math.abs(x1 - x4) / 2, 10);
                var dy = Math.max(Math.abs(y1 - y4) / 2, 10);
                var x2 = [x1, x1, x1-dx, x1+ dx][res[0]].toFixed(3);
                var y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3);
                var x3 = [0, 0, 0, 0, x4, x4, x4-dx, x4+dx][res[1]].toFixed(3);
                var y3 = [0, 0, 0, 0, y1+dy, y1-dy, y4, y4][res[1]].toFixed(3);
                
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
                
                // if the objects are already defined, just update the path
                if( objects[0] && objects[1] ){
                    
                    objects[0].attr({ path: path });
                    objects[1].attr({ path: path });
                    
                // otherwise, create the new path objects
                } else {
                    
                    console.log(
                        "%sCreating new edge %d from node %d to node %d",
                        consoleID, this.id, this.attr.node1.id, 
                        this.attr.node2.id
                    );
                    
                    objects[1] = surface.path( path ).attr({
                        stroke: this.attr.line,
                        'stroke-width': 2
                    }).toBack(); // move to back so they're behind the nodes
                    
                    objects[0] = surface.path( path ).attr({
                        stroke: this.attr.bg,
                        'stroke-width': 4
                    }).toBack();
                }
                
                // save the node positions for the next update
                prevPos.node1.x = bb1.x;
                prevPos.node1.y = bb1.y;
                prevPos.node2.x = bb2.x;
                prevPos.node2.y = bb2.y;
            }
        } 
        
        this.attachedTo = function( node )
        // returns true if the specified node is attached to this edge, and
        // false if it is not.
        {
            if( this.attr.node1 == node || this.attr.node2 == node )
                return true;
            return false
        }

        this.remove = function()
        // removes this edge from the Raphael surface
        {
            for( var i = 0; i<objects.length; i++ )
                objects[i].remove();
        }
        
        this.toggleSelect = function()
        // toggle the selection of this edge
        {
            if( this.attr.selected ) 
                this.deselect();
            else 
                this.select();
        }
        
        this.select = function()
        // select this edge
        {
            this.attr.selected = true;
            objects[0].attr( "stroke", this.attr.selBg );
            objects[1].attr( "stroke", this.attr.selLine );
            
            console.log(consoleID+"Edge %d selected", this.id);
        }
        
        this.deselect = function()
        // deselect this node
        {
            this.attr.selected = false;
            objects[0].attr( "stroke", this.attr.bg );
            objects[1].attr( "stroke", this.attr.line );
            
            console.log(consoleID+"Edge %d deselected", this.id);
        }

        // INITIALIZE ----------------------------------------------------------
        
        // update on new edge initialization
        this.update();
        
        // set the mousedown for this new edge
        for( var i = 0; i<objects.length; i++ )
            objects[i].mousedown( function(e){ holdEdge(e) });
        function holdEdge( e )
        {
            // set the grabbed node to this node
            grabbedElement = currentEdge;
            
            // prevent the default event action
            e.preventDefault();
            
            // reset the hasMoved flag
            hasMoved = false;
        }
        
        // return the newly created edge
        return this;
    };
}
