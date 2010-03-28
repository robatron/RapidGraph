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
        var width = 800;
        var height = 200;
        surface = Raphael( "main", width, height );
        graph = new RaphGraph( surface );
        
        initPanels();
        
        graph.edges.createNew({
            node1: graph.nodes.createNew({x:50, y:50}),
            node2: graph.nodes.createNew({x:200, y:100}),
        });
        
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
        
        //var node1 = graph.nodes.createNew({x:50, y:50});
        //var node2 = graph.nodes.createNew({x:200, y:100});
        //graph.edges.createNew({ node1:node1, node2:node2 });
        
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
            graph.select( graph.nodes.get.all() );
        });

        $('#nodes>#deleteselected').click(function()
        {
            graph.remove( graph.nodes.get.selected() );
        });
    
        // 
        $('#edges>#connectselected').click(function()
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
