/* ~~~~~~~~~~~
 *  RaphGraph  
 * ~~~~~~~~~~~
 * 
 * Description:
 * 
 *     A general graph (as in graph theory) library for Raphael.
 * 
 * Usage:
 * 
 *     Declare a new RaphGraph object and pass it a Raphael surface, i.e.
 * 
 *     var graph = new RaphGraph( Raphael() );
 * 
 * Dependancies:
 * 
 *     - jQuery v1.4.2 or later
 *     - Raphael v1.3.1 or later
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
    var mousePos = {            // the current mouse position
        x: null,
        y: null
    };
    
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
            // update the current mouse position
            mousePos.x = e.pageX;
            mousePos.y = e.pageY;
            
            // if there's a node under the cursor, move all of the selected
            // nodes to follow
            if( grabbedElement && grabbedElement.getType() == "node" ){
                
                grabbedElement.moveTo( e.clientX, e.clientY );

                /*
                // also move selected nodes with it (need to fix, but low
                // priority)
                var selNodes = e.data.graph.nodes.get.selected();
                for( var i = 0; i<selNodes.length; i++ ){
                    
                    var mousePos = { x: e.clientX, y: e.clientY }
                    var nodePos = selNodes[i].getPosition();
                    
                    console.log( nodePos.x, nodePos.y  );
                    //console.log( nodePos.x, nodePos.y );
                    
                    selNodes[i].moveTo( 
                        nodePos.x, 
                        nodePos.y 
                    );
                }
                */

                // update the node labels
                grabbedElement.label.update();

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
                    grabbedElement.getType() == "node" && 
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
                
                console.log(consoleID+"Removing "+e.getType()+" "+e.getID());

                // remove the element from the Raphael surface
                e.remove();

                // if the element is a node, remove it and any edges that may 
                // be attached to it
                if( e.getType() == "node" ){
                    
                    nodes.splice( eIndex, 1 );
                    
                    // remove any edges that may be attached to the node
                    for( var ii = 0; ii<edges.length; ii++ ){
                        if( edges[ii].attachedTo( e ) ){
                            this.remove( edges[ii] );
                            ii--; // since the edge was removed, roll back index
                        }
                    }
                    
                // if the element is an edge, just remove it from the edge list
                } else if( e.getType() == "edge" )
                    edges.splice( eIndex, 1 );
                    
                else
                    console.error(consoleID+
                        "Received unexpected element type: "+e.getType()
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
                
        var id = idCounter++;       // the node's unique ID
        var elementType = "node";   // the type of this element
        var currentNode = this;     // capture this node
        var object;                 // the node's Raphael object
        
        this.label = null;          // the node's label object
        
        // INITIAL ATTRIBUTES --------------------------------------------------

        // default attributes
        var defaultAttr = {
            radius:     20,
            x:          surface.width/2,
            y:          surface.height/2,
            weight:     null,
            text:       null,
            selected:   false,
            fill:       "black",
            stroke:     "white",
            selFill:    "black",
            selStroke:  "red"
        }
        
        // extend the default attributes with the passed-in attributes
        var attr = $.extend( defaultAttr, attr );
        
        // GETTERS -------------------------------------------------------------
        
        this.getID = function(){ return id }
        // returns this edge's ID
        
        this.getType = function(){ return elementType }
        // returns the element's type
        
        // POSITION AND SIZE --------------------------------------------------- 
        
        this.moveTo = function( x, y )
        // move this node to the specified coordinates on the Raphael surface
        {
            object.translate( x - object.dx, y - object.dy );
            
            object.dx = x;
            object.dy = y;
        }
        
        this.getPosition = function()
        // get this node's position on the Raphael surface
        {
            return {
                x: object.attr("cx"),
                y: object.attr("cy")
            };
        }
        
        this.getDimensions = function()
        // get this node's dimensions
        {
            return {
                height: object.getBBox().height,
                width:  object.getBBox().width
            };
        }
        
        this.getBBox = function(){ return object.getBBox() }
        // return the node's object's bounding box
        
        this.getObject = function(){ return object }
        // return this node's Raphael object
        
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
            
            object.attr( "fill", attr.selFill );
            object.attr( "stroke", attr.selStroke );
            
            this.label.select();
            
            var pos = this.getPosition();
            console.log(
                consoleID + 
                "select: Node %d selected at %d, %d", this.getID(), pos.x, pos.y
            );
        }
        
        this.deselect = function()
        // deselect this node
        {
            attr.selected = false;
            
            object.attr( "fill", attr.fill );
            object.attr( "stroke", attr.stroke );
            
            this.label.deselect();
            
            console.log(consoleID+"deselect: Node %d deselected", this.getID());
        }
        
        // ELEMENT REMOVAL -----------------------------------------------------
        
        this.remove = function()
        // remove this node's objects from the Raphael surface
        {
            object.remove();
            this.label.remove();
        }
        
        // INIT ----------------------------------------------------------------
        
        // create the main Raphael object
        attr.x = Math.round( attr.x );
        attr.y = Math.round( attr.y );
        object = surface.circle( 
            attr.x, 
            attr.y, 
            attr.radius 
        ).attr({
            fill: attr.fill,
            stroke: attr.stroke
        });
        
        // create a new label object
        this.label = new elementLabel({
            element:    this,
            weight:     attr.weight,
            text:       attr.text,
            fgCol:      attr.stroke,
            bgCol:      attr.fill,
            fgColSel:   attr.selStroke,
            bgColSel:   attr.selFill
        });
        
        // set up mouse functions common to all objects
        var objects = [object].concat( this.label.getObjs() );
        for( var i = 0; i<objects.length; i++ ){
            
            // when the node is double clicked, open the label editing dialog
            $(objects[i].node).bind('dblclick', {node:this}, function(e)
            {
                e.data.node.label.openEditDialog();
            });
            
            // change the mouseover cursor to the "move" symbol
            objects[i].node.style.cursor = "move";
            
            objects[i].mousedown( function(e)
            // when the mouse button is pressed on this node...
            { 
                // set the grabbed node to this node
                grabbedElement = currentNode;
                
                // set the node to the current mouse position
                object.dx = e.clientX;
                object.dy = e.clientY;
                
                // prevent the default event action
                e.preventDefault();
                
                // reset the hasMoved flag
                hasMoved = false;
            });
        }
        
        console.log(
            consoleID+"New node %d created at %d, %d", 
            this.getID(), attr.x, attr.y
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
        var id = idCounter++;       // the edge's unique ID
        var elementType = "edge";   // the type of this element
        var thisEdge = this;        // capture this edge
        this.label = null;          // this edge's label
        
        // Raphael objects data
        var obj = {
            bg: null,
            line: null,
        };
        
        // structure to hold prevous node positions for update testing
        var prevPos = {
            node1: { x: null, y: null },
            node2: { x: null, y: null }
        }

        // INITIAL ATTRIBUTES --------------------------------------------------

        // default attributes
        var defaultAttr = {
            node1:      null,
            node2:      null,
            directed:   false,
            weight:     null,
            text:       null,
            selected:   false,
            line:       "black",
            bg:         "white",
            selLine:    "black",
            selBg:      "red",
        }
        
        // extend the default attributes with the passed-in attributes
        attr = $.extend( defaultAttr, attr );
        
        // UPDATE --------------------------------------------------------------
        
        this.update = function()
        // update the edge
        {
            // grab the bounding box of each node's Raphael object
            var bb1 = attr.node1.getBBox();
            var bb2 = attr.node2.getBBox();
            
            // inscribe the node and the label inside of a box, and use the
            // box's dimentions as the bounding box. This is so the user can
            // always see the edge ends
            var lbb1 = attr.node1.label.getBBox();
            var lbb2 = attr.node2.label.getBBox();
            if( lbb1.width > bb1.width ){
                bb1.x = lbb1.x;
                bb1.width = lbb1.width;
            }
            if( lbb1.height > bb1.height ){
                bb1.y = lbbl.y;
                bb1.height = lbb1.height;
            }
            if( lbb2.width > bb2.width ){
                bb2.x = lbb2.x;
                bb2.width = lbb2.width;
            }
            if( lbb2.height > bb2.height ){
                bb2.y = lbbl.y;
                bb2.height = lbb2.height;
            }
            
            // figure out if the path needs to be updated (if the path object
            // has not yet been defined or the nodes have been moved since the
            // last update)
            if( 
                !obj.bg || !obj.line ||
                prevPos.node1.x != bb1.x ||
                prevPos.node1.y != bb1.y ||
                prevPos.node2.x != bb2.x ||
                prevPos.node2.y != bb2.y
            ){                
                // create a path from node 1 to node 2
                var path = createEdgePath( bb1, bb2, attr.directed );
                
                // update the path
                obj.bg.attr({ path: path });
                obj.line.attr({ path: path });
                        
                // update the weight and label
                this.label.update();
                
                // save the node positions for the next update
                prevPos.node1.x = bb1.x;
                prevPos.node1.y = bb1.y;
                prevPos.node2.x = bb2.x;
                prevPos.node2.y = bb2.y;
            }
        }
        
        // REMOVE --------------------------------------------------------------

        this.remove = function()
        // removes this edge from the Raphael surface
        {
            obj.bg.remove();
            obj.line.remove();
            this.label.remove();
        }
        
        // GETTERS -------------------------------------------------------------
        
        this.getID = function(){ return id }
        // returns this edge's ID
        
        this.getType = function(){ return elementType }
        // returns the element's type
        
        this.getBBox = function(){ return obj.bg.getBBox() }
        // returns the element's bounding box
        
        this.attachedTo = function( node )
        // returns true if the specified node is attached to this edge, and
        // false if it is not.
        {
            if( attr.node1 == node || attr.node2 == node )
                return true;
            return false;
        }
        
        this.isDirected = function(){ return attr.directed }
        // returns if the edge is directed or not
        
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
            
            this.label.select();
            
            console.log(consoleID+"Edge %d selected", this.getID());
        }
        
        this.deselect = function()
        // deselect this node
        {
            attr.selected = false;
            
            obj.bg.attr( "stroke", attr.bg );
            obj.line.attr( "stroke", attr.line );
            
            this.label.deselect();
            
            console.log(consoleID+"Edge %d deselected", this.getID());
        }

        // INITIALIZE ----------------------------------------------------------

        if( attr.node1 == null || attr.node2 == null )
            console.error( consoleID + 
                "Both nodes must be defined to create an edge.");
        else {
            
            console.log(
                "%sCreating new edge %d from node %d to node %d",
                consoleID, this.getID(), attr.node1.getID(), 
                attr.node2.getID()
            );
            
            // create the foreground path
            obj.line = surface.path().attr({
                stroke: attr.line,
                'stroke-width': 2
            }).toBack(); // move to back so they're behind the nodes
            
            // create the background path
            obj.bg = surface.path().attr({
                stroke: attr.bg,
                'stroke-width': 4
            }).toBack();
            
            // create a new label object
            this.label = new elementLabel({
                element:    this,
                weight:     attr.weight,
                text:       attr.text,
                fgCol:      attr.bg,
                bgCol:      attr.line,
                fgColSel:   attr.selBg,
                bgColSel:   attr.selLine
            });
            
            // set the interaction events for this new edge
            var objects = [obj.line, obj.bg].concat(this.label.getObjs());
            for( var i = 0; i<objects.length; i++ ){
                
                // when the edge is double clicked, open the label editing dialog
                $(objects[i].node).bind('dblclick', {edge:this}, function(e)
                {
                    e.data.edge.label.openEditDialog();
                });
                
                objects[i].mousedown( function(e)
                {
                    grabbedElement = thisEdge;
                    e.preventDefault(); // prevent the default event action
                    hasMoved = false;
                });
            }
            
            // finally, update the objects' positions
            this.update();
            
            // return the newly created edge
            return this;
        }
    };
    
    //////////////////////////////
    // ELEMENT HELPER FUNCTIONS //
    //////////////////////////////
    
    function elementLabel( attr )
    // a label that displays the text and weight in the center of an element
    {        
        // DATA ----------------------------------------------------------------
        
        var consoleID = "graph.label: ";
        
        var id = null; // the element's ID
        var thisLabel = this;
        
        // extend the default attributes
        var defaultAttr = {
            element:    null,
            weight:     null,
            text:       null,
            fgCol:      "white",
            bgCol:      "black",
            fgColSel:   "red",
            bgColSel:   "black"
        }
        attr = $.extend( defaultAttr, attr );
        
        // create the label background
        var bg = surface.rect().attr({
            r:5,
            fill:attr.bgCol,
            stroke:attr.fgCol
        });
        
        // create the text label
        var text = surface.text( 0, 0 ).attr({
            fill:attr.fgCol,
            'font-size': 12
        });
        
        // create the weight label
        var weight = surface.text( 0, 0 ).attr({
            fill:attr.fgCol,
            'font-size': 12
        });
        
        // FACILITATORS --------------------------------------------------------
        
        this.openEditDialog = function()
        // open the edit dialog
        {   
            var bb = attr.element.getBBox();
            var pos = {
                x: $(surface.canvas).parent().position().left,
                y: $(surface.canvas).parent().position().top
            };
            var windowPos = [
                pos.x + bb.x + bb.width,
                pos.y + bb.y + bb.height
            ];
            $("#elem_"+id+"_labelDialog").dialog(
                "option", "position", windowPos
            );
            $("#elem_"+id+"_labelDialog").dialog("open");
        }
        
        this.select = function()
        // change the label to the selection color
        {
            weight.attr( "fill", attr.fgColSel );
            text.attr( "fill", attr.fgColSel );
            bg.attr( "stroke", attr.fgColSel );
        }
        
        this.deselect = function()
        // change the label to the deselection color
        {
            weight.attr( "fill", attr.fgCol );
            text.attr( "fill", attr.fgCol );
            bg.attr( "stroke", attr.fgCol );
        }
        
        this.remove = function()
        // remove the label from the Raphael surface
        {
            weight.remove();
            text.remove();
            bg.remove();
        }
        
        // VISIBILITY ----------------------------------------------------------
        
        this.hide = function()
        {
            weight.hide();
            text.hide();
            bg.hide();
        }
        
        this.show = function()
        {
            weight.show();
            text.show();
            bg.show();
        }
        
        // GETTERS AND SETTERS -------------------------------------------------
        
        this.weight = {
            set: function( w )
            {                
                w = parseFloat( w );
                if( isNaN(w) )
                    w = null;
                attr.weight = w;
                thisLabel.update();
            },
            get: function(){ return attr.weight }
        }
        
        this.text = {
            set: function( t )
            {
                if( t == "" )
                    t = null;
                    
                console.log( t );
                attr.text = t;
                thisLabel.update();
            },
            get: function(){ return attr.text }
        }
        
        this.getObjs = function()
        // return an array containing the Raphael objects that make up the label
        {
            return [ text, weight, bg ];
        }
        
        this.getElement = function(){ return attr.element }
        // return a reference to the element
        
        this.getBBox = function(){ return bg.getBBox() }
        // return the label's bounding box
        
        // POSITION UPDATER ----------------------------------------------------
        
        this.update = function()
        // update the label
        {
            // position the text and weight
            var bb = attr.element.getBBox();
            var offset = 7;
            if( attr.weight == null || attr.text == null ) 
                offset = 0;
            weight.attr("x", bb.x + bb.width/2);
            weight.attr("y", bb.y + bb.height/2 + offset);
            text.attr("x", bb.x + bb.width/2);
            text.attr("y", bb.y + bb.height/2 - offset);

            /*
            // report that the label is visible or not
            if( attr.weight == null
            */

            // set the label text
            if( attr.weight != null ) 
                weight.attr({text:attr.weight});
            else
                weight.attr({text:""});

            if( attr.text != null )
                text.attr({text:attr.text});
            else
                text.attr({text:""});

            // position the background
            var PADDING = 3;
            var wbb = weight.getBBox();
            var tbb = text.getBBox();
            var h, w, x, y;
            var showBg = true;
            
            // if both label elements are present, use both
            if( attr.weight != null && attr.text != null ){
                h = wbb.height + tbb.height;
                w = Math.max( wbb.width, tbb.width );
                x = tbb.x;
                y = tbb.y;
                
            // if only the weight is present, use only the weight
            } else if( attr.weight != null && attr.text == null ){
                h = wbb.height;
                w = wbb.width;
                x = wbb.x;
                y = wbb.y;
                
            // if only the text is present, use the text
            } else if( attr.weight == null && attr.text != null ){
                h = tbb.height;
                w = tbb.width;
                x = tbb.x;
                y = tbb.y;
                
            // otherwise, no elements are present. Don't show the background.
            } else
                showBg = false;
                
            if( showBg ){
                bg.attr("height", h + PADDING*2);
                bg.attr("width", w + PADDING*2);
                bg.attr("x", x-PADDING);
                bg.attr("y", y-PADDING);
                bg.show();
            } else
                bg.hide();
                
            // if this element is a node, update the edge paths
            if( attr.element.getType() == "node" ){
                var edges = currentGraph.edges.get.all();
                for( var i = 0; i<edges.length; i++ )
                    edges[i].update();
            }
        }
        
        // INIT ----------------------------------------------------------------
        
        // Make sure the element is set
        if( !attr.element )
            console.error(consoleID+
                "Element attribute is required for new labels");
        else
            init();
            
        function init()
        {
            id = attr.element.getID();
            
            // Create the edit dialog
            $(document.body).append(
                "<div id='elem_"+id+"_labelDialog'>"+
                "<table>"+
                "    <tr>"+
                "        <td>Text:</td>"+
                "        <td><input id='elem_"+id+"_labelDialog_text'></td>"+
                "    </tr>"+
                "    <tr>"+
                "        <td>Weight:</td>"+
                "        <td><input id='elem_"+id+"_labelDialog_weight'></td>"+
                "    </tr>"+
                "</table>"+
                "</div>"
            );
            $("#elem_"+id+"_labelDialog").data('assocLabel', thisLabel );
            $("#elem_"+id+"_labelDialog").dialog({
                title: "Edit element label and weight",
                autoOpen: false,
                draggable: true,
                resizable: false,
                buttons:{
                    "OK": function()
                    {
                        $("#elem_"+id+"_labelDialog").data('assocLabel').weight
                            .set( $("#elem_"+id+"_labelDialog_weight").val() );
                        $("#elem_"+id+"_labelDialog").data('assocLabel').text
                            .set( $("#elem_"+id+"_labelDialog_text").val() );
                        $(this).dialog("close");
                    }
                },
                open: function()
                {
                    $("#elem_"+id+"_labelDialog_weight").val(
                        $("#elem_"+id+"_labelDialog").data('assocLabel').weight
                            .get()
                    );
                    $("#elem_"+id+"_labelDialog_text").val(
                        $("#elem_"+id+"_labelDialog").data('assocLabel').text
                            .get()
                    );
                }
            });
            
            thisLabel.update();
            
            // when the label is double clicked, open the label editing dialog
            objects = [
                weight,
                text,
                bg
            ];
            for( var i = 0; i<objects.length; i++)
                $(objects[i].node).bind('dblclick', {label:thisLabel}, function(e)
                {
                    e.data.label.openEditDialog();
                });
        }
    }
    
    function createEdgePath( bb1, bb2, directed )
    // create an SVG path string for an edge from one bounding box to another.
    // If directed is true, then it also draws an arrow.
    {
        // top, bottom, left, and right sides of each bounding box
        var p = [
        
            // points for bounding box 1
            {x: bb1.x + bb1.width / 2,  y: bb1.y - 1},              // top
            {x: bb1.x + bb1.width / 2,  y: bb1.y + bb1.height + 1}, // bottom
            {x: bb1.x - 1,              y: bb1.y + bb1.height / 2}, // left
            {x: bb1.x + bb1.width + 1,  y: bb1.y + bb1.height / 2}, // right

            // points for bounding box 2
            {x: bb2.x + bb2.width / 2,  y: bb2.y - 1},              // top
            {x: bb2.x + bb2.width / 2,  y: bb2.y + bb2.height + 1}, // bottom
            {x: bb2.x - 1,              y: bb2.y + bb2.height / 2}, // left
            {x: bb2.x + bb2.width + 1,  y: bb2.y + bb2.height / 2}  // right
        ];
        
        // figure out which side (top, bottom, left or right) of each bounding 
        // box to attach to
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
        var x2 = [x1, x1, x1-dx, x1+dx][res[0]].toFixed(3);
        var y2 = [y1-dy, y1+dy, y1, y1][res[0]].toFixed(3);
        var x3 = [0, 0, 0, 0, x4, x4, x4-dx, x4+dx][res[1]].toFixed(3);
        var y3 = [0, 0, 0, 0, y1+dy, y1-dy, y4, y4][res[1]].toFixed(3);
        
        function attachedSide()
        // Helper function to figure out which side of the destination node 
        // the edge is attached to (top, bottom, left, or right)
        {
            if( p[4].x == x4.toFixed(3) && p[4].y == y4.toFixed(3) ) 
                return "top";
            else if( p[5].x == x4.toFixed(3) && p[5].y == y4.toFixed(3) ) 
                return "bottom";
            else if( p[6].x == x4.toFixed(3) && p[6].y == y4.toFixed(3) ) 
                return "left";
            else if( p[7].x == x4.toFixed(3) && p[7].y == y4.toFixed(3) ) 
                return "right";
        }
        
        // create the edge path
        var path = [
            "M", 
            x1.toFixed(3), y1.toFixed(3), 
            "C", 
            x2, y2, 
            x3, y3
        ].join(",");
        
        // If the edge is not directed. Close up the edge normally.
        if( !directed )
            path += "," + x4.toFixed(3) + "," + y4.toFixed(3);
            
        // Otherwise, the edge is directed, so also draw the triangle
        else {
            var size = 5; // triangle leg size
            
            // adjust point 1 and 2 of the triangle depending on which side of
            // the destination node the edge is attached to
            var origX = parseInt( x4.toFixed(3) );
            var origY = parseInt( y4.toFixed(3) );
            var p0, p1, p2, p3, p4;
            if( attachedSide() == "top" ){
                p0 = { x:origX, y:origY-size-2 };
                p1 = { x:size,  y:0 };
                p2 = { x:-size, y:size };
                p3 = { x:-size, y:-size};
                p4 = { x:size,  y:0};
            } else if( attachedSide() == "bottom" ){
                p0 = { x:origX, y:origY+size+2 };
                p1 = { x:-size, y:0 };
                p2 = { x:size,  y:-size };
                p3 = { x:size,  y:size};
                p4 = { x:-size, y:0};
            } else if( attachedSide() == "left" ){
                p0 = { x:origX-size-2, y:origY };
                p1 = { x:0,     y:-size };
                p2 = { x:+size, y:+size };
                p3 = { x:-size, y:+size};
                p4 = { x:0,     y:-size};
            } else if( attachedSide() == "right" ){
                p0 = { x:origX+size+2, y:origY };
                p1 = { x:0,     y:+size };
                p2 = { x:-size, y:-size };
                p3 = { x:+size, y:-size};
                p4 = { x:0,     y:+size};
            }
            
            path += "," + [
                p0.x, p0.y,
                "l",
                p1.x, p1.y,
                p2.x, p2.y,
                p3.x, p3.y,
                p4.x, p4.y,
            ].join(",");
        }
        
        return path;
    }
}
