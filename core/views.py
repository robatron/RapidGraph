from django.shortcuts import render_to_response

# The main application view
def core( request ):
    return render_to_response('core.html')
