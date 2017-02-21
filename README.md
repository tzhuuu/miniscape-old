# miniscape

## TODO
* Write collision functions
* Complete `Projectiles` and `Characters` on the client
* Scaffold storyboards/scenes
* Prototype multiplayer
* Build server models for instances etc.

## Proposed init flow

`init()` - initialize everything we need before the main game loop

1. `initPixi` - initialize pixi so we can do something while waiting
 * construct the pixi canvas and start a loop
 * set up a loading screen
 * load some project config object
2. `loadAssets` - load assets
  * load textures
  * load sounds
  * initialize socket connection
3. `loadMiniscape` - import common tools into singletons
  * construction of layers
  * initialize globals
  * load models
  * load extensions
  * initialize pixi keyboard
  * load setters
  * attach game hooks
4. `setup` - construct things that we'll change a lot (hud, character related things, etc)
  * build characters from models
  * construct things
  * customize ui/other things based on user preferences
5. `gameLoop` - swapped over once we're done
  
The idea is to separate the different loading actions into different places. This will hopefully make it more intuitive as to what to change.
 
## Proposed game flow
 
`gameLoop()` - main execution of the game flow
 
1. `gameStart` - executes once at the start of entering the game
2. `gameClose` - executes once when the game closes
3. `loopExecution` - executes the main `requestAnimationFrame` loop
  * This should be set up through registering the hooks (and can be changed)
  * Idea is to keep a sorted list of (order, function) pairs to execute
    * maintain aliases for common ones (updateCharacters, updateProjectiles)
  * Have the orders be easily editable
 
 
 ## Coding structure:
 
* `main.js` - main entry point of the application and will transition the switch from `init` to `game`
* `init.js` - where the loading/setup goes before the actual game loop starts
* `game.js` - definition of the game loop
* `config.js` - javascript configuration for the project/game

* `utils/` - utility classes and functions
  * `extensions.js` - load extensions to any base classes (like Array or String)
  * `loader.js'` - helper class for loading things defined in `config.js`

* `models/` - definition of basic pixi models that are used

* `sockets/` - construction of socket.io handlers

* `data/` - generic data that can be loaded

* `singletons/` - holds useful singletons that should be imported
  * `settings.js` - a place to hold configs
  * `models.js` - storage of models and an ease of access for them
  * `maps.js` - tool for reading and loading maps
  * `layers.js` - storage of layers
  * basically anything previously defined as global that shouldn't be needs to go here
  
## Defining characters and projectiles

No idea for now, I think once we get everything set up it'll be more clear as to how to do it. Pretty much every update will need to be based off of a time delta though.
