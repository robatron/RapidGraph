// rapidgraph_graph.js

function rapidgraph_graph()
{    
    // nodes in the graph
    var nodes = null;
    
    // edges in the graph
    var edges = null;
    
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
}
