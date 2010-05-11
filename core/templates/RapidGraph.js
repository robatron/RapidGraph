// RapidGraph - RapidGraph's main code file

function RapidGraph()
{
    //////////
    // DATA //
    //////////

    var ui = new RapidGraphUI();    // create a new UI
    var plugman =  null;            // the plugin manager
    
    this.init = function()
    // initialize the main RapidGraph client-side app
    {        
        // initialize the UI
        ui.init();

        // create and initialize the plugin manager assoc with the UI
        plugman = new RapidGraphPlugMan( ui );
        plugman.init(); // initialize the plugin manager
    }
    
}; RapidGraph = new RapidGraph(); // there can be only one RapidGraph instance
