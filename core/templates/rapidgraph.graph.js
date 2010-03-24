// rapidgraph_graph.js

function rapidgraph_graph( surface )
{    
    ////////////////
    // GRAPH DATA //
    ////////////////
    
    // public data
    this.surface = surface;     // Raphael SVG drawing surface for this graph
    
    // private data
    var nodes = new Array();    // an array of the nodes
    var edges = new Array();    // an array of the edges
    var grabbedNodeObj = null;     // the currently grabbed node
    
    // grab the surface offset values. (For some reason the .offset() values
    // change after each call)
    var offset = {
        x: $(surface.canvas).offset().left,
        y: $(surface.canvas).offset().top
    };
    
    // run init as soon as a graph object is instantiated
    init();
    
    //////////////////////
    // PUBLIC FUNCTIONS //
    //////////////////////
    
    this.clear = function()
    {
        console.group("graph.init()");

        surface.clear();
        
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
        
        surface.canvas.onmousemove = function(e)
        // if there's currently a grabbed node, move it to the mouse's position
        {                     
            if( grabbedNodeObj ){
                
                var n = grabbedNodeObj;
                n.translate( e.clientX - n.dx, e.clientY - n.dy );
                n.dx = e.clientX;
                n.dy = e.clientY;
            }
        };
        
        surface.canvas.onmousedown = function( e )
        // if no node is under the pointer, make a new node
        {
            console.group("surface.onmousedown");
            
            if( !grabbedNodeObj ){
                
                var x = e.clientX - offset.x;
                var y = e.clientY - offset.y;
                
                console.log("creating new node at %d, %d", x, y);
                
                grabbedNodeObj = new node({x:x, y:y}).object;
            }
            
            console.groupEnd();
        };
        
        surface.canvas.onmouseup = function()
        // if the mouse button is lifted, clear any grabbed nodes
        { 
            console.group("surface.onmouseup");
            
            grabbedNodeObj = null;
            
            console.log("Mouse lifted. grabbedNodeObj cleared");
            console.groupEnd();
        };
        
        console.groupEnd();
    }
    
    ////////////////////
    // NODE FUNCTIONS //
    ////////////////////
    
    // a node object
    function node( settings )
    {        
        console.group("graph.node");
        console.log("creating new node");
        
        // default settings
        var defaultSettings = {
            radius:     20,
            x:          surface.width/2-this.radius,
            y:          surface.height/2-this.radius,
            selected:   false,
            label:      null,
            fill:       "black",
            stroke:     "white"
        }
        
        // extend the default settings with the passed-in settings
        $.extend( defaultSettings, settings );
        
        // make settings public
        this.settings = defaultSettings;
        
        // the raphael object
        this.object = surface.circle( 
            this.settings.x, 
            this.settings.y, 
            this.settings.radius 
        ).attr({
            fill: this.settings.fill,
            stroke: this.settings.stroke
        }); 
        
        // push this new node onto the node stack
        nodes.push( this );
        this.index = nodes[nodes.length-1];
        
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
        });
        
        // PUBLIC FUNCTIONS
        
        // remove the node from the surface, and remove it from the nodes stack
        this.remove = function()
        {
            this.object.remove();
            nodes.splice( this.index, 1);
        }
        
        console.groupEnd();
        
        // return this new object
        return this;
    }
}
