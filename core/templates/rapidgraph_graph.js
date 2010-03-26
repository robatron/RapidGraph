// rapidgraph_graph.js

/* Rough graph class structure
 * 
 *  // TOTAL GRAPH FUNCTIONS ---------------------------------------------------
 * 
 *  .clear() // clear the entire graph
 * 
 *  // THE NODE SETS FUNCTIONS -------------------------------------------------
 * 
 *  .nodes
 *      .createNew({new attributes})    // create a new node
 * 
 *      .remove(node)                   // remove specified node
 * 
 *      .all
 *          .get()      // return an array of all nodes
 * 
 *          .remove()   // remove all selected nodes
 * 
 *          .select()   // select all nodes
 * 
 *          .deselect() // deselect all nodes
 * 
 *      .selected
 *          .get()      // return an array of selected nodes
 * 
 *          .remove()   // remove selected nodes
 * 
 *  // THE EDGE SETS FUNCTIONS -------------------------------------------------
 * 
 *  .edges
 *      .createNew({new attributes})    // create a new edge
 * 
 *      .remove(edge)                   // removes a specified edge
 * 
 *      .all
 *          .get()      // return an array of all edges
 * 
 *          .remove()   // remove all selected edges
 * 
 *          .select()   // select all edges
 * 
 *          .deselect() // deselect all edges
 * 
 *      .selected
 *          .get()      // return an array of selected edges
 * 
 *          .remove()   // remove selected edges
 * 
 *  // GRAPH OBJECTS -------------------------------------------------------
 * 
 *      node                            // a node object
 * 
 *      .attr({changed attributes}) // change the attributes of the node
 *          
 *      .toggleSelect()             // toggle selection of the node
 * 
 *   edge
 *      .attr({changed attributes})
 * 
 *      .toggleSelect()
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
    
    ////////////////////////////////
    // ELEMENT OBJECT DEFINITIONS //
    ////////////////////////////////
    
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
}
