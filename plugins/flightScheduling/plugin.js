// plugin.js
// 
// Contains the plugin's client-side code and settings

this.settings = 
{
    title: "Flight Scheduling",
    subtitle: "Shows the relationship between country-wide flight scheduling and a classic graph algorithm."
}

this.init = function() {
    
    console.log("::plugin:: is initializing!");
    
    $("#::plugin::_make_map").click( function() {
        api.graph.backgroundImg.set( "static/plugins/flightScheduling/usmap.png#jkjgf" );

        boxX = api.ui.getMainPanelSize().width;
        boxY = api.ui.getMainPanelSize().height;
        console.log(boxX + ' ' + boxY);

        /*
         * Make some city nodes
         */

        var myNodes = new Array();
        
        // Seattle
        myNodes[0] = api.graph.nodes.createNew({
            x: boxX / 10.3,
            y: boxY / 17.6,
            text: null,
            radius: 5,
        });
        
        // Portland
        myNodes[1] = api.graph.nodes.createNew({
            x: boxX / 15.9,
            y: boxY / 6.44,
            text: null,
            radius: 5,
        });
        
        // Los Angeles
        myNodes[2] = api.graph.nodes.createNew({
            x: boxX / 12.6,
            y: boxY / 1.68,
            text: null,
            radius: 5,
        });
        
        // Billings
        myNodes[3] = api.graph.nodes.createNew({
            x: boxX / 3.18,
            y: boxY / 4.9,
            text: null,
            radius: 5,
        });
        
        // Denver
        myNodes[4] = api.graph.nodes.createNew({
            x: boxX / 3.01,
            y: boxY / 2.13,
            text: null,
            radius: 5,
        });
        
        // Mineapolis
        myNodes[5] = api.graph.nodes.createNew({
            x: boxX / 1.87,
            y: boxY / 4.04,
            text: null,
            radius: 5,
        });
        
        // Kansas City
        myNodes[6] = api.graph.nodes.createNew({
            x: boxX / 1.95,
            y: boxY / 2,
            text: null,
            radius: 5,
        });
        
        // Houstin
        myNodes[7] = api.graph.nodes.createNew({
            x: boxX / 1.96,
            y: boxY / 1.19,
            text: null,
            radius: 5,
        });
        
        // Chicago
        myNodes[8] = api.graph.nodes.createNew({
            x: boxX / 1.58,
            y: boxY / 2.73,
            text: null,
            radius: 5,
        });
        
        // Washington D.C.
        myNodes[9] = api.graph.nodes.createNew({
            x: boxX / 1.19,
            y: boxY / 2.38,
            text: null,
            radius: 5,
        });
        
        // Jackson
        myNodes[10] = api.graph.nodes.createNew({
            x: boxX / 1.63,
            y: boxY / 1.34,
            text: null,
            radius: 5,
        });
        
        // Miami
        myNodes[11] = api.graph.nodes.createNew({
            x: boxX / 1.21,
            y: boxY / 1.074,
            text: null,
            radius: 5,
        });
        
        // New York
        myNodes[12] = api.graph.nodes.createNew({
            x: boxX / 1.14,
            y: boxY / 3.27,
            text: null,
            radius: 5,
        });
        
        // Charleston
        myNodes[13] = api.graph.nodes.createNew({
            x: boxX / 1.24,
            y: boxY / 1.5,
            text: null,
            radius: 5,
        });

        // Connect some of the cities by weighted flightpaths
        var myEdges = new Array();
        api.graph.edges.createNew({
            node1: myNodes[0],
            node2: myNodes[1],
            weight: 300 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[1],
            node2: myNodes[2],
            weight: 1500 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[2],
            node2: myNodes[3],
            weight: 1500 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[3],
            node2: myNodes[4],
            weight: 1000 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[4],
            node2: myNodes[5],
            weight: 1000 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[5],
            node2: myNodes[6],
            weight: 1000 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[6],
            node2: myNodes[7],
            weight: 1000 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[7],
            node2: myNodes[8],
            weight: 1500 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[8],
            node2: myNodes[9],
            weight: 1000 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[9],
            node2: myNodes[12],
            weight: 300 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[10],
            node2: myNodes[11],
            weight: 1000 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[0],
            node2: myNodes[3],
            weight: 1000 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[1],
            node2: myNodes[3],
            weight: 1000 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[2],
            node2: myNodes[4],
            weight: 1000 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[3],
            node2: myNodes[5],
            weight: 1000 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[4],
            node2: myNodes[6],
            weight: 1000 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[4],
            node2: myNodes[7],
            weight: 1000 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[5],
            node2: myNodes[8],
            weight: 500 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[7],
            node2: myNodes[10],
            weight: 400 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[10],
            node2: myNodes[13],
            weight: 1000 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[11],
            node2: myNodes[13],
            weight: 1000 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[9],
            node2: myNodes[13],
            weight: 1000 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[8],
            node2: myNodes[13],
            weight: 1000 + Math.ceil(Math.random() * 200 - 100),
            text: null
        });

    });

    $("#::plugin::_find_route").click( function() {
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
        console.log(cur);
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
    console.log("::plugin:: is starting!");
}

this.stop = function()
{
    console.log("::plugin:: is stopping!");
}
