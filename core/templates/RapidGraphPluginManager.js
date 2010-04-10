function RapidGraphPluginManager( ui )
{
    //////////
    // DATA //
    //////////
    
    // create a new API object associated with the UI for the plugins to use
    var api = new RapidGraphAPI( ui );
    
    // an array of the plugins
    var plugins = []; 
    
    // the plugin class
    var plugin = function( attr ){
        
        var defaultAttr = {
            title: null,
            javascript: null,
            html: null
        }
        
        // extend the default attributes with the passed-in attributes and make
        // it public
        this.attr = $.extend( defaultAttr, attr );
    }
    
    this.init = function()
    {
        getPlugins();
        installPlugins();
        
        createSimpleOregonMap();
    }

    function getPlugins()
    // aggregate all of the plugins
    {
        plugins.push(
            new plugin({
                title: "Sample plugin - Create Oregon map",
                javascript: function(){alert("oh hai!")},
                html: "<h1>Oh Hai!</h1>"
            })
        );
    }
    
    function installPlugins()
    // install the plugins in rapidgraph
    {
        // install the plugin names in the plugin list
        for( var i=0; i<plugins.length; i++ )
            plugins[i]
    }

    function createSimpleOregonMap()
    {
        var seaside     = api.graph.nodes.createNew({
            x: 76,
            y: 46,
            label:"Seaside"
        });
        var portland    = api.graph.nodes.createNew({
            x: 202,
            y: 54,
            label:"Portland"
        });
        var gresham     = api.graph.nodes.createNew({
            x: 310,
            y: 73,
            label:"Gresham"
        });
        var newport     = api.graph.nodes.createNew({
            x: 74,
            y: 156,
            label:"Newport"
        });
        var corvallis   = api.graph.nodes.createNew({
            x: 202,
            y: 164,
            label:"Corvallis"
        });
        var bend        = api.graph.nodes.createNew({
            x: 394,
            y: 203,
            label:"Bend"
        });
        var eugene      = api.graph.nodes.createNew({
            x: 203,
            y: 296,
            label:"Eugene"
        });
        var medford     = api.graph.nodes.createNew({
            x: 306,
            y: 332,
            label:"Medford"
        });
        var brookings   = api.graph.nodes.createNew({
            x: 75,
            y: 332,
            label:"Brookings"
        });
        
        api.graph.edges.createNew({
            node1: seaside,
            node2: portland,
            weight: 79,
            label: null
        });
        api.graph.edges.createNew({
            node1: portland,
            node2: gresham,
            weight: 15,
            label: null
        });
        api.graph.edges.createNew({
            node1: seaside,
            node2: newport,
            weight: 117,
            label: null
        });
        api.graph.edges.createNew({
            node1: portland,
            node2: corvallis,
            weight: 83,
            label: null
        });
        api.graph.edges.createNew({
            node1: gresham,
            node2: bend,
            weight: 146,
            label: null
        });
        api.graph.edges.createNew({
            node1: newport,
            node2: corvallis,
            weight: 60,
            label: null
        });
        api.graph.edges.createNew({
            node1: corvallis,
            node2: bend,
            weight: 128,
            label: null
        });
        api.graph.edges.createNew({
            node1: newport,
            node2: brookings,
            weight: 205,
            label: null
        });
        api.graph.edges.createNew({
            node1: corvallis,
            node2: eugene,
            weight: 47,
            label: null
        });
        api.graph.edges.createNew({
            node1: eugene,
            node2: medford,
            weight: 168,
            label: null
        });
        api.graph.edges.createNew({
            node1: medford,
            node2: bend,
            weight: 173,
            label: null
        });
        api.graph.edges.createNew({
            node1: brookings,
            node2: corvallis,
            weight: 253,
            label: null
        });
    }
}
