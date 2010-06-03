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
    
    $("#::plugin::_euler").click( function() {
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

// Find an Euler circuit if there is one, by checking to see if every
// vertex in the current graph has an even degree. If there is one,
// create a directed graph that represents a possible circuit.
function euler() {
    //TODO Check to see if the graph is connected. If not, return.
    
    nodes = graph.nodes.get.all();
    edges = graph.edges.get.all();
    eList = new Array();
    for( var i = 0; i < edges.length; ++i) {
        eList.push(i);
    }
    
    for( var i = 0; i < nodes.length; ++i ) {
        // If a node with odd degree is found, alert the user and return
        if( neighbors(i).length % 2 == 1 ) {
            alert("Graph does not contain an Euler circuit");
            return;
        }
    }
    
    n = 0;
    // Since the previous loop did not return, the graph has Euler
    //  circuits. Starting with the first node, traverse edges one by
    //  one until they are all exhausted.
    for( var passes = 1; eList.length > 0; ++passes ) {
        curNeighbors = neighbors(n);
        highNeighbor = curNeighbors[0];
        
        // Find the neighbor of the current node that itself has the
        //  highest number of neighbors. That will be the destination
        //  node for this pass.
        for( var i = 1; i < curNeighbors.length; ++i ) {
            if( neighbors(curNeighbors[i]).length > neighbors(highNeighbor).length )
                highNeighbor = curNeighbors[i];
        }
        
        // Make a directed edge from the current node to its neighbor
        //  with the highest number of edges.
        for( var i = 0; i < eList.length; ++i ) {
            if( edges[eList[i]].attachedTo(nodes[n]) && edges[eList[i]].attachedTo(nodes[highNeighbor]) ) {
                api.graph.edges.createNew({
                    node1: nodes[n],
                    node2: nodes[highNeighbor],
                    directed: true,
                    selected: true,
                    text: passes
                });
                eList.splice(i, 1);
                break;
            }
        }
        
        // Make the destination node of the edge eliminated in this
        //  traversal the new source for the next pass through.
        n = highNeighbor;
    }
    // Eliminate all traversed edges from the UI
    for( var i = 0; i < edges.length/2; ++i )
        edges[i].remove();
    // Select all remaining edges in the UI
    for( var i = 0; i < edges.length; ++i )
        edges[i].select();
}

// Takes the index of the given node, returns the index of each of its
//  neighbors.
function neighbors(nIndex) {
    var neighbors = new Array();
    for( var i = 0; i < nodes.length; ++i ) {
        for( var j = 0; j < eList.length; ++j ) {
            if( i != nIndex && edges[eList[j]].attachedTo(nodes[i]) && edges[eList[j]].attachedTo(nodes[nIndex]) ) {
                neighbors.push(i);
            }
        }
    }
    return neighbors;
}
