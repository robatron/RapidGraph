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
        var width = 800;
        var height = 200;
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
        
        initBottomPanel();
        
        positionPanels();
        $(window).resize( function(){ positionPanels() });
    }
    
    function initBottomPanel()
    { 
        // all elements
        $('#all>#clearall').click(function()
        {
            graph.clear();
        });

        // node elements
        $('#nodes>#createnew').click(function()
        {
            graph.nodes.createNew();
        });
        $('#nodes>#selectall').click(function()
        {
            graph.select( graph.nodes.getAll() );
        });
        $('#nodes>#selectnone').click(function()
        {
            graph.deselect( graph.nodes.getAll() );
        });
        $('#nodes>#deleteselected').click(function()
        {
            graph.remove( graph.nodes.getSelected() );
        });
    
        // 
        $('#edges>#connectselected').click(function()
        {
            ;
        });    
    }
    
    function positionPanels()
    {
        // center main panel
        $('#main').offset({
            top: 
                (screenHeight() - $('#bottom').outerHeight(true))/2 - 
                $('#main').outerHeight(true)/2,
            left: screenWidth()/2 - $('#main').outerWidth(true)/2,
        });
        
        // center bottom panel
        $('#bottom').offset({
            left: screenWidth()/2 - $('#bottom').outerWidth(true)/2
        });
    }
}
