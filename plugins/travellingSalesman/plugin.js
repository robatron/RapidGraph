// plugin.js
// 
// Contains the plugin's client-side code and settings

this.settings = 
{
    title: "Travelling Salesman",
    subtitle: "Solves the well known travelling salesman problem"
}

this.init = function() {
    
    safelog("::plugin:: is initializing!");
    
    $("#::plugin::_make_locations").click( function() {
        api.graph.backgroundImg.set( "static/plugins/travellingSalesman/map.png" );

        GRAPH_SIZE = 7;
        boxX = api.ui.getMainPanelSize().width;
        boxY = api.ui.getMainPanelSize().height;
        safelog(boxX + ' ' + boxY);

        myNodes = new Array();

        // Make some nodes
        myNodes[0] = api.graph.nodes.createNew({
            x: boxX / 8.53,
            y: boxY / 1.481,
            text: null,
            radius: 7,
            fill: "black",
            selFill: "black"
        });
        myNodes[1] = api.graph.nodes.createNew({
            x: boxX / 3.016,
            y: boxY / 8.22,
            text: null,
            radius: 7,
            fill: "black",
            selFill: "black"
        });
        myNodes[2] = api.graph.nodes.createNew({
            x: boxX / 2.46,
            y: boxY / 1.415,
            text: null,
            radius: 7,
            fill: "black",
            selFill: "black"
        });
        myNodes[3] = api.graph.nodes.createNew({
            x: boxX / 2.3,
            y: boxY / 1.713,
            text: null,
            radius: 7,
            fill: "black",
            selFill: "black"
        });
        myNodes[4] = api.graph.nodes.createNew({
            x: boxX / 1.697,
            y: boxY / 1.0705,
            text: null,
            radius: 7,
            fill: "black",
            selFill: "black"
        });
        myNodes[5] = api.graph.nodes.createNew({
            x: boxX / 1.228,
            y: boxY / 1.72,
            text: null,
            radius: 7,
            fill: "black",
            selFill: "black"
        });
        myNodes[6] = api.graph.nodes.createNew({
            x: boxX / 1.1616,
            y: boxY / 2.77,
            text: null,
            radius: 7,
            fill: "black",
            selFill: "black"
        });
    });
    
    $("#::plugin::_make_edges").click( function() {
        // Connect the nodes in the graph with randomly weighted edges
        myEdges = new Array();
        for( i = 0; i < GRAPH_SIZE; ++i ) {
            myEdges[i] = new Array();
            for( j = 0; j < GRAPH_SIZE; ++j ) {
                if( i < j) {
                    myEdges[i][j] = api.graph.edges.createNew({
                        node1: myNodes[i],
                        node2: myNodes[j],
                        weight: Math.floor(Math.random() * 9 + 1),
                        text: null
                    });
                }
            }
        }
    });

    $("#::plugin::_find_route").click( function() {
        l = new Array();
        
        for( i = 0; i < GRAPH_SIZE; ++i )
            l[i] = i;

        // Make "infinity" larger than any possible distance between
        //  two nodes
        infinity = 1;
        for( i = 0; i < myEdges.length; ++i ) {
            for( j = 0; j < myEdges[i].length; ++j ) {
                if( i < j) {
                    infinity += myEdges[i][j].label.weight.get();
                }
            }
        }
        
        // Go through all of the permutations of the list of nodes, keep
        // track of the shortest path found so far
        best_path_so_far = null;
        best_weight_so_far = infinity;
        while(1) {
            // Calculate the weight of the current path
            cur_weight = 0;
            for( i = 0; i < GRAPH_SIZE - 1; ++i ) {
                if( l[i] < l[i+1] )
                    cur_weight += myEdges[ l[i] ][ l[i+1] ].label.weight.get();
                else
                    cur_weight += myEdges[ l[i+1] ][ l[i] ].label.weight.get();
            }
            
            // If the weight of the current path is better than the best
            // weight so far, update the current best path and weight
            // values
            if( cur_weight < best_weight_so_far ) {
                best_weight_so_far = cur_weight;
                best_path_so_far = l;
            }
            
            // Use some fancy logic to move to the next permutation
            lowest = -1;
            for( i = 0; i < GRAPH_SIZE - 1; ++i ) 
                if( l[i] < l[i+1] )
                    lowest = i;
            if( lowest == -1 )
                break;
            lowest2 = 0;
            for( j = 0; j < GRAPH_SIZE; ++j )
                if( l[j] > l[lowest] )
                    lowest2 = j;
            temp = l[lowest];
            l[lowest] = l[lowest2];
            l[lowest2] = temp;
            postfix = l.slice(lowest + 1);
            postfix.reverse();
            l = l.slice(0, lowest + 1);
            l = l.concat(postfix);
        }

        // Make directed, selected edges that represent the best path found
        best = best_path_so_far;
        for( i = 0; i < GRAPH_SIZE - 1; ++i ) {
            if( best[i] < best[i+1] )
                w = myEdges[ best[i] ][ best[i+1] ].label.weight.get();
            else
                w = myEdges[ best[i+1] ][ best[i] ].label.weight.get();
            api.graph.edges.createNew({
                node1: myNodes[best[i]],
                node2: myNodes[best[i + 1]],
                weight: w,
                directed: true,
                selected: true,
                text: null
            });
        }
        
        // Get rid of all the other edges
        for( i = 0; i < myEdges.length; ++i ) {
            for( j = 0; j < myEdges[i].length; ++j ) {
                if( i < j) {
                    myEdges[i][j].remove();
                }
            }
        }
    });
};

this.start = function()
{
    safelog("::plugin:: is starting!");
}

this.stop = function()
{
    safelog("::plugin:: is stopping!");
}
