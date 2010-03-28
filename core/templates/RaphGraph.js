// RaphGraph - A general graph (as in graph theory) library for Raphael

/* Sketchpad. Please ignore the following.

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

function RaphGraph( surface )
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
    
                // also move selected nodes with it (need to fix, but low
                // priority
                /*
                var selNodes = e.data.graph.nodes.get.selected();
                for( var i = 0; i<selNodes.length; i++ ){
                    var pos = selNodes[i].getPosition();
                    console.log( e.clientX - pos.x, e.clientY - pos.y );
                    selNodes[i].moveTo( e.clientX - pos.x, e.clientY - pos.y );
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
                    if( nodes[i].isSelected() )
                        selected.push( nodes[i] );
                return selected;
            },
                
            unselected: function()
            // return the unselected nodes in an array
            {   
                var unselected = [];
                for( var i = 0; i<nodes.length; i++ )
                    if( !nodes[i].isSelected() )
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
                    if( edges[i].isSelected() )
                        selected.push( edges[i] );
                return selected;
            },
                
            unselected: function()
            // return the unselected edges in an array
            {
                var unselected = [];
                for( var i = 0; i<edges.length; i++ )
                    if( !edges[i].isSelected() )
                        selected.push( edges[i] );
                return unselected;
            }
        }
    };
    
    ////////////////////////////
    // NODE OBJECT DEFINITION //
    ////////////////////////////
    
    function node( attr )
    {   
        var consoleID = "graph.node: ";

        // READ-ONLY ATTRIBUTES ------------------------------------------------

        this.id = idCounter++;      // the node's unique ID
        this.elementType = "node";  // the type of this element

        // INITIAL ATTRIBUTES --------------------------------------------------

        // default attributes
        var defaultAttr = {
            radius:     20,
            x:          surface.width/2,
            y:          surface.height/2,
            weight:     1,
            weightVis:  true,
            label:      "Node " + this.id,
            labelVis:   true,
            selected:   false,
            fill:       "black",
            stroke:     "white",
            selFill:    "black",
            selStroke:  "red"
        }
        
        // extend the default attributes with the passed-in attributes
        var attr = $.extend( defaultAttr, attr );
        
        // PRIVATE VARIABLES ---------------------------------------------------
        
        var currentNode = this; // capture this node
        var objects = [];       // the node's Raphael objects
        var obj = {
            main: null,         // the main object
            weight: null,       // the weight object
            label: null         // the label object
        };
        
        // POSITION AND SIZE --------------------------------------------------- 
        
        this.moveTo = function( x, y )
        // move this node to the specified coordinates on the Raphael surface
        {
            for( var i = 0; i<objects.length; i++ )
                objects[i].translate( x - obj.main.dx, y - obj.main.dy );
            
            obj.main.dx = x;
            obj.main.dy = y;
        }
        
        this.getPosition = function()
        // get this node's position on the Raphael surface
        {
            return {
                x: obj.main.attr("cx"),
                y: obj.main.attr("cy")
            };
        }
        
        this.getDimensions = function()
        // get this node's dimensions
        {
            return {
                height: obj.main.getBBox().height,
                width:  obj.main.getBBox().width
            };
        }
        
        this.getBBox = function()
        // return the node's object's bounding box
        {
            return obj.main.getBBox();
        }
        
        // WEIGHT --------------------------------------------------------------
        
        this.weight = 
        {
            get: function(){ return attr.weight },
            // return the weight
            
            set: function( weight )
            // set the weight
            {   
                attr.weight = weight;
                obj.weight.attr({text:weight});
            },
            
            toggle: function()
            // toggle the weight's visibility
            {
            },
            
            show: function()
            // show the weight
            {
            },
            
            hide: function()
            // hide the weight
            {
            }
        }
        
        // LABEL ---------------------------------------------------------------
        
        this.label = 
        {
            get: function(){ return attr.label },
            // return the label
            
            set: function( label )
            // set a new label
            {
                attr.label = label;
                obj.label.attr({text:label});
            },
            
            toggle: function()
            // toggle the label's visibility
            {
            },
            
            show: function()
            // show the label
            {
            },
            
            hide: function()
            // hide the label
            {
            }
        }
        
        // SELECTION -----------------------------------------------------------
        
        this.isSelected = function(){ return attr.selected }
        // returns if the node is selected or not
        
        this.toggleSelect = function()
        // toggle the selection of this node
        {
            if( attr.selected ) 
                this.deselect();
            else 
                this.select();
        }
        
        this.select = function()
        // select this node
        {
            attr.selected = true;
            
            obj.main.attr( "fill", attr.selFill );
            obj.main.attr( "stroke", attr.selStroke );
            
            obj.weight.attr( "fill", attr.selStroke );
            obj.label.attr( "fill", attr.selStroke );
            
            console.log(consoleID+"select: Node %d selected", this.id);
        }
        
        this.deselect = function()
        // deselect this node
        {
            attr.selected = false;
            
            obj.main.attr( "fill", attr.fill );
            obj.main.attr( "stroke", attr.stroke );
            
            obj.weight.attr( "fill", attr.stroke );
            obj.label.attr( "fill", attr.stroke );
            
            console.log(consoleID+"deselect: Node %d deselected", this.id);
        }
        
        // ELEMENT REMOVAL -----------------------------------------------------
        
        this.remove = function()
        // remove this node's objects from the Raphael surface
        {
            for( var i = 0; i<objects.length; i++ )
                objects[i].remove();
        }
        
        // INIT ----------------------------------------------------------------
        
        // create the main Raphael object
        objects[0] = surface.circle( 
            attr.x, 
            attr.y, 
            attr.radius 
        ).attr({
            fill: attr.fill,
            stroke: attr.stroke
        });
        
        // create the weight
        objects[1] = surface.text( 
            attr.x, 
            attr.y, 
            attr.weight 
        ).attr({
            fill:"white",
            'font-size': 12
        });
        
        // create the label
        objects[2] = surface.text( 
            attr.x, 
            objects[0].getBBox().y - 10, 
            attr.label
        ).attr({
            fill:"white",
            'font-size': 12
        });
        
        // set up object aliases
        obj = {
            main:   objects[0],  // the main object
            weight: objects[1],  // the weight object
            label:  objects[2]   // the label object
        };
        
        // set up mouse functions common to all objects
        for( var i = 0; i<objects.length; i++ ){
            
            // change the mouseover cursor to the "move" symbol
            objects[i].node.style.cursor = "move";
        
            objects[i].mousedown( function(e)
            // when the mouse button is pressed on this node...
            { 
                // set the grabbed node to this node
                grabbedElement = currentNode;
                
                // set this node's position to the mouse's position
                this.dx = e.clientX;
                this.dy = e.clientY;
                
                // prevent the default event action
                e.preventDefault();
                
                // reset the hasMoved flag
                hasMoved = false;
            });
        }

        // set up edit events for weight and label editing
        $(obj.weight.node).bind('dblclick', {node:this}, function(e)
        {
            var entry = 
                parseInt(prompt("Enter a new weight: (Just integers for now!)"));
            
            if( entry ) e.data.node.weight.set( entry );
        });
        $(obj.label.node).bind('dblclick', {node:this}, function(e)
        {
            var entry = prompt("Enter a new label:");
            if( entry ) e.data.node.label.set( entry );
        });
        
        console.log(
            consoleID+"New node %d created at %d, %d", 
            this.id, attr.x, attr.y
        );
        
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

        this.id = Math.floor(Math.random()*10);      // the edge's unique ID
        this.elementType = "edge";  // the type of this element

        // WRITABLE ATTRIBUTES -------------------------------------------------

        // default attributes
        var defaultAttr = {
            node1:      null,
            node2:      null,
            weight:     1,
            weightVis:  true,
            label:      "Edge " + this.id,
            labelVis:   true,
            selected:   false,
            line:       "black",
            bg:         "white",
            selLine:    "black",
            selBg:      "red",
        }
        
        // extend the default attributes with the passed-in attributes
        $.extend( defaultAttr, attr );
        var attr = defaultAttr;
        
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
        var objects = [];       // this edge's Raphael objects
        var obj = {
            bg: null,           // the main object
            line: null,
            weight: null,       // the weight object
            label: null         // the label object
        };
        
        // UPDATE --------------------------------------------------------------
        
        this.update = function()
        // update the path
        {
            // grab the bounding box of each node's Raphael object
            var bb1 = attr.node1.getBBox();
            var bb2 = attr.node2.getBBox();
                
            // figure out if the path needs to be updated (if the path object
            // has not yet been defined or the nodes have been moved since the
            // last update)
            if( 
                !objects.length ||
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
                
                // if the objects are already defined, just update the path of 
                // the lines and the positions of the labels and weights
                if( objects.length ){
                    
                    // update the path
                    obj.bg.attr({ path: path });
                    obj.line.attr({ path: path });
                    
                    // update the weight and label positions
                    var bb = obj.bg.getBBox();
                    obj.weight.attr("x", bb.x + bb.width/2);
                    obj.weight.attr("y", bb.y + bb.height/2 + 15);
                    obj.label.attr("x", bb.x + bb.width/2);
                    obj.label.attr("y", bb.y + bb.height/2 - 15);
                    
                // otherwise, create the new path objects
                } else {
                    
                    console.log(
                        "%sCreating new edge %d from node %d to node %d",
                        consoleID, this.id, attr.node1.id, 
                        attr.node2.id
                    );
                    
                    // create the foreground path
                    objects[1] = surface.path( path ).attr({
                        stroke: attr.line,
                        'stroke-width': 2
                    }).toBack(); // move to back so they're behind the nodes
                    
                    // create the background path
                    objects[0] = surface.path( path ).attr({
                        stroke: attr.bg,
                        'stroke-width': 4
                    }).toBack();
                    
                    var bb = objects[0].getBBox();
                    // create the label
                    objects[3] = surface.text( 
                        bb.x + bb.width/2, 
                        bb.y + bb.height/2 - 15, 
                        attr.label
                    ).attr({
                        fill:"white",
                        'font-size': 12
                    });
                    
                    // create the weight
                    objects[2] = surface.text( 
                        bb.x + bb.width/2, 
                        bb.y + bb.height/2 + 15, 
                        attr.weight 
                    ).attr({
                        fill:"white",
                        'font-size': 12
                    });
                    
                    // set up object aliases
                    obj = {
                        bg:     objects[0], // the background line object
                        line:   objects[1], // the foreground line object
                        weight: objects[2], // the weight object
                        label:  objects[3]  // the label object
                    };
                    
                    // set up edit events for weight and label editing
                    $(obj.weight.node).bind('dblclick', {node:this}, function(e)
                    {
                        var entry = 
                            parseInt(prompt("Enter a new weight: (Just integers for now!)"));
                        
                        if( entry ) e.data.node.weight.set( entry );
                    });
                    $(obj.label.node).bind('dblclick', {node:this}, function(e)
                    {
                        var entry = prompt("Enter a new label:");
                        if( entry ) e.data.node.label.set( entry );
                    });
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
            if( attr.node1 == node || attr.node2 == node )
                return true;
            return false
        }

        this.remove = function()
        // removes this edge from the Raphael surface
        {
            for( var i = 0; i<objects.length; i++ )
                objects[i].remove();
        }
        
        // WEIGHT --------------------------------------------------------------
        
        this.weight = 
        {
            get: function(){ return attr.weight },
            // return the weight
            
            set: function( weight )
            // set the weight
            {   
                attr.weight = weight;
                obj.weight.attr({text:weight});
            },
            
            toggle: function()
            // toggle the weight's visibility
            {
            },
            
            show: function()
            // show the weight
            {
            },
            
            hide: function()
            // hide the weight
            {
            }
        }
        
        // LABEL ---------------------------------------------------------------
        
        this.label = 
        {
            get: function(){ return attr.label },
            // return the label
            
            set: function( label )
            // set a new label
            {
                attr.label = label;
                obj.label.attr({text:label});
            },
            
            toggle: function()
            // toggle the label's visibility
            {
            },
            
            show: function()
            // show the label
            {
            },
            
            hide: function()
            // hide the label
            {
            }
        }
        
        // SELECTION -----------------------------------------------------------
        
        this.isSelected = function(){ return attr.selected }
        // returns if the node is selected or not
        
        this.toggleSelect = function()
        // toggle the selection of this edge
        {
            if( attr.selected ) 
                this.deselect();
            else 
                this.select();
        }
        
        this.select = function()
        // select this edge
        {
            attr.selected = true;
            
            obj.bg.attr( "stroke", attr.selBg );
            obj.line.attr( "stroke", attr.selLine );
            
            obj.weight.attr( "fill", attr.selBg );
            obj.label.attr( "fill", attr.selBg );
            
            console.log(consoleID+"Edge %d selected", this.id);
        }
        
        this.deselect = function()
        // deselect this node
        {
            attr.selected = false;
            
            obj.bg.attr( "stroke", attr.bg );
            obj.line.attr( "stroke", attr.line );
            
            obj.weight.attr( "fill", attr.bg );
            obj.label.attr( "fill", attr.bg );
            
            console.log(consoleID+"Edge %d deselected", this.id);
        }

        // INIT ----------------------------------------------------------------
        
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
