let http = require('http');
let BeanController = require(__dirname + '/bean_controller.js');
let BeanRouter = require(__dirname + '/bean_router.js');
let cli = require(__dirname + '/cli.js');
// main modules
let express = cli.require('express');
let sio = cli.require('socket.io');
let morgan = cli.require('morgan');
let path = require('path');

class BeanServer {
	constructor(app) {
		this.app = app;
		// ejs
		this.app.set('views', './app/views');
		this.app.set('view engine', 'ejs');
		// http
		// socket io
		this.httpServer = http.Server(app);
		this.io = sio(this.httpServer);
		// morgan
		this.app.use(morgan('tiny'));
		// routes
		this.add_middleware();
		this.add_controller_routes();
		this.add_static_routes();
	}
	add_middleware() {
		// middleware
		// Beanfile?
		// CoffeePotfile?
	}
	add_controller_routes() {
		// read controllers
		let controllers = cli.catdir('./app/controllers').map((s) => { 
			return eval(`(${s})`);
		});
		let controller_instances = controllers.map((c) => { return new c(); });
		// read socketed controllers
		let socketed_controllers = cli.catdir('./app/controllers/socketed_controllers').map(s => this.eval_socketed_controller(s, controllers));
		let socketed_controllers_instances = socketed_controllers.map(c => new c());

		// read AppRoutes
		let AppRouter = eval(`(${cli.cat('./config/routes.js')})`);
		let router = new AppRouter(controller_instances, socketed_controllers_instances);
	 	// init AppRoutes
 		router.use();
 		router.__init(this.app, this.io);
	}
	eval_socketed_controller(string, controller_classes) {
		let controller_name = string.match(/\w+\s*{/)[0].match(/\w+/)[0]; // i.e. FooController
		let controller_class = controller_classes.filter((c) => { // i.e. FooController instance
			return c.name == controller_name; 
		})[0];
		string = string.replace(controller_name, 'controller_class');
		return eval(`(${string})`);
	}
	add_static_routes() {
		// asset routes
		this.app.use(express.static('./app/assets'));
		// public routes
		this.app.use(express.static('./public'));
	}
	run() {
		let port = process.env.PORT || 50000;
		this.httpServer.listen(port, function() {
			console.log('Server listening at http://localhost:50000/');
		});
	}
}

exports.init = function(args) {
	//express
	let app = express();
	let server = new BeanServer(app);
	server.run();
}

