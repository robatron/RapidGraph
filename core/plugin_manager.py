import os
from django.conf import settings

def get_plugins():
    # Returns an array of dictionaries representing the found plugins.
    
    plugins = []
    pluginDir = settings.DOC_ROOT + "/plugins"
    pluginList = os.listdir( pluginDir )
    
    for plugin in pluginList:
    
        try:
            # read in the files
            ui = open( pluginDir + "/"+ plugin + "/ui.html", 'r' ).read()
            javascript = open( pluginDir + "/"+ plugin + "/plugin.js", 'r' ).read()
            
            plugin = "plugin_" + plugin
            
            # process the javascript by adding a class wrapper
            javascript = "function " + plugin + "(){ " + javascript + \
                "} " + plugin + " = new " + plugin + "();"
            
            # tag replacements
            javascript = javascript.replace("::plugin::", plugin)
            ui = ui.replace("::plugin::", plugin)
            
            plugins.append({
                'hash': plugin,
                'ui': ui,
                'javascript': javascript
            })
            
        except IOError:
            pass
    
    return plugins

def get_app_static_dirs():
    """
    This function builds a list of paths for django application static
    directories, which allows the static paths to be added automatically.
    """

    paths = []
    
    def addToPath( app ):
        """
        this takes an application and attempts to find a static directory within
        it. If successful, it adds the static directory to the path.
        """
        
        # start with the document root
        path = '%s/' % settings.DOC_ROOT
        
        # for every part of the application path, add it to the path
        for pathChunk in app.split('.'):
            path += '%s/' % pathChunk
         
        # top it off with the "static" folder we're testing for
        path += "static"
 
        # if the static dir exists, add it to the list
        if os.path.exists(path):
            paths.append((app, path))
    
    # look in the plugins directory
    for plugin in os.listdir( settings.DOC_ROOT + "/plugins" ):
        addToPath( "plugins." + plugin )
    
    # also look in the installed applications
    for app in settings.INSTALLED_APPS:
        addToPath( app )

    return paths
