// RapidGraphAPI.js
//   The javascript interface for the plugins to use

function RapidGraphAPI( ui )
{
    var graph = ui.getGraph();  // get the graph object from the UI

    //////////////////
    // UI FUNCTIONS //
    //////////////////

    this.ui =
    // all ui functions. Accessed via api.ui.foo
    {
        getMainPanelSize: function(){ return ui.getMainPanelSize() }
    };

    /////////////////////
    // GRAPH FUNCTIONS //
    /////////////////////
    
    this.graph =
    // all graph related functions. Accessed via api.graph.foo
    {
        clear: function(){ return graph.clear() },
        // clears all of the elements
        
        remove: function(elems){ return graph.remove(elems) },
        // remove the specified node, nodes, edge, or edges
        
        select: function(elems){ return graph.select(elems) },
        // select the specified node, nodes, edge, or edges
        
        deselect: function(elems){ return graph.deselect(elems) },
        // deselect the specified node, nodes, edge, or edges
        
        deselect:,
        
        nodes: 
        // functions related to the nodes set
        {
            createNew: function(attr){ return graph.nodes.createNew(attr) },
            // create a new node
            
            get:
            // functions related to grabbing nodes
            {
                all: function(){ return graph.nodes.get.all() },
                // return all nodes
                
                selected: function(){ return graph.nodes.get.selected() },
                // return all of the selected nodes
                
                deselected: function(){ return graph.nodes.get.unselected() },
                // return all of the unselected nodes
            }
        },
        
        edges:
        // functions related to the edges set
        {
            createNew: function(attr){ return graph.edges.createNew( attr ) };
            // create a new edge
            
            get:
            // functions related to grabbing edges
            {
                all: function(){ return graph.edges.get.all() },
                // return all edges
                
                selected: function(){ return graph.edges.get.selected() },
                // return all of the selected edges
                
                deselected: function(){ return graph.edges.get.unselected() },
                // return all of the unselected edges
            }
        }
    };
}
