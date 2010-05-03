// RapidGraphUI.js - RapidGraph's user interface control

function RapidGraphUI()
{
    var surface = null;     // will be the Raphael SVG drawing space
    var graph = null;       // the main graph object

    this.init = function()
    {
        surface = Raphael( "main" );
        graph = new RaphGraph( surface );
        
        initPanels();
        
        // DEBUG TESTING STUFF
        graph.edges.createNew({
            node1: graph.nodes.createNew({
                x: 100,
                y: 100
            }),
            node2: graph.nodes.createNew({
                x: 200,
                y: 100
            })
        });
    }

    this.getGraph = function()
    // return the RaphGraph object
    {
        return graph;
    }
    
    this.installPlugin = function( plugin )
    // installs a plugin into the RapidGraph UI
    {        
        // install plugin into the dropdown menu
        $("#plugins_dropdown").append(
            "<option id='"+plugin.hash+"'>"+plugin.title+"</option>"
        )
        
        // fill in the plugin's HTML in the right panel when plugin is selected
        $("#"+plugin.hash).click( function()
        {
            $("#plugins_title").html( 
                "<h2 id='plugin_title'>"+plugin.title+"</h2>" +
                "<p id='plugin_subtitle'>"+plugin.subtitle+"</p>"
            );
            $("#right").html( plugin.html );
        });
        
        // bind the plugin's start function to the plugin selection if defined
        if( plugin.javascript.start )
            $("#"+plugin.hash).click( plugin.javascript.start );
    }
    
    this.getMainPanelSize = function()
    // return the size of the main panel as a dictionary of height and width
    {
        return {
            height: $('#main').height(),
            width: $('#main').width()
        }
    }
    
    function initPanels()
    // init panels
    {        
        initButtons();
        
        // position the panels, and do so everytime the window is resized
        positionPanels();
        $(window).resize( function(){ positionPanels() });
    }
    
    function initButtons()
    {       
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
        $('#edges>#createnew').click(function()
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

    // to get the viewport dimensions
    function screenHeight(){ return Screen.getViewportHeight() };
    function screenWidth(){ return Screen.getViewportWidth() };
}
