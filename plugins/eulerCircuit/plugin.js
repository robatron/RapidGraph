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
        console.log(neighbors(i).length);
    }
    
    // Since the previous loop did not return, the graph has Euler
    //  circuits
    n = 0;
    while( eList.length > 0 ) {
        curNeighbors = neighbors(n);
        highNeighbor = curNeighbors[0];
        for( var i = 1; i < curNeighbors.length; ++i ) {
            if( neighbors(curNeighbors[i]).length > neighbors(highNeighbor).length )
                highNeighbor = curNeighbors[i];
        }
        for( var i = 0; i < edges.length; ++i ) {
            if( edges[i].attachedTo(nodes[n]) && edges[i].attachedTo(nodes[highNeighbor]) ) {
                api.graph.edges.createNew({
                    node1: nodes[n],
                    node2: nodes[highNeighbor],
                    directed: true,
                    selected: true,
                    text: null
                });
            }
        }
    }
}

function neighbors(nIndex) {
    var neighbors = new Array();
    for( var i = 0; i < eList.length; ++i ) {
        if( edges[eList[i]].attachedTo(nodes[nIndex]) ) {
            neighbors.push(i);
        }
    }
    return neighbors;
}
