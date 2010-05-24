// plugin.js
// 
// Contains the plugin's code and settings

this.settings = 
{
    title: "Euler Circuit",
    subtitle: "",
}

this.init = function()
{
    safelog("::plugin:: is initializing!");
    
    $("#::plugin::_euler").click( function(){
        euler();
    });
}

this.start = function()
{
    safelog("::plugin:: is starting!");
}

this.stop = function()
{
    safelog("::plugin:: is stopping!");
}

// Find an Euler Circuit if there is one, by checking to see if every
// vertex in the current graph has an even degree. If there is one,
// create a directed graph that represents a possible circuit.
function euler() {
    //TODO Check to see if the graph is connected. If not, return.
    
    nodes = graph.nodes.get.all();
    edges = graph.edges.get.all();
    for( i = 0; i < nodes.length; ++i ) {
        // Figure out the degree of each node by counting all of its
        // attached edges.
        degree = 0;
        for( j = 0; j < edges.length; ++j ) {
            if(edges[j].attachedTo(nodes[i])) {
                ++degree;
            }
        }
        
        // If a node with odd degree is found, alert the user and return
        if( degree % 2 == 1 ) {
            alert("Graph does not contain an Euler circuit");
            return;
        }
    }
    
    // Since the previous loop did not return, an Euler circuit was
    // found. Show one through a series of directed edges.
    n = nodes[0];
    while( edges.length > 0 ) {
        
    }
}
