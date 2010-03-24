// rapidgraph_graph.js

function rapidgraph_graph( surface )
{    
    //////////
    // DATA //
    //////////
    
    this.surface = surface;         // Raphael SVG drawing surface for this graph
    var grabbedNode = null;     // the currently grabbed node

    var nodes = new Array();    // an array of the nodes
    var edges = new Array();    // an array of the edges
    
    // a node object
    function node()
    {
        this.selected = false;
        this.label = null;
        this.position = { 
            'x': null, 
            'y': null 
        };
    }
    
    // an edge object
    function edge()
    {        
        this.nodeA = null;
        this.nodeB = null;
        
        this.label = null;
        this.selected = false;
        
        this.weight = null;
        this.isDirected = null;
    }
    
    //////////////////////
    // PUBLIC FUNCTIONS //
    //////////////////////
    
    // initialize a new graph
    function init()
    {
    }
    
    //////////////////////////////
    // PRIVATE HELPER FUNCTIONS //
    //////////////////////////////
}
