// plugin.js
// 
// Contains the plugin's client-side code and settings

this.settings = 
{
    title: "Computer Networking",
    subtitle: "Shows the relationship between networking and a classic graph algorithm."
}

this.start = function() {
    $("#make_network").click( function() {
        // Make a small random undirected edge-weighted graph

        GRAPH_SIZE = 9;     // The number of nodes in the graph
        PERTURBATION = 30;  // The number of pixels that nodes can be randomly perturbed
        NODE_RADIUS = 25;   // The radius of a node image
        boxX = api.ui.getMainPanelSize().width - (2 * NODE_RADIUS);
        boxY = api.ui.getMainPanelSize().height - (2 * NODE_RADIUS);
        
        // Make some nodes
        var myNodes = new Array();
        for( i = 0; i < GRAPH_SIZE; ++i ) {
            myNodes[i] = api.graph.nodes.createNew({
                x: ( ((boxX - (PERTURBATION)) / (Math.ceil(Math.sqrt(GRAPH_SIZE)) - 1)) * (i % Math.ceil(Math.sqrt(GRAPH_SIZE))) + Math.random() * PERTURBATION + NODE_RADIUS),
                y: ( ((boxY - (PERTURBATION)) / (Math.ceil(Math.sqrt(GRAPH_SIZE)) - 1)) * Math.floor(i / Math.ceil(Math.sqrt(GRAPH_SIZE))) + Math.random() * PERTURBATION + NODE_RADIUS),
                text: null
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

    $("#find_route").click( function() {
        // Find the shortest path between two selected nodes
        // using an implementation of the Dijkstra's
        // Shortest Path algorithm

        // Check that all edge weights are non-negative and non-null
        edges = graph.edges.get.all();
        for( i = 0; i < edges.length; ++i ) {
            if( edges[i].label.weight.get() == null || edges[i].label.weight.get() < 0) {
                alert("Graph edges must be weighted with positive values!");
                return;
            }
        }

        // Check to that the user has selected exactly two nodes
        selectedNodes = graph.nodes.get.selected();
        if( selectedNodes.length != 2 ) {
            alert("Must select exactly two nodes, not " + selectedNodes.length + "!");
            return;
        }

        // Initialize some variables
        var distance = new Array();
        var previous = new Array();
        var nList = new Array();
        startIndex = -1;
        endIndex = -1;
        nodes = graph.nodes.get.all()

        // Make "infinity" larger than any possible distance between
        //  two nodes
        infinity = 1;
        for( i = 0; i < edges.length; ++i )
            infinity += edges[i].label.weight.get();

console.log("All nodes: " + nodes);
        for( i = 0; i < nodes.length; ++i ) {
            nList.push(i);
            previous[i] = null;
            if( selectedNodes[0] == nodes[i] ) {
                startIndex = i;
                distance[i] = 0;
            }
            else {
                distance[i] = infinity;
            }
            if( selectedNodes[1] == nodes[i] ) {
                endIndex = i;
            }
        }

console.log("Start index: " + startIndex);
console.log("End index: " + endIndex);

        distance[startIndex] = 0;
        while( nList.length != 0 ) {
console.log("nlist: " + nList);
            //Find the node with the smallest distance from source
            sval = infinity;
            nIndex = null;
            for( i = 0; i <= nList.length; ++i ) {
                if( distance[nList[i]] < sval ) {
                    nIndex = nList[i];
                    sval = distance[nList[i]];
                }
            }
            
console.log("Distances: " + distance);
            
            if( sval >= infinity ) {
console.log("Done");
                break;
            }
            
            // Remove smallest node from array
            for( i = 0; i < nList.length; ++i ) {
                if( nList[i] == nIndex ) {
                    nList.splice(i, i);
                    break;
                }
            }
            neighbors = getNeighbors( nIndex, nList, nodes );
console.log("Current Node: " + nIndex);
console.log("Neighbors: " + neighbors);
            for( i = 0; i < neighbors.length; ++i ) {
                distanceBetween = smallestEdge( nIndex, neighbors[i], edges, infinity ).label.weight.get();
                newDist = sval + distanceBetween;
                if( newDist < distance[neighbors[i]] ) {
                    distance[neighbors[i]] = newDist;
                    previous[neighbors[i]] = nIndex;
                }
/*console.log("Neighbors: " + neighbors);
console.log("neighbors.length: " + neighbors.length);
console.log("i: " + i);
console.log("neighbors[i]: " + neighbors[i]);
console.log("distanceBetween node: " + nIndex + " and node " + neighbors[i] + " = " + distanceBetween);*/
            }
//console.log("About to break");
//break;
        }
        
        cur = endIndex;
        console.log(cur);
        while( previous[cur] != null ) {
            nodes[cur].select();
            smallestEdge( nodes[cur], previous[cur], edges, infinity ).select();
            cur = previous[cur];
        }
        nodes[cur].select();
    });

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

        /*
        S := empty sequence
        u := target
        while previous[u] is defined:
            insert u at the beginning of S
            u := previous[u]
        */

    function getNeighbors(nIndex, nList, nodes) {
        edges = graph.edges.get.all();
/*console.log("Neighbors... nodes: " + nodes);
console.log("Neighbors... edges: " + edges);
console.log("Neighbors... nList: " + nList);
console.log("Neighbors... nIndex: " + nIndex);*/
        var neighbors = new Array();
        for( gn1_ = 0; gn1_ < nList.length; ++gn1_ ) {
            for( gn2_ = 0; gn2_ < edges.length; ++gn2_ ) {
                if( edges[gn2_].attachedTo(nodes[nList[gn1_]]) && edges[gn2_].attachedTo(nodes[nIndex]) ) {
                    neighbors.push(nList[gn1_]);
                }
            }
        }
        return neighbors;
    }

    function smallestEdge( n1, n2, edges, infinity ) {
        nodes = graph.nodes.get.all();
        distanceBetween = infinity;
        result = null;
        for( se_ = 0; se_ < edges.length; ++se_ ) {
            if( edges[se_].attachedTo(nodes[n1]) && edges[se_].attachedTo(nodes[n2]) && 
              ( edges[se_].label.weight.get() < distanceBetween ) ) {
                    distanceBetween = edges[se_].label.weight.get();
                    result = edges[se_];
            }
        }
        return result;
    }
}
