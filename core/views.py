from django.shortcuts import render_to_response
from plugin_manager import *

# The main application view
def index( request ):
    return render_to_response('RapidGraph.html', {
        'plugins':get_plugins()
    })
