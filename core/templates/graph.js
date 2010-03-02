// graph.js - A simple graph class
//   By Rob McGuire-Dale, Feb. 2010

function graph()
{
    /////////////////
    // member data //
    /////////////////
    
    // a node object
    function node()
    {
        this.label = null;
        this.position = { 
            'x': null, 
            'y': null 
        };
    }
    
    // nodes in the graph
    var nodes = null;
    
    // an edge object
    function edge()
    {
        this.label = null;
        this.weight = null;
        this.isDirected = null;
        this.nodeA = null;
        this.nodeB = null;
    }
    
    // edges in the graph
    var edges = null;
    
    
}
