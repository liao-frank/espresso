# espresso

## Why use espresso over Rails?
- Platform Compatibility
	- has CLI supported by Javascript, not Ruby. This means out-of-the-box compatibility with Windows
- WebSockets > AJAX
	- has OOTB support for sockets as specific as route-level
	- supported by Socket.IO, meaning compability with older browsers through long polling
- Asset Specificity > Asset Clashing
	- has decoupled compiled assets for each controller, whereas Rails bundles all your styles and scripts together
- MongoDB > SQL
	- has OOTB MongoDB support for flexible-schema-lovers
- Event Loop Request Management > Threaded Request Management
	- using javascript means having the event loop. Throw requests at anything in memory and never worry about those nasty race conditions
- Node Libraries
	- have access to all your favorite Node libraries in this highly unopinionated framework


# Getting started
## Conventions
Before we start, it's important to mention a few important conventions that should be followed when using espresso. 

Unfortunately, espresso is not perfect. Not following these conventions might result in espresso breaking or being unable to start a server.

### Running espresso's command line
When running commands, all commands should be run from the outermost directory of your app directory.

For example, if your project is called HelloWorld. Commands should be run in 
```
/HelloWorld
```
They should not be run in any of the following or similar directories
```
/HelloWorld/app
/HelloWorld/config
/GoodbyeWorld
```
#### Why?
espresso currently does no checking of which sublevel of your app directory you are in. It needs help determining relative paths.

### Using require()
When using `require()` inside of controllers, please `require('path');` and then prepend your `require` paths with `path.resolve()`. After prepending, use relative paths from the main app directory, instead of `__dirname`, `.`,  or other methods that assume your current file's location.
#### Why?
espresso runs it's own server configurations when starting a server and will interpret controller files in a different directory. Therefore, using `__dirname` and others will not work as expected.

It should be noted that only controllers are evaluated this way, so `require()` statements in other places should work as expected.


## Creating your first espresso app
### Installation
Let's get started! To install espresso, run the following command
```
npm install espresso-js --global
```

### Creating the app
To create the app, run the following command
```
espresso new APP_NAME
```

Afterwards, `cd` into your app directory and make sure that personal attributes in package.json are to your liking.

And make sure to install app dependencies by running `npm install`!
### Generating a controller
To generate a controller, run the following command
```espresso generate controller CONTROLLER_NAME [ACTION:METHOD]```

Omitted methods will be assumed to be GET requests.
Supported HTTP methods include:
- GET
- POST
- PUT
- DELETE

An example call is as follows
```
espresso generate controller Dog index show create:post update:put delete:delete
```
The command creates a simple CRUD controller named Dog.

Routing configurations will be generated automatically, and can be viewed in `config/routes.js`.
Views (including style and script assets) will be automatically generated for GET actions.
### Generating a model
At this time, espresso doesn't support model generation.

On the other hand, adding your own model modules is extremely easy. Just `require()` your modules in your controllers and you're good to go.

You're free to use modules for MongoDB, SQL databases, or even just throw your records into memory for smaller projects!
### Customizing views
Views are automatically created for GET actions during controller generation.

### Starting your server
To start a local server, run the following command
```
espresso server
```

You can connect to the localhost on port 50000.

Happy coding!



Having issues? Visit the troubleshooting guide which includes known bugs.
