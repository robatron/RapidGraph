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
    // installs the plugins into the RapidGraph UI
    {        
        // clear the plugins accordian so it can be filled from scratch
        $("#plugins_accordion").html("");
        
        // for every plugin, write it into the accordian element, and attach
        // start/stop hooks to the corresponding DOM element
        for( var i=0; i<plugins.length; i++ ){
            
            // write the current plugin into the accordian element
            $("#plugins_accordion").append(
                "<h3 id='"+plugins[i].hash+"'>"+
                "   <a href='#'>"+plugins[i].title+"</a>"+
                "</h3>"+
                "<div>"+
                    plugins[i].html+
                "</div>"
            );

            // write the current plugin and its start/stop hooks into its
            // corresponding DOM element
            $("#"+plugins[i].hash).data('plugin', plugins[i]);
            $("#"+plugins[i].hash).data('start', function( p )
            {
                $("#plugins_title").fadeOut("fast", function(){
                    $(this).html( 
                        "<h2 id='plugin_title'>"+p.title+"</h2>" +
                        "<p id='plugin_subtitle'>"+p.subtitle+"</p>"
                    ).fadeIn("fast");
                });
                
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
        
        // reposition all of the panels since the DOM has changed
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
            
            icons: { primary: 'ui-icon-plusthick' }
        }).click(function()
        {
            graph.nodes.createNew();
        });
        
        $('#button_delete').button({
            
            icons: { primary: 'ui-icon-minusthick' }
        }).click(function()
        {
            graph.remove( graph.nodes.get.selected() );
            graph.remove( graph.edges.get.selected() );
        });
        
        $('#button_selectAll').button({
            
            icons: { primary: 'ui-icon-star' }
        }).click(function()
        {
            graph.select( graph.nodes.get.all() );
            graph.select( graph.edges.get.all() );
        });
        
        $('#button_reset').button({
            icons: { primary: 'ui-icon-cancel' }
        }).click(function()
        {
            graph.clear();
        });
        
        $('#button_undo').button({
            icons: { primary: 'ui-icon-seek-prev' }
        }).click(function()
        {
            graph.undo();
        });
        
        $('#button_redo').button({
            icons: { primary:'ui-icon-seek-next' }
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
    
        // resize the accordian
        $("#plugins_accordion").accordion("resize");
    }
}
