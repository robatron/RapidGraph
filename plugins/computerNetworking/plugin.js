// plugin.js
// 
// Contains the plugin's client-side code and settings

this.settings = 
{
    title: "Computer Networking",
    subtitle: "Creates a computer network represented as a graph"
}

this.init = function() {
    
    safelog("::plugin:: is initializing!");
    
    $("#::plugin::_make_network").click( function() {
        api.graph.backgroundImg.remove();

        // Make a small random undirected edge-weighted graph

        GRAPH_SIZE = 9;     // The number of nodes in the graph
        PERTURBATION = 50;  // The number of pixels that nodes can be randomly perturbed
        NODE_RADIUS = 25;   // The radius of a node image
        boxX = api.ui.getMainPanelSize().width - (3 * NODE_RADIUS);
        boxY = api.ui.getMainPanelSize().height - (3 * NODE_RADIUS);
        
        // Make some nodes
        var myNodes = new Array();
        for( i = 0; i < GRAPH_SIZE; ++i ) {
            myNodes[i] = api.graph.nodes.createNew({
                x: ( ((boxX - (PERTURBATION)) / (Math.ceil(Math.sqrt(GRAPH_SIZE)) - 1)) * (i % Math.ceil(Math.sqrt(GRAPH_SIZE))) + Math.random() * PERTURBATION + NODE_RADIUS),
                y: ( ((boxY - (PERTURBATION)) / (Math.ceil(Math.sqrt(GRAPH_SIZE)) - 1)) * Math.floor(i / Math.ceil(Math.sqrt(GRAPH_SIZE))) + Math.random() * PERTURBATION + NODE_RADIUS),
                text: null,
                img: "static/plugins/computerNetworking/computer3.png",
                height: 45,
                width: 45
            });
        }
        
        // Connect some of the nodes in the graph with randomly weighted edges
        EDGE_PROB = 0.3   // The probability that two nodes within the graph will get connected by an edge
        var myEdges = new Array();
        for( i = 0; i < GRAPH_SIZE; ++i ) {
            for( j = 0; j < GRAPH_SIZE; ++j ) {
                if( i < j && Math.random() < EDGE_PROB ) {
                    api.graph.edges.createNew({
                        node1: myNodes[i],
                        node2: myNodes[j],
                        weight: Math.floor(Math.random() * 9 + 1),
                        text: null
                    });
                }
            }
        }
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
