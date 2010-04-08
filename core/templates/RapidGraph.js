// RapidGraph - RapidGraph's main code file

function RapidGraph()
{
    //////////
    // DATA //
    //////////

    var ui = new RapidGraphUI();                    // create a new UI
    var plugman = new RapidGraphPluginManager(ui);  // make a new plugin manager
    
    this.init = function()
    // initialize the main RapidGraph client-side app
    {
        ui.init();          // initialize the UI
        plugman.init();     // initialize the plugin manager
        ui.addOne();
    }
    
}; RapidGraph = new RapidGraph(); // there can be only one RapidGraph instance
