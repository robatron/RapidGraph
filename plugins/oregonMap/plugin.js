// plugin.js
// 
// Contains the plugin's code and settings

this.settings = 
{
    title: "Oregon map (sample plugin)",
    subtitle: "Creates a graph representing a simple Oregon map.",
}

this.init = function()
{
    console.log("::plugin:: is initializing!");
    
    createSimpleOregonMap();
}

this.start = function()
{
    console.log("::plugin:: is starting!");
    
    $("#::plugin::_test").click( function(){
        createSimpleOregonMap();
    });
}

this.stop = function()
{
    console.log("::plugin:: is stopping!");
}

function createSimpleOregonMap()
// create a simple Oregon map
{
    var seaside     = api.graph.nodes.createNew({
        x: 76,
        y: 46,
        text:"Seaside"
    });
    var portland    = api.graph.nodes.createNew({
        x: 202,
        y: 54,
        text:"Portland"
    });
    var gresham     = api.graph.nodes.createNew({
        x: 310,
        y: 73,
        text:"Gresham"
    });
    var newport     = api.graph.nodes.createNew({
        x: 74,
        y: 156,
        text:"Newport"
    });
    var corvallis   = api.graph.nodes.createNew({
        x: 202,
        y: 164,
        text:"Corvallis"
    });
    var bend        = api.graph.nodes.createNew({
        x: 394,
        y: 203,
        text:"Bend"
    });
    var eugene      = api.graph.nodes.createNew({
        x: 203,
        y: 296,
        text:"Eugene"
    });
    var medford     = api.graph.nodes.createNew({
        x: 306,
        y: 332,
        text:"Medford"
    });
    var brookings   = api.graph.nodes.createNew({
        x: 75,
        y: 332,
        text:"Brookings"
    });
    
    api.graph.edges.createNew({
        node1: seaside,
        node2: portland,
        weight: 79,
        text: "something"
    });
    api.graph.edges.createNew({
        node1: portland,
        node2: gresham,
        weight: 15,
        text: null
    });
    api.graph.edges.createNew({
        node1: seaside,
        node2: newport,
        weight: 117,
        text: null
    });
    api.graph.edges.createNew({
        node1: portland,
        node2: corvallis,
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
        weight: 60,
        text: null
    });
    api.graph.edges.createNew({
        node1: corvallis,
        node2: bend,
        weight: 128,
        text: null
    });
    api.graph.edges.createNew({
        node1: newport,
        node2: brookings,
        weight: 205,
        text: null
    });
    api.graph.edges.createNew({
        node1: corvallis,
        node2: eugene,
        weight: 47,
        text: null
    });
    api.graph.edges.createNew({
        node1: eugene,
        node2: medford,
        weight: 168,
        text: null
    });
    api.graph.edges.createNew({
        node1: medford,
        node2: bend,
        weight: 173,
        text: null
    });
    api.graph.edges.createNew({
        node1: brookings,
        node2: corvallis,
        weight: 253,
        text: null
    });
}
