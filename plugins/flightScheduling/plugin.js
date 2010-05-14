// plugin.js
// 
// Contains the plugin's client-side code and settings

this.settings = 
{
    title: "Flight Scheduling",
    subtitle: "Creates a map of flight paths across the United States, represented as a graph"
}

this.init = function() {
    
    safelog("::plugin:: is initializing!");
    
    $("#::plugin::_make_map").button().click( function() {
        api.graph.backgroundImg.set( "static/plugins/flightScheduling/usmap.png#jkjgf" );

        boxX = api.ui.getMainPanelSize().width;
        boxY = api.ui.getMainPanelSize().height;
        safelog(boxX + ' ' + boxY);

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
            weight: 300 + Math.ceil(Math.random() * 50 - 25),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[1],
            node2: myNodes[2],
            weight: 1500 + Math.ceil(Math.random() * 400 - 200),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[2],
            node2: myNodes[3],
            weight: 1500 + Math.ceil(Math.random() * 400 - 200),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[3],
            node2: myNodes[4],
            weight: 1000 + Math.ceil(Math.random() * 400 - 200),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[4],
            node2: myNodes[5],
            weight: 1000 + Math.ceil(Math.random() * 400 - 200),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[5],
            node2: myNodes[6],
            weight: 1000 + Math.ceil(Math.random() * 400 - 200),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[6],
            node2: myNodes[7],
            weight: 1000 + Math.ceil(Math.random() * 400 - 200),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[7],
            node2: myNodes[8],
            weight: 1500 + Math.ceil(Math.random() * 400 - 200),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[8],
            node2: myNodes[9],
            weight: 1000 + Math.ceil(Math.random() * 400 - 200),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[9],
            node2: myNodes[12],
            weight: 300 + Math.ceil(Math.random() * 50 - 25),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[10],
            node2: myNodes[11],
            weight: 1000 + Math.ceil(Math.random() * 400 - 200),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[0],
            node2: myNodes[3],
            weight: 1000 + Math.ceil(Math.random() * 400 - 200),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[1],
            node2: myNodes[3],
            weight: 1000 + Math.ceil(Math.random() * 400 - 200),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[2],
            node2: myNodes[4],
            weight: 1000 + Math.ceil(Math.random() * 400 - 200),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[3],
            node2: myNodes[5],
            weight: 1000 + Math.ceil(Math.random() * 400 - 200),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[4],
            node2: myNodes[6],
            weight: 1000 + Math.ceil(Math.random() * 400 - 200),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[4],
            node2: myNodes[7],
            weight: 1000 + Math.ceil(Math.random() * 400 - 200),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[5],
            node2: myNodes[8],
            weight: 500 + Math.ceil(Math.random() * 50 - 25),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[7],
            node2: myNodes[10],
            weight: 400 + Math.ceil(Math.random() * 50 - 25),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[10],
            node2: myNodes[13],
            weight: 1000 + Math.ceil(Math.random() * 400 - 200),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[11],
            node2: myNodes[13],
            weight: 1000 + Math.ceil(Math.random() * 400 - 200),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[9],
            node2: myNodes[13],
            weight: 1000 + Math.ceil(Math.random() * 400 - 200),
            text: null
        });
        api.graph.edges.createNew({
            node1: myNodes[8],
            node2: myNodes[13],
            weight: 1000 + Math.ceil(Math.random() * 400 - 200),
            text: null
        });

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
