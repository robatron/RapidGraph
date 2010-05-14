// plugin.js
// 
// Contains the plugin's client-side code and settings

this.settings = 
{
    title: "Travelling Salesman",
    subtitle: "Solves the well known travelling salesman problem."
}

this.init = function() {
    
    console.log("::plugin:: is initializing!");
    
    $("#::plugin::_make_locations").click( function() {
        api.graph.backgroundImg.set( "static/plugins/travellingSalesman/map.png" );

        GRAPH_SIZE = 7;
        boxX = api.ui.getMainPanelSize().width;
        boxY = api.ui.getMainPanelSize().height;
        console.log(boxX + ' ' + boxY);

        var myNodes = new Array();

        // Make some nodes
        myNodes[0] = api.graph.nodes.createNew({
            x: boxX / 10.8,
            y: boxY / 1.5,
            text: null,
            radius: 7,
            fill: "black",
            selFill: "black"
        });
        myNodes[1] = api.graph.nodes.createNew({
            x: boxX / 3.03,
            y: boxY / 7.66,
            text: null,
            radius: 7,
            fill: "black",
            selFill: "black"
        });
        myNodes[2] = api.graph.nodes.createNew({
            x: boxX / 2.7,
            y: boxY / 1.393,
            text: null,
            radius: 7,
            fill: "black",
            selFill: "black"
        });
        myNodes[3] = api.graph.nodes.createNew({
            x: boxX / 2.5,
            y: boxY / 1.781,
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
            x: boxX / 1.1871,
            y: boxY / 1.68105,
            text: null,
            radius: 7,
            fill: "black",
            selFill: "black"
        });
        myNodes[6] = api.graph.nodes.createNew({
            x: boxX / 1.1593,
            y: boxY / 2.83,
            text: null,
            radius: 7,
            fill: "black",
            selFill: "black"
        });
    });
    
    $("#::plugin::_make_edges").click( function() {
        // Connect the nodes in the graph with randomly weighted edges
        /*var myEdges = new Array();
        for( i = 0; i < GRAPH_SIZE; ++i ) {
            for( j = 0; j < GRAPH_SIZE; ++j ) {
                if( i < j) {
                    api.graph.edges.createNew({
                        node1: myNodes[i],
                        node2: myNodes[j],
                        weight: Math.floor(Math.random() * 9 + 1),
                        text: null
                    });
                }
            }
        }*/
    });

    $("#::plugin::_find_route").click( function() {
        
    });
};

this.start = function()
{
    console.log("::plugin:: is starting!");
}

this.stop = function()
{
    console.log("::plugin:: is stopping!");
}
