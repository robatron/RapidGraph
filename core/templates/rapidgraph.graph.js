// rapidgraph_graph.js

function rapidgraph_graph( surface )
{    
    ////////////////
    // GRAPH DATA //
    ////////////////
    
    // nodes and edges arrays
    var nodes = new Array();    // an array of the nodes
    var edges = new Array();    // an array of the edges
    
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
    
    //////////////////////
    // PUBLIC FUNCTIONS //
    //////////////////////
    
    this.clear = function()
    {
        console.group("graph.clear()");

        surface.clear();
        nodes = new Array();
        
        console.log("surface cleared");
        console.groupEnd();
    }
    
    //////////
    // INIT //
    //////////
    
    function init()
    // initialize the graph
    {
        console.group("graph.init()");
        
        initSurfaceMouseEvents();
        
        console.groupEnd();
    }
    
    function initSurfaceMouseEvents()
    {
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
    }
    
    ////////////////////
    // NODE FUNCTIONS //
    ////////////////////
    
    // a node object
    this.node = function( attr )
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
        
        // push this new node onto the node stack
        nodes.push( this );
        
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
        
        // NODE REMOVAL --------------------------------------------------------
        
        this.remove = function()
        // remove the node from the surface, and from the nodes stack
        {
            console.log("removing node %d", this.id);
            
            // remove the node's object from the Raphael surface
            this.object.remove();
            
            // find this node in the stack, and remove it
            var thisIndex = null
            for( var i = 0; i<nodes.length; i++)
                if( nodes[i] == this )
                    thisIndex = i;
            nodes.splice( thisIndex, 1);
            
            // finally, delete this node from memory
            delete this;
        }
        
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

    this.selectedNodes = 
    // functions related to the set of selected nodes
    {
        get: function()
        // return an array of the selected nodes
        {
            var selectedNodes = [];
        
            for( var i = 0; i<nodes.length; i++ )
                if( nodes[i].attr.selected == true )
                    selectedNodes.push( nodes[i] );
                    
            return selectedNodes;
        },
        
        remove: function()
        // remove the selected nodes
        {
            var selectedNodes = this.get();
        
            for( var i = 0; i<selectedNodes.length; i++ )
                selectedNodes[i].remove();
        },
        
        deselect: function()
        // deselect all selected nodes
        {
            var selectedNodes = this.get();
            
            for( var i = 0; i<selectedNodes.length; i++ )
                selectedNodes[i].deselect();
        }
    }
}
