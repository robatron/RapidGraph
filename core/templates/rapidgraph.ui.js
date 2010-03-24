// rapidgraph_ui.js

function rapidgraph_ui()
{
    /////////////
    // UI DATA //
    /////////////
    var sketchpad = null;   // will be the Raphael SVG drawing space
    var grabbedNode = null; // currently grabbed node. Null if none grabbed.
    var nodes = new Array(); // the nodes
    
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
        
        // set up notepad
        $("#ui").mousemove( function( e )
        {
            // if there's currently a grabbed node, move the node to the mouse's
            // position
            if( grabbedNode ){
                var n = grabbedNode;
                n.translate( e.clientX - n.dx, e.clientY - n.dy );
                
                n.dx = e.clientX;
                n.dy = e.clientY;
            }
        });
        
        // if the mouse button is lifted, clear any grabbed nodes
        $("#ui").mouseup( function(){ grabbedNode = null });
        
        $("#ui").mousedown( function(e){
            if( !grabbedNode ){
                var x = e.clientX - this.offsetLeft;
                var y = e.clientY - this.offsetTop;
                grabbedNode = newNode( x, y );
            }
        });
        
        console.groupEnd();
    }
    
    function newNode( x, y )
    {
        var radius = 10;
        
        nodes.push( sketchpad.circle( x, y, radius ).attr({
            fill: "lightgreen",
            stroke: "green"
        }));
        
        nodes[nodes.length-1].node.style.cursor = "move";
        
        nodes[nodes.length-1].mousedown( function(e)
        {                
            // set the grabbed node to this node
            grabbedNode = this;
            
            // set this node's position to the mouse's position
            grabbedNode.dx = e.clientX;
            grabbedNode.dy = e.clientY;
            
            // prevent the default event action
            e.preventDefault();
        });
        
        return nodes[nodes.length-1];
    }
}
