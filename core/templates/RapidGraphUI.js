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
        initButtons();
    }

    this.getGraph = function(){ return graph }
    // return the RaphGraph object
    
    this.installPlugins = function( plugins )
    // installs a plugin into the RapidGraph UI
    {   
        var thisPlugin = null; // holds the current plugin
        
        // clear the plugins accordian so it can be filled from scratch
        $("#plugins_accordion").html("");
        
        for( var i=0; i<plugins.length; i++ ){
            
            $("#plugins_accordion").append(
                "<h3 id='"+plugins[i].hash+"'><a href='#'>"+plugins[i].title+"</a></h3>"+
                "<div>"+
                    plugins[i].html+
                "</div>"
            );

            $("#"+plugins[i].hash).data('plugin', plugins[i]);
            $("#"+plugins[i].hash).data('start', function( p )
            {
                $("#plugins_title").html( 
                    "<h2 id='plugin_title'>"+p.title+"</h2>" +
                    "<p id='plugin_subtitle'>"+p.subtitle+"</p>"
                );
                
                if( p.javascript.start )
                    p.javascript.start();
            });
            $("#"+plugins[i].hash).data('stop', function( p )
            {                
                if( p.javascript.stop )
                    p.javascript.stop();
            });
        }
        
        // initialize the accordian
        $("#plugins_accordion").accordion({
            
            // make sure it fills the entire container
            fillSpace: true,
            
            // set up the start/stop hooks
            changestart: function( event, ui )
            {                
                ui.newHeader.data('start')( ui.newHeader.data('plugin') );
                ui.oldHeader.data('stop')( ui.oldHeader.data('plugin') );
            }
        });
        
        positionPanels();
    }
    
    this.getMainPanelSize = function()
    // return the size of the main panel as a dictionary of height and width
    {
        return {
            height: $('#main').height(),
            width: $('#main').width()
        }
    }
    
    // to get the viewport dimensions
    function screenHeight(){ return Screen.getViewportHeight() };
    function screenWidth(){ return Screen.getViewportWidth() };
    
    function initPanels()
    // init panels
    {                
        // position the panels, and do so everytime the window is resized
        positionPanels();
        $(window).resize( function(){ positionPanels() });
    }
    
    function initButtons()
    {       
        $('#button_new').button({
            text: false,
            icons: { primary: 'ui-icon-plusthick' }
        }).click(function()
        {
            graph.nodes.createNew();
        });
        
        $('#button_delete').button({
            text: false,
            icons: { primary: 'ui-icon-minusthick' }
        }).click(function()
        {
            graph.remove( graph.nodes.get.selected() );
            graph.remove( graph.edges.get.selected() );
        });
        
        $('#button_selectAll').button({
            text: false,
            icons: { primary: 'ui-icon-star' }
        }).click(function()
        {
            graph.select( graph.nodes.get.all() );
            graph.select( graph.edges.get.all() );
        });
        
        $('#button_undo').button({
            text: false,
            icons: { primary: 'ui-icon-seek-prev' }
        }).click(function()
        {
            ;
        });
        
        $('#button_redo').button({
            text: false,
            icons: { primary: 'ui-icon-seek-next' }
        }).click(function()
        {
            ;
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
            left: $('#left').outerWidth(true) 
        });
        surface.setSize( $('#main').innerWidth(), $('#main').innerHeight() );
    }
}
