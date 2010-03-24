// rapidgraph_ui.js

function rapidgraph_ui()
{
    /////////////
    // UI DATA //
    /////////////
    var surface = null;   // will be the Raphael SVG drawing space
    var grabbedNode = null; // currently grabbed node. Null if none grabbed.
    var nodes = new Array(); // the nodes
    
    var graph = null;
    
    this.start = function()
    {
        console.group("ui.start()");
        
        // make sure the "ui" element exists, and error out if not
        var uiReady = $("#ui").length != 0;
        if( !uiReady )
            console.error("ui element not found. Is the document fully loaded?");
        
        // if the "ui" element exists, we're good to go
        else {
            
            // initialize the ui
            init();
            
        }
        
        console.groupEnd();
    }

    function init()
    {
        console.group("ui.init()");
        
        // TODO: Make these dimensions dynamically
        var width = 1000;
        var height = 300;
        surface = Raphael( "ui", width, height );
        graph = new rapidgraph_graph( surface );
        
        console.groupEnd();
    }
}
