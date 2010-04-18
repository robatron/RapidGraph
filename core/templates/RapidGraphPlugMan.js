function RapidGraphPluginManager( ui )
{
    //////////
    // DATA //
    //////////
    
    // an array of the plugins
    var plugins = []; 
    
    // the plugin class
    var plugin = function( attr ){
        
        var defaultAttr = {
            title: null,
            description: null,
            javascript: null,
            html: null
        }
        
        // extend the default attributes with the passed-in attributes and make
        // it public
        this.attr = $.extend( defaultAttr, attr );
    }
    
    // create a new API object associated with the UI for the plugins to use
    var api = new RapidGraphAPI( ui );
    var graph = ui.getGraph(); // graph object for TEMPORARY bypass of the API
    
    //////////
    // INIT //
    //////////
    
    this.init = function()
    {
        getPlugins();
        installPlugins();
    }

    function getPlugins()
    // aggregate all of the plugins
    {
        plugins.push( simpleOregonMapPlugin );
        plugins.push( computerNetworking );
    }
    
    function installPlugins()
    // install the plugins in rapidgraph
    {
        // install the plugin names in the plugin list
        for( var i=0; i<plugins.length; i++ )
            ui.installPlugin( plugins[i] );
    }

    ///////////////////////////////////
    // TEMPORARY PLUGIN STORAGE AREA //
    ///////////////////////////////////
    
    // These will eventualy be able to be aggregated from their own trees by
    // the server-side plugin manager, but for now, they're just defined below.

    var simpleOregonMapPlugin = new plugin({
        title: "Oregon map (sample plugin)",
        subtitle: "Creates a graph representing a simple Oregon map.",
        
        // CDATA blocks like this allow multiline strings
        html: (<r><![CDATA[
            
            <h3>Oregon map control</h3>
        
            <p id='oregonmap_test' class='tempUIctrl'>
                Create simple oregon map
            </p>
            
        ]]></r>).toString(),
        
        javascript: new function()
        {
            this.start = function()
            {
                $("#oregonmap_test").click( function(){ 
                    createSimpleOregonMap();
                });
            }
            
            function createSimpleOregonMap()
            // create a simple Oregon map
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
    })

    var computerNetworking = new plugin({
        title: "Computer Networking",
        subtitle: "Shows the relationship between networking and a classic graph algorithm.",
        
        // CDATA blocks like this allow multiline strings
        html: (<r><![CDATA[
            
            <h3>Computer Networking</h3>
            
            <p id='make_network' class='tempUIctrl'>
                Create a sample network
            </p>
            
            <p id='find_route' class='tempUIctrl'>
                Find the fastest route between two computers
            </p>

        ]]></r>).toString(),
        
        javascript: new function()
        {
            this.start = function()
            {
                $("#make_network").click( function(){
                    // Make a small random undirected edge-weighted graph

                    GRAPH_SIZE = 9;
                    boxX = 600; // Fix to grab dimensions of bounding box
                    boxY = 200; // ^^
                    

                    // Make some nodes
                    var myNodes = new Array();
                    for( i = 0; i < GRAPH_SIZE; ++i ) {
                        myNodes[i] = api.graph.nodes.createNew({
                            x: ( (boxX / (Math.ceil(Math.sqrt(GRAPH_SIZE)) - 1)) * (i % Math.ceil(Math.sqrt(GRAPH_SIZE))) + Math.random() * 40 + 40 ),
                            y: ( (boxY / (Math.ceil(Math.sqrt(GRAPH_SIZE)) - 1)) * Math.floor(i / Math.ceil(Math.sqrt(GRAPH_SIZE))) + Math.random() * 40 + 40 ),
                            label: null
                        });
                    }
                    
                    // Connect some of the nodes in the graph with
                    // randomly weighted edges
                    var myEdges = new Array();
                    for( i = 0; i < GRAPH_SIZE; ++i ) {
                        for( j = 0; j < GRAPH_SIZE; ++j ) {
                            if( i < j && Math.random() < 0.3 ) {
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

                $("#find_route").click( function(){
                    // Find the shortest path between two selected nodes
                    // using an implementation of the Dijkstra's
                    // Shortest Path algorithm

                    console.log("In find route");

                    // Check that all edge weights are non-negative and
                    // non-null
                    
                    for( edge in api.graph.edges.get.all() ) {
                        console.log("blah");
                        if( edge.weight == null || edge.weight < 0) {
                            alert("Graph edges must be weighted with positive values");
                            return;
                        }
                    }

                    console.log("After edge check");

                    // Check to that the user has selected exactly two nodes
                    //console.log( api.graph.nodes.get.selected() );
                    selectedNodes = api.graph.nodes.get.selected();
                    if( selectedNodes.length != 2 ) {
                        alert("Must select exactly two nodes, not " + count);
                        return;
                    }

                    // Initialize some variables
                    var distance = new Array();
                    var previous = new Array();
                    for( i in api.graph.nodes.length ) {
                        distance[i] = -1;
                        previous[i] = null;
                    }
                    start = selectedNodes[0];
                    end = selectedNoded[1];
                    
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

                    // Select the nodes and edges in the graph along the
                    // path, so that they are highlighted for the user

                    /*
                    S := empty sequence
                    u := target
                    while previous[u] is defined:
                        insert u at the beginning of S
                        u := previous[u]
                    */
                });
            }
        }
    })
}
