// rapidgraph_ui.js

function rapidgraph_ui()
{
    /////////////
    // UI DATA //
    /////////////
    var surface = null;   // will be the Raphael SVG drawing space
    var grabbedNode = null; // currently grabbed node. Null if none grabbed.
    var nodes = new Array(); // the nodes
    
    var graph = null;
    
    this.init = function()
    {
        console.group("ui.init()");
            
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
        
        console.groupEnd();
    }
    
    // init panel 
    function initPanels()
    {
        // make all of the buttons buttons
        $('.ui-button').button();
        
        $('#newnode').click(function()
        {
            new graph.node();
        });
        $('#deletenodes').click(function()
        {
            graph.selectedNodes.remove();
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
