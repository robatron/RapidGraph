def get_app_static_dirs():
    """
    This function builds a list of paths for django application static
    directories, which allows the static paths to be added automatically.
    """
    import os
    from django.conf import settings

    paths = []
    for app in settings.INSTALLED_APPS:
        
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
 
    return paths
