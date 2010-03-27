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
    var grabbedNodeObj = null;  // the currently grabbed node Raphael object
    var hasMoved = true;        // did the object move between click & release?
    
    var idCounter = 0; // an ID counter so every element may have a unique ID
    
    var currentGraph = this; // a reference to this graph instance
    
    // run init as soon as a graph object is instantiated
    init();
    
    ///////////////////////////
    // WHOLE GRAPH FUNCTIONS //
    ///////////////////////////
    
    function init()
    // initialize the graph
    {
        var consoleID = "rapidgraph_graph: init: ";
        
        console.log(this);
        
        $(surface.canvas).bind(
            'mousemove',
            {
                graph:currentGraph, 
                edges:edges
            },
            function(e)
        // if there's currently a grabbed node, move it to the mouse's position
        {                     
            if( grabbedNodeObj ){
                
                var n = grabbedNodeObj;
                n.translate( e.clientX - n.dx, e.clientY - n.dy );
                n.dx = e.clientX;
                n.dy = e.clientY;
                
                for( var i = 0; i<e.data.edges.length; i++ )
                    console.log( e.data.edges[i] );
                
                // set the hasMoved flag, for the node has moved
                hasMoved = true;
            }
        });
        
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
    // functions related to the nodes set
    {
        createNew: function( attr )
        // create a new node
        {            
            var consoleID = "rapidgraph_graph.nodes.createNew: ";
            
            console.log(consoleID+
                "Creating a new node with the specified attributes"
            );
            var newNode = new node( attr );
            
            console.log(consoleID+"Pushing the new node onto the stack");
            nodes.push( newNode );
            
            console.log(consoleID+"Returning with the new node");
            return newNode;   
        },
        
        get: 
        // get functions
        {
            all: function()
            // return all of the nodes in an array
            {
                var consoleID = "rapidgraph_graph.nodes.get.all: ";
                console.log(consoleID+"Returning all nodes");
                return nodes;
            },
                
            selected: function()
            // return the selected nodes in an array
            {
                var consoleID = "rapidgraph_graph.nodes.get.selected: ";
                console.log(consoleID+"Returning selected nodes");
                
                var selected = [];
                
                for( var i = 0; i<nodes.length; i++ )
                    if( nodes[i].attr.selected )
                        selected.push( nodes[i] );
                        
                return selected;
            },
                
            unselected: function()
            // return the unselected nodes in an array
            {
                var consoleID = "rapidgraph_graph.nodes.get.unselected: ";
                console.log(consoleID+"Returning unselected nodes");
                
                var unselected = [];
                
                for( var i = 0; i<nodes.length; i++ )
                    if( !nodes[i].attr.selected )
                        selected.push( nodes[i] );
                        
                return unselected;
            }
        }
    };
    
    this.edges = 
    // functions related to the nodes set
    {
        createNew: function( attr )
        // create a new edge
        {
            var consoleID = "rapidgraph_graph.edges.createNew: ";
            
            console.log(consoleID+
                "Creating a new edge with the specified attributes"
            );
            var newEdge = new edge( attr );
            
            console.log(consoleID+"Pushing the new edge onto the stack");
            edges.push( newEdge );
            
            console.log(consoleID+"Returning with the new edge");
            return newEdge;   
        },
        
        get: 
        // get functions
        {
            all: function()
            // return all of the edges in an array
            {
                var consoleID = "rapidgraph_graph.edges.get.all: ";
                console.log(consoleID+"Returning all edges");
                return nodes;
            },
                
            selected: function()
            // return the selected edges in an array
            {
                var consoleID = "rapidgraph_graph.edges.get.selected: ";
                console.log(consoleID+"Returning selected edges");
                
                var selected = [];
                
                for( var i = 0; i<edges.length; i++ )
                    if( edges[i].attr.selected )
                        selected.push( edges[i] );
                        
                return selected;
            },
                
            unselected: function()
            // return the unselected edges in an array
            {
                var consoleID = "rapidgraph_graph.edges.get.unselected: ";
                console.log(consoleID+"Returning unselected edges");
                
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
        var consoleID = "rapidgraph_graph: node: ";

        // READ-ONLY ATTRIBUTES ------------------------------------------------

        this.id = idCounter++;      // the node's unique ID
        this.elementType = "node";  // the type of this element
        this.object = null;         // the node's Raphael object

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

    function edge( attr )
    {
        // READ-ONLY ATTRIBUTES ------------------------------------------------

        this.id = idCounter++;      // the edge's unique ID
        this.elementType = "edge";  // the type of this element

        // WRITABLE ATTRIBUTES -------------------------------------------------

        // default attributes
        var defaultAttr = {
            node1:  null,
            node2:  null,
            fill:   "white",
            stroke:     "white"
        }
        
        // extend the default attributes with the passed-in attributes
        $.extend( defaultAttr, attr );
        
        // make the attributes public
        this.attr = defaultAttr;
        
        // DO SOME SWEET STUFFS (comment later) --------------------------------
        
        var n1x = this.attr.node1.object.getBBox().x;
        var n1y = this.attr.node1.object.getBBox().y;
        var n2x = this.attr.node2.object.getBBox().x;
        var n2y = this.attr.node2.object.getBBox().y;
        var pathParams = "M"+n1x+" "+n1y+"L"+n2x+" "+n2y;
        
        this.object = surface.path( pathParams ).attr({
            stroke: "white",
            'stroke-width': 3
        });
        
        // return the newly created edge
        return this;
    };
}