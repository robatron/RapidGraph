// plugin.js
// 
// Contains the plugin's code and settings

this.settings = 
{
    title: "Oregon map",
    subtitle: "Creates a graph representing a simple Oregon map.",
}

this.init = function()
{
    console.log("::plugin:: is initializing!");
    
    //api.graph.backgroundImg.set( "static/plugins/oregonMap/bishop.jpg" );
    
    //createSimpleOregonMap();
    
    $("#::plugin::_test").click( function(){
        createSimpleOregonMap();
    });
}

this.start = function()
{
    console.log("::plugin:: is starting!");
}

this.stop = function()
{
    console.log("::plugin:: is stopping!");
}

function createSimpleOregonMap()
// create a simple Oregon map
{
    api.graph.backgroundImg.remove();
    
    var SCALE = 1.25;
    
    var seaside     = api.graph.nodes.createNew({
        x: 76*SCALE,
        y: 46*SCALE,
        text:"Seaside"
    });
    var portland    = api.graph.nodes.createNew({
        x: 202*SCALE,
        y: 54*SCALE,
        //img: "static/plugins/oregonMap/bishop.jpg",
        //height: 80,
        //width: 80,
        text:"Portland"
    });
    var gresham     = api.graph.nodes.createNew({
        x: 400*SCALE,
        y: 73*SCALE,
        text:"Gresham"
    });
    var newport     = api.graph.nodes.createNew({
        x: 74*SCALE,
        y: 156*SCALE,
        text:"Newport"
    });
    var corvallis   = api.graph.nodes.createNew({
        x: 202+60*SCALE,
        y: 164+70*SCALE,
        text:"Corvallis"
    });
    var bend        = api.graph.nodes.createNew({
        x: 394*SCALE,
        y: 203*SCALE,
        text:"Bend"
    });
    var eugene      = api.graph.nodes.createNew({
        x: 203*SCALE,
        y: 296+70*SCALE,
        text:"Eugene"
    });
    var medford     = api.graph.nodes.createNew({
        x: 306+70*SCALE,
        y: 332*SCALE,
        text:"Medford"
    });
    var brookings   = api.graph.nodes.createNew({
        x: 75*SCALE,
        y: 332*SCALE,
        text:"Brookings"
    });
    
    api.graph.edges.createNew({
        node1: seaside,
        node2: portland,
        directed: true,
        weight: 79
    });
    api.graph.edges.createNew({
        node1: portland,
        node2: gresham,
        directed: true,
        weight: 15,
        text: null
    });
    api.graph.edges.createNew({
        node1: seaside,
        node2: newport,
        directed: true,
        weight: 117,
        text: null
    });
    api.graph.edges.createNew({
        node1: portland,
        node2: corvallis,
        directed: true,
        weight: 83,
        text: null
    });
    api.graph.edges.createNew({
        node1: gresham,
        node2: bend,
        weight: 146,
        text: null
    });
    api.graph.edges.createNew({
        node1: newport,
        node2: corvallis,
        directed: true,
        weight: 60,
        text: null
    });
    api.graph.edges.createNew({
        node1: corvallis,
        node2: bend,
        directed: true,
        weight: 128,
        text: null
    });
    api.graph.edges.createNew({
        node1: newport,
        node2: brookings,
        directed: true,
        weight: 205,
        text: null
    });
    api.graph.edges.createNew({
        node1: corvallis,
        node2: eugene,
        directed: true,
        weight: 47,
        text: null
    });
    api.graph.edges.createNew({
        node1: eugene,
        node2: medford,
        directed: true,
        weight: 168,
        text: null
    });
    api.graph.edges.createNew({
        node1: medford,
        node2: bend,
        directed: true,
        weight: 173,
        text: null
    });
    api.graph.edges.createNew({
        node1: brookings,
        node2: corvallis,
        directed: true,
        weight: 253,
        text: null
    });
}
