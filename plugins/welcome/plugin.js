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
    console.log("::plugin:: is initializing!");
}

this.start = function()
{
    console.log("::plugin:: is starting!");
}

this.stop = function()
{
    console.log("::plugin:: is stopping!");
}
