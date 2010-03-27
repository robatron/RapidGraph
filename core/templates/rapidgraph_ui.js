// rapidgraph_ui.js

function rapidgraph_ui()
{
    /////////////
    // UI DATA //
    /////////////
    var surface = null;   // will be the Raphael SVG drawing space
    var graph = null;   // the main graph object
    
    var temp = null;
    
    this.init = function()
    {
            
        // TODO: Make these dimensions dynamically
        var width = 300;
        var height = 300;
        surface = Raphael( "main", width, height );
        graph = new rapidgraph_graph( surface );
        
        initPanels();
        
        /*
        $(document).resize(function()
        {
            surface.setSize( screenWidth(), screenHeight() );
        });
        */
    }
    
    // init panel 
    function initPanels()
    {
        // make all of the buttons buttons
        $('.ui-button').button();
        
        $('#newnode').click(function()
        {
            graph.nodes.createNew();
        });
        
        $('#selectall').click(function()
        {
            graph.select( graph.nodes.getAll() );
        });
        
        $('#selectnone').click(function()
        {
            graph.deselect( graph.nodes.getAll() );
        });
        
        $('#deletenodes').click(function()
        {
            graph.remove( graph.nodes.getSelected() );
        });
        
        $('#clearall').click(function()
        {
            graph.clear();
        });
        
        positionPanels();
        $(window).resize( function(){ positionPanels() });
    }
    
    function positionPanels()
    {
        // center main panel
        $('#main').offset({
            top: screenHeight()/2 - $('#main').outerHeight(true)/2,
            left: screenWidth()/2 - $('#main').outerWidth(true)/2,
        });
    }
}
