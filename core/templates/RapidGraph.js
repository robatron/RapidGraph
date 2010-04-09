// RapidGraph - RapidGraph's main code file

function RapidGraph()
{
    //////////
    // DATA //
    //////////

    var ui = new RapidGraphUI();    // create a new UI
    var api = null;                 // the API object 
    var plugman =  null;            // the plugin manager
    
    this.init = function()
    // initialize the main RapidGraph client-side app
    {
        // initialize the UI
        ui.init();

        // create a new API object assoc with the UI
        api = new RapidGraphAPI(ui);

        // create and initialize the plugin manager assoc with the API
        plugman = new RapidGraphPluginManager(api);
        plugman.init();     // initialize the plugin manager
    }
    
}; RapidGraph = new RapidGraph(); // there can be only one RapidGraph instance