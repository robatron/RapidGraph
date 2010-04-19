function RapidGraphPlugMan( ui )
{
    //////////
    // DATA //
    //////////
    
    // an array of the plugins
    var plugins = []; 
    
    // create a new API object associated with the UI for the plugins to use
    var api = new RapidGraphAPI( ui );
    var graph = ui.getGraph(); // graph object for TEMPORARY bypass of the API
    
    //////////
    // INIT //
    //////////
    
    this.init = function()
    {
        getPlugins();
        installPlugins();
        initPlugins();
    }

    function getPlugins()
    // aggregate all of the plugins from the plugins directory
    {        
        {% autoescape off %} // do not escape special HTML characters
            {% for plugin in plugins %} // for every plugin...
                
                // drop in the plugin (encapsulated in a javascript class)
                {{plugin.javascript}}
                
                // push the new plugin onto the stack
                plugins.push({
                    hash:       "{{plugin.hash}}",
                    title:      {{plugin.hash}}.settings.title,
                    subtitle:   {{plugin.hash}}.settings.subtitle,
                    javascript: {{plugin.hash}},
                    html:       (<r><![CDATA[{{plugin.ui}}]]></r>).toString()
                });
                
            {% endfor %}
        {% endautoescape %}
    }
    
    function installPlugins()
    // install the plugins in rapidgraph
    {
        // install the plugin names in the plugin list
        for( var i=0; i<plugins.length; i++ )
            ui.installPlugin( plugins[i] );
    }
    
    function initPlugins()
    // initialize all of the installed plugins
    {
        for( var i=0; i<plugins.length; i++ )
            if( plugins[i].javascript.init )
                plugins[i].javascript.init()
    }
}
