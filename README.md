# espresso

## Why use espresso over Rails?
- Platform Compatibility
	- has CLI supported by Javascript, not Ruby. This means out-of-the-box compatibility with Windows
- WebSockets > AJAX
	- has OOTB support for sockets as specific as route-level
	- supported by Socket.IO, meaning compability with older browsers
- Asset Specificity > Asset Clashing
	- has decoupled compiled assets for each controller, whereas Rails bundles all your styles and scripts together
- MongoDB > SQL
	- has OOTB MongoDB support for flexible-schema-lovers
- Event Loop Request Management > Threaded Request Management
	- using javascript means having the event loop. Throw requests at anything in memory and never worry about those nasty race conditions
- Node Libraries
	- have access to all your favorite Node libraries in this highly unopinionated framework