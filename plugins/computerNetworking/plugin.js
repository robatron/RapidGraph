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

    $("#find_route").click( function() {
        // Find the shortest path between two selected nodes
        // using an implementation of the Dijkstra's
        // Shortest Path algorithm

        //console.log("In find route");

        // Check that all edge weights are non-negative and non-null
        edges = graph.edges.get.all();
        for( i = 0; i < edges.length; ++i ) {
            if( edges[i].weight.get() == null || edges[i].weight.get() < 0) {
                alert("Graph edges must be weighted with positive values!");
                return;
            }
        }

        //console.log("After edge check");

        // Check to that the user has selected exactly two nodes
        selectedNodes = graph.nodes.get.selected();
        if( selectedNodes.length != 2 ) {
            alert("Must select exactly two nodes, not " + selectedNodes.length + "!");
            return;
        }

        // Initialize some variables
        var distance = new Array();
        var previous = new Array();
        var nCopy = new Array();
        for( i = 0; i < graph.nodes.length; ++i ) {
            nCopy[i] = deepCopy(graph.nodes[i]);
            previous[i] = null;
            if( selectedNodes[0] == graph.nodes[i] ) {
                startIndex = i;
                distance[i] = 0;
            }
            else {
                distance[i] = -1;
            }
            if( selectedNodes[1] == graph.nodes[i] ) {
                endIndex = i;
            }
        }

        // Make "infinity" larger than any possible distance between
        //  two nodes
        infinity = 1;
        for( i = 0; i < edges.length; ++i )
            infinity += edges[i].weight.get();

        distance[startIndex] = 0;
        while( nCopy.length != 0 ) {
            //Find the node with the smallest distance from source
            sval = infinity;
            smallestIndex = null;
            for( i = 0; i <= nCopy.length; ++i ) {
                if( distance[i] < sval ) {
                    smallestIndex = i;
                    sval = distance[i];
                }
            }
            
            if( sval == infinity )
                break;
            node = nCopy[smallestIndex];
            nCopy.splice(smallestIndex, smallestIndex);
            distance.splice(smallestIndex, smallestIndex);
            neighbors = getNeighbors( node, nCopy );
            for( i = 0; i < neighbors.length; ++i ) {
                distanceBetween = smallestEdge( node, nCopy[neighbors[i]], edges, infinity ).weight.get();
                newDist = sval + distanceBetween;
                if( newDist < distance[neighbors[i]] ) {
                    distance[neighbors[i]] = newDist;
                    previous[i] = node;
                }
            }
        }
        
        cur = endIndex;
        nodes = graph.nodes.get.all();
        while( previous[cur] != null ) {
            nodes[cur].select();
            smallestEdge( nodes[cur], nodes[prev], edges, infinity ).select();
            cur = previous[cur];
        }
        nodes[cur].select();
    });

        /*
        S := empty sequence
        u := target
        while previous[u] is defined:
            insert u at the beginning of S
            u := previous[u]
        */

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

    function getNeighbors(node, nodes) {
        var neighbors = new Array();
        for( i = 0; i < nodes.length; ++i ) {
            if( nodes[i].attachedTo(node) )
                neighbors.push(i);
        }
        return neighbors;
    }

    function smallestEdge( n1, n2, edges, infinity ) {
        distanceBetween = infinity;
        smallestEdge = null;
        for( i = 0; i < edges.length; ++j ) {
            if( ( edges[i].attr.node1 == n1 && edges[i].attr.node2 == n2 ) ||
                ( edges[i].attr.node2 == n1 && edges[i].attr.node1 == n2 ) && 
                ( edges[i].weight.get() < distanceBetween ) ) {
                    distanceBetween = edges[i].weight.get();
                    smallestEdge = edges[i];
            }
        }
        return smallestEdge;
    }
}
