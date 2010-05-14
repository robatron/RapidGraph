// plugin.js
// 
// Contains the plugin's code and settings

this.settings = 
{
    title: "Welcome to RapidGraph!",
    subtitle: "",
}

this.init = function()
{
    safelog("::plugin:: is initializing!");
}

this.start = function()
{
    safelog("::plugin:: is starting!");
}

this.stop = function()
{
    safelog("::plugin:: is stopping!");
}
