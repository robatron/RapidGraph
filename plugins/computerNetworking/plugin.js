// plugin.js
// 
// Contains the plugin's client-side code and settings

this.settings = 
{
    title: "Computer Networking",
    subtitle: "Shows the relationship between networking and a classic graph algorithm."
}

this.start = function()
{
    $("#make_network").click( function(){
        // Make a small random undirected edge-weighted graph

        GRAPH_SIZE = 9;     // The number of nodes in the graph
        PERTURBATION = 0;   // The number of pixels that nodes can be randomly perturbed
        NODE_RADIUS = 25;   // The radius of a node image
        boxX = api.ui.getMainPanelSize().width - (2 * NODE_RADIUS);
        boxY = api.ui.getMainPanelSize().height - (2 * NODE_RADIUS);
        
        // Make some nodes
        var myNodes = new Array();
        for( i = 0; i < GRAPH_SIZE; ++i ) {
            myNodes[i] = api.graph.nodes.createNew({
                x: ( ((boxX - (PERTURBATION)) / (Math.ceil(Math.sqrt(GRAPH_SIZE)) - 1)) * (i % Math.ceil(Math.sqrt(GRAPH_SIZE))) + Math.random() * PERTURBATION + NODE_RADIUS),
                y: ( ((boxY - (PERTURBATION)) / (Math.ceil(Math.sqrt(GRAPH_SIZE)) - 1)) * Math.floor(i / Math.ceil(Math.sqrt(GRAPH_SIZE))) + Math.random() * PERTURBATION + NODE_RADIUS),
                label: null
            });
        }
        
        // Connect some of the nodes in the graph with
        // randomly weighted edges
        EDGE_PROB = 0.3   // The probability that two nodes within the graph will get connected by an edge
        var myEdges = new Array();
        for( i = 0; i < GRAPH_SIZE; ++i ) {
            for( j = 0; j < GRAPH_SIZE; ++j ) {
                if( i < j && Math.random() < EDGE_PROB ) {
                    api.graph.edges.createNew({
                        node1: myNodes[i],
                        node2: myNodes[j],
                        weight: Math.floor(Math.random() * 9 + 1),
                        label: null
                    });
                }
            }
        }

    });

    $("#find_route").click( function(){
        // Find the shortest path between two selected nodes
        // using an implementation of the Dijkstra's
        // Shortest Path algorithm

        console.log("In find route");

        // Check that all edge weights are non-negative and
        // non-null
        edges = graph.edges.get.all();
        for( i = 0; i < edges.length; ++i ) {
            if( edges[i].weight.get() == null || edges[i].weight.get() < 0) {
                alert("Graph edges must be weighted with positive values!");
                return;
            }
        }

        console.log("After edge check");

        // Check to that the user has selected exactly two nodes
        selectedNodes = graph.nodes.get.selected();
        if( selectedNodes.length != 2 ) {
            alert("Must select exactly two nodes, not " + selectedNodes.length + "!");
            return;
        }

        // Initialize some variables
        var distance = new Array();
        var previous = new Array();
        for( i = 0; i < graph.nodes.length; ++i ) {
            distance[i] = -1;
            previous[i] = null;
        }
        start = selectedNodes[0];
        end = selectedNoded[1];
        
        /*
        function Dijkstra(Graph, source):
            for each vertex v in Graph:           // Initializations
                dist[v] := infinity               // Unknown distance function from source to v
                previous[v] := undefined          // Previous node in optimal path from source
            dist[source] := 0                     // Distance from source to source
            Q := the set of all nodes in Graph
            // All nodes in the graph are unoptimized - thus are in Q
            while Q is not empty:                 // The main loop
                u := vertex in Q with smallest dist[]
                if dist[u] = infinity:
                    break                         // all remaining vertices are inaccessible from source
                remove u from Q
                for each neighbor v of u:         // where v has not yet been removed from Q.
                    alt := dist[u] + dist_between(u, v)
                    if alt < dist[v]:             // Relax (u,v,a)
                        dist[v] := alt
                        previous[v] := u
            return dist[]
        */

        // Select the nodes and edges in the graph along the
        // path, so that they are highlighted for the user

        /*
        S := empty sequence
        u := target
        while previous[u] is defined:
            insert u at the beginning of S
            u := previous[u]
        */
    });
}
