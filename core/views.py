from django.shortcuts import render_to_response

# The main application view
def index( request ):
    return render_to_response('index.html')