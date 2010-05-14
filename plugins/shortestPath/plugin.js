// plugin.js
// 
// Contains the plugin's client-side code and settings

this.settings = 
{
    title: "Shortest Path",
    subtitle: "Implements a classic graph algorithm."
}

this.init = function() {
    
    safelog("::plugin:: is initializing!");
    
    $("#::plugin::_find_path").click( function() {
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

        distance[startIndex] = 0;
        while( nList.length > 0 ) {
            //Find the node with the smallest distance from source
            sval = infinity;
            nIndex = null;
            for( i = 0; i <= nList.length; ++i ) {
                if( distance[nList[i]] < sval ) {
                    nIndex = nList[i];
                    sval = distance[nList[i]];
                }
            }
            
            if( sval >= infinity ) {
                break;
            }
            
            // Remove node with smallest distance from the array
            for( i = 0; i < nList.length; ++i ) {
                if( nList[i] == nIndex ) {
                    nList.splice(i, 1);
                    break;
                }
            }
            neighbors = getNeighbors( nIndex, nList, nodes );
            for( i = 0; i < neighbors.length; ++i ) {
                distanceBetween = smallestEdge( nIndex, neighbors[i], edges, infinity ).label.weight.get();
                newDist = sval + distanceBetween;
                if( newDist < distance[neighbors[i]] ) {
                    distance[neighbors[i]] = newDist;
                    previous[neighbors[i]] = nIndex;
                }
            }
        }
        
        cur = endIndex;
        safelog(cur);
        while( previous[cur] != null ) {
            nodes[cur].select();
            smallestEdge( cur, previous[cur], edges, infinity ).select();
            cur = previous[cur];
        }
        nodes[cur].select();
    });

    function getNeighbors(nIndex, nList, nodes) {
        edges = graph.edges.get.all();
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

this.start = function()
{
    safelog("::plugin:: is starting!");
}

this.stop = function()
{
    safelog("::plugin:: is stopping!");
}
