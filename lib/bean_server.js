let http = require('http');
let BeanController = require(__dirname + '/bean_controller.js');
let BeanRoutes = require(__dirname + '/bean_routes.js');
let cli = require(__dirname + '/cli.js');
// main modules
let express = cli.require('express');
let sio = cli.require('socket.io');
let morgan = cli.require('morgan');

class BeanServer {
	constructor(app) {
		this.app = app;
		// ejs
		this.app.set('views', './app/views');
		this.app.set('view engine', 'ejs');
		// http
		// socket io
		this.httpServer = http.Server(app);
		let io = sio(this.httpServer);
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
		let controllers = cli.catdir('./app/controllers').map(s => eval(s));
		let controller_instances = controllers.map(c => new c());
		// read AppRoutes
		let AppRoutes = eval(cli.cat('./config/routes.js'));
		let routes = new AppRoutes(controller_instances);
	 	// init AppRoutes
 		routes.use();
 		routes.__init(this.app);
	}
	add_static_routes() {
		// asset routes
		this.app.use(express.static('./app/assets'));
		// public routes
		this.app.use(express.static('./public'));
	}
	run() {
		this.httpServer.listen(50000, function() {
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

