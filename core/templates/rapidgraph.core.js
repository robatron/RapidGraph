// rapidgraph_core.js
// Dependancies: jQuery v1.4.2 or greater

function rapidgraph_core()
{
    ///////////////
    // CORE DATA //
    ///////////////
    
    var ui = new rapidgraph_ui();           // the user interface
    var graph = new rapidgraph_graph();     // the main graph
    
    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////
    
    function docReady()
    // acts as a "document ready" flag
    { 
        return window.jQuery.isReady;
    }
    
    this.init = function()
    {
        console.group("core.init()");
        
        console.log("doc ready? = " + docReady());
        
        console.groupEnd();
    };
    
    this.start = function()
    {
        console.group("core.start()");
        
        console.log("doc ready? = " + docReady() );
        
        // make sure the document is ready
        if( !docReady() )
            console.error("Start failed. Call me when the document is ready.");
        
        // otherwise, we're good. Start up core
        else {
        }
        
        console.groupEnd();
    };
        
}
