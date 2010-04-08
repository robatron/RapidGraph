function RapidGraphAPI( ui )
{
    var graph = ui.getGraph();  // get the graph object from the UI

    //////////////////
    // UI FUNCTIONS //
    //////////////////

    this.ui =
    // all ui functions. Accessed via api.ui.foo
    {
    };

    /////////////////////
    // GRAPH FUNCTIONS //
    /////////////////////
    
    this.graph =
    // all graph related functions. Accessed via api.graph.foo
    {
        nodes: 
        // functions related to the nodes set
        {
            createNew: function(attr)
            // create a new node
            {
                return graph.nodes.createNew(attr);
            },
        },
        
        edges:
        // functions related to the edges set
        {
            createNew: function(attr)
            // create a new edge
            {
                return graph.edges.createNew( attr );
            },
        }
    };
}
