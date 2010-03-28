// RapidGraphUI.js - RapidGraph's user interface control

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
        createSimpleOregonMap();
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
        $('#main').width(
            screenWidth() -
            $('#left').outerWidth(true) - $('#right').outerWidth(true) -
            ($('#main').outerWidth(true) - $('#main').width())
        );
        $('#main').height(
            screenHeight() -
            $('#top').outerHeight(true) -
            ($('#main').outerHeight(true) - $('#main').height())
        );               
        $('#main').offset({
            top: topHeight,
            left: screenWidth()/2 - $('#main').outerWidth(true)/2
        });
        surface.setSize( $('#main').innerWidth(), $('#main').innerHeight() );
        
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

    function createSimpleOregonMap()
    {
        var seaside     = graph.nodes.createNew({
            x: 76,
            y: 46,
            label:"Seaside"
        });
        var portland    = graph.nodes.createNew({
            x: 202,
            y: 54,
            label:"Portland"
        });
        var gresham     = graph.nodes.createNew({
            x: 310,
            y: 73,
            label:"Gresham"
        });
        var newport     = graph.nodes.createNew({
            x: 74,
            y: 156,
            label:"Newport"
        });
        var corvallis   = graph.nodes.createNew({
            x: 202,
            y: 164,
            label:"Corvallis"
        });
        var bend        = graph.nodes.createNew({
            x: 394,
            y: 203,
            label:"Bend"
        });
        var eugene      = graph.nodes.createNew({
            x: 203,
            y: 296,
            label:"Eugene"
        });
        var medford     = graph.nodes.createNew({
            x: 306,
            y: 332,
            label:"Medford"
        });
        var brookings   = graph.nodes.createNew({
            x: 75,
            y: 332,
            label:"Brookings"
        });
        
        graph.edges.createNew({
            node1: seaside,
            node2: portland,
            weight: 79,
            label: null
        });
        graph.edges.createNew({
            node1: portland,
            node2: gresham,
            weight: 15,
            label: null
        });
        graph.edges.createNew({
            node1: seaside,
            node2: newport,
            weight: 117,
            label: null
        });
        graph.edges.createNew({
            node1: portland,
            node2: corvallis,
            weight: 83,
            label: null
        });
        graph.edges.createNew({
            node1: gresham,
            node2: bend,
            weight: 146,
            label: null
        });
        graph.edges.createNew({
            node1: newport,
            node2: corvallis,
            weight: 60,
            label: null
        });
        graph.edges.createNew({
            node1: corvallis,
            node2: bend,
            weight: 128,
            label: null
        });
        graph.edges.createNew({
            node1: newport,
            node2: brookings,
            weight: 205,
            label: null
        });
        graph.edges.createNew({
            node1: corvallis,
            node2: eugene,
            weight: 47,
            label: null
        });
        graph.edges.createNew({
            node1: eugene,
            node2: medford,
            weight: 168,
            label: null
        });
        graph.edges.createNew({
            node1: medford,
            node2: bend,
            weight: 173,
            label: null
        });
        graph.edges.createNew({
            node1: brookings,
            node2: corvallis,
            weight: 253,
            label: null
        });
    }
}
