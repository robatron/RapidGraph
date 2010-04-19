function RapidGraphPlugMan( ui )
{
    //////////
    // DATA //
    //////////
    
    // an array of the plugins
    var plugins = []; 
    
    // the plugin class
    var plugin = function( attr ){
        
        var defaultAttr = {
            title: null,
            description: null,
            javascript: null,
            html: null
        }
        
        // extend the default attributes with the passed-in attributes and make
        // it public
        this.attr = $.extend( defaultAttr, attr );
    }
    
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
    }

    function getPlugins()
    // aggregate all of the plugins from the plugins directory
    {        
        {% autoescape off %} // do not escape special HTML characters
            {% for plugin in plugins %} // for every plugin...
                
                // drop in the plugin (encapsulated in a javascript class)
                {{plugin.javascript}}
                
                // push the new plugin onto the stack
                plugins.push( 
                    new plugin({
                        title: {{plugin.hash}}.settings.title,
                        subtitle: {{plugin.hash}}.settings.title,
                        javascript: {{plugin.hash}},
                        html: (<r><![CDATA[{{plugin.ui}}]]></r>).toString()
                    })
                );
                
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
}
