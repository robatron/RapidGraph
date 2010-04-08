// plugin.js
// 
// Contains the plugin code

this.settings = 
{
    name: "Sample Graphs"
}

this.init = function()
{
    alert({{plugin.hash}}+" is initializing!");
}

this.start = function()
{
    alert({{plugin.hash}}+" is starting!");
}

this.stop = function()
{
    alert({{plugin.hash}}+" is stopping!");
}
