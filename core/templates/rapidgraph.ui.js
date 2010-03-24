// rapidgraph_ui.js

function rapidgraph_ui()
{
    /////////////
    // UI DATA //
    /////////////
    var sketchpad = null;       // will be the Raphael SVG drawing space
    var grabbedObject = null;   // currently grabbed object
    
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
        
        testcircle.mousedown(function(e){
            grabbedObject = testcircle;
        });
        
        testcircle.mousedown(function(e){
            if( grabbedObject ){
                var o = grabbedObject;
                o.translate( x - o.dx, y - o.dy );
            }
        });
        
        testcircle.mouseup(function(e){
            grabbedObject = null;
        });
        
        $("#ui").mousedown(function(e){
            
            // grab the current mouse position
            var x = e.pageX - this.offsetLeft;
            var y = e.pageY - this.offsetTop;
            
            console.log("mouse is at %d, %d inside the ui element",x,y);
            
            // if the mouse is not over a node, make a new one
            if( !grabbedObject ){
                console.log("and NOT over a node." );
                
            // otherwise, mouse is over a node
            } else {
                console.log( ", and IS over a node." );
            }
        });
        
        console.groupEnd();
    }
}
