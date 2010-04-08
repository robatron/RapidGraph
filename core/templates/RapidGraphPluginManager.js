function RapidGraphPluginManager( ui )
{
    this.init = function()
    {
        ui.addOne();
        ui.getGraph().nodes.createNew({
            x: 300,
            y: 300,
            label:"it worked!"
        });
    }
}
