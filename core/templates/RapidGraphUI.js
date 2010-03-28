function RapidGraphUI()
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
        var width = 700;
        var height = 400;
        surface = Raphael( "main", width, height );
        graph = new RaphGraph( surface );
        
        initPanels();
        
        graph.edges.createNew({
            node1: graph.nodes.createNew({x:50, y:50}),
            node2: graph.nodes.createNew({x:200, y:100}),
        });
    }
    
    // init panel 
    function initPanels()
    {        
        initButtons();
        
        positionPanels();
        $(window).resize( function(){ positionPanels() });
    }
    
    function initButtons()
    { 
        // make all of the buttons buttons
        $('.ui-button').button();
        
        // all elements
        $('#all>#clear').click(function()
        {
            graph.clear();
        });
        $('#all>#selectall').click(function()
        {
            graph.select( graph.nodes.get.all() );
            graph.select( graph.edges.get.all() );
        });
        $('#all>#deleteselected').click(function()
        {
            graph.remove( graph.nodes.get.selected() );
            graph.remove( graph.edges.get.selected() );
        });

        // nodes
        $('#nodes>#createnew').click(function()
        {
            graph.nodes.createNew();
        });
        $('#nodes>#selectall').click(function()
        {
            graph.select( graph.nodes.get.all() );
        });
    
        // edges        
        $('#edges>#createNew').click(function()
        {
            var selected = graph.nodes.get.selected();
            if( selected.length == 2 ){
                graph.edges.createNew({ 
                    node1:selected[0],
                    node2:selected[1]
                });
            } else
                console.warn(
                    "buttons:edges:connectSelected: Please select exactly "+
                    "two nodes to connect."
                );
        });
        $('#edges>#selectall').click(function()
        {
            graph.select( graph.edges.get.all() );
        }); 
    }
    
    function positionPanels()
    // position the panels on the screen
    {
        var topHeight = $('#top').outerHeight(true);
        
        // top panel
        $('#top').width(
            screenWidth() - ($('#top').outerWidth(true) - $('#top').width())
        );
        
        // main panel
        $('#main').offset({
            top: topHeight,
            left: screenWidth()/2 - $('#main').outerWidth(true)/2
        });
        
        // left panel
        $('#left').offset({
            top: topHeight
        });
        $('#left').height(
            screenHeight() - topHeight -
            ($('#left').outerHeight(true) - $('#left').height())
        );
        
        // right panel
        $('#right').offset({
            top: topHeight
        });
        $('#right').height(
            screenHeight() - topHeight -
            ($('#right').outerHeight(true) - $('#right').height())
        );
    }
}
