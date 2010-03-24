// rapidgraph_ui.js

function rapidgraph_ui()
{
    /////////////
    // UI DATA //
    /////////////
    var sketchpad = null;   // will be the Raphael SVG drawing space
    var grabbedNode = null; // currently grabbed node. Null if none grabbed.
    
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
        sketchpad = Raphael( "ui", width, height );
        console.log("New Raphael object created of size %dx%d", width, height); 
        
        /* TODO: Figure out dynamic scaling
        $(window).resize(function(){
            $("#ui").scale();
        });
        */
        
        var radius = 10;
        var x = width/2-radius;
        var y = height/2-radius
        var testcircle = sketchpad.circle( x, y, radius).attr({
            fill: "lightgreen",
            stroke: "green"
        });
        
        testcircle.mousedown( function(e)
        {                
            // set the grabbed node to this node
            grabbedNode = this;
            
            grabbedNode.dx = e.clientX;
            grabbedNode.dy = e.clientY;
            
            e.preventDefault && e.preventDefault();
        });
        
        $("#ui").mousemove( function( event )
        {
            e = event || window.event;
            
            if( grabbedNode ){
                
                var n = grabbedNode;
                n.translate( e.clientX - n.dx, e.clientY - n.dy );
                
                n.dx = e.clientX;
                n.dy = e.clientY;
            }
        });
        
        $("#ui").mouseup( function()
        {
            grabbedNode = null;
        });
        
        console.groupEnd();
    }
}
