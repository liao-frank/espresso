let BeanController = require(__dirname + '/bean_controller.js');
let cli = require(__dirname + '/cli.js');

class BeanRouter {
	// PARAMS
	// live instances of controllers
	constructor(controllers, socketed_controllers) {
		// map controllers to their names
		this.controllers = this.__map_controller_names(controllers);
		this.socketed_controllers = this.__map_controller_names(socketed_controllers);
		this.routes = {
			'get': [],
			'put': [],
			'post':[],
			'delete': []
		};
	}

	__map_controller_names(controllers) {
		let mapped_controllers = {},
		controller_name;
		controllers.forEach((controller) => {
			// check that instance is a BeanController
			if (controller instanceof BeanController) {
				// get lowercase controller name
				controller_name = controller.constructor.name;
				controller_name = controller_name.toLowerCase().replace('socketedcontroller', '').replace('controller', '');
				// add controller into mapping
				mapped_controllers[controller_name] = controller;
			}
		});
		return mapped_controllers;
	}

	get(path, controlleraction) {
		this.request('get', path, controlleraction);
	}

	put(path, controlleraction) {
		this.request('put', path, controlleraction);
	}

	post(path, controlleraction) {
		this.request('post', path, controlleraction);
	}

	delete(path, controlleraction) {
		this.request('delete', path, controlleraction);
	}

	request(method, path, controlleraction) {
		let controller_and_action = controlleraction.split('#');
		if (method in this.routes && controller_and_action.length == 2) {

			this.routes[method].push({
				controller: controller_and_action[0],
				action: controller_and_action[1],
				path: path
			});
		}
	}

	use() {

	}

	__init(app, io) {
		this.app = app;
		this.io = io;
		// for each method
		let routes;
		Object.keys(this.routes).forEach((method) => {
			routes = this.routes[method];
			// for each route in this method
			routes.forEach((route) => {
				this.__init_route(method, route);
			});
		});
	}

	__init_route(method, route) {
		let app = this.app;
		let controller_name = route.controller,
		action_name = route.action,
		path = route.path;

		let controller = {
			name: controller_name,
			def: (this.socketed_controllers[controller_name] || this.controllers[controller_name])
		}
		let action = {
			name: action_name,
			def: controller.def[action_name]
		};

		// basic error checking
		if (!controller.def) { cli.escape(`Router error: Controller '${controller.name}' does not exist.`) };
		if (!action.def) { cli.escape(`Router error: Controller action '${controller.name}#${action.name}' does not exist.`) };
		
		switch(method) {
			case 'get':
				app.get(path, this.__wrap_action(controller, action));
				this.__init_socket(route, controller, action);
				break;
			case 'put':
				app.put(path, this.__wrap_action(controller, action));
				break;
			case 'post':
				app.post(path, this.__wrap_action(controller, action));
				break;
			case 'delete':
				app.delete(path, this.__wrap_action(controller, action));
				break;
		}

	}

	__wrap_action(controller, action) {
		function get_stylesheet_tags() {
			let stylesheets = [];
			stylesheets.push('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css">');
			stylesheets.push('<link rel="stylesheet" type="text/css" href="/css/styles.css">');
			stylesheets.push(`<link rel="stylesheet" type="text/css" href="/css/${controller.name}/${controller.name}.css">`);
			stylesheets.push(`<link rel="stylesheet" type="text/css" href="/css/${controller.name}/${controller.name}_${action.name}.css">`);
			return stylesheets.join('\n');
		}
		function get_javascript_tags() {
			let javascripts = [];
			javascripts.push(`<script
	src="https://code.jquery.com/jquery-3.2.1.min.js"
	integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
	crossorigin="anonymous"></script>`);
			javascripts.push('<script type="text/javascript" src="/socket.io/socket.io.js"></script>');
			javascripts.push('<script type="text/javascript" src="/js/scripts.js"></script>');
			javascripts.push(`<script type="text/javascript" src="/js/${controller.name}/${controller.name}.js"></script>`);
			javascripts.push(`<script type="text/javascript" src="/js/${controller.name}/${controller.name}_${action.name}.js"></script>`);
			return javascripts.join('\n');
		}
		const local_extension = {
			__title: `${controller.name} - ${action.name}`,
			__stylesheet_tags: get_stylesheet_tags(),
			__javascript_tags: get_javascript_tags(),
			__yield: `../${ controller.name }/${ action.name }.ejs`
		};

		return function(req, res) {
			// extend res.render
			let _render = res.render;
			res.render = function(view, locals, callback) {
				// support no view specified
				if (typeof view !== 'string') {
					callback = locals;
					locals = view;
					view = 'layouts/application.ejs';
				}
				// support callback function as second arg
				if (typeof locals === 'function') {
					callback = locals;
					locals = {};
				}
				locals = Object.assign(local_extension, locals);
				_render.apply(res, [view, locals, callback]);
			}
			// send req, res to action
			action.def.apply(controller.def, [req, res]);
		};
	}

	__init_socket(route, controller, action) {
		let io = this.io,
		path = route.path;
		let socket_action_name = action.name + '_socket',
		socket_action = controller.def[socket_action_name];

		if (socket_action) {
			io.of(path).on('connection', this.__wrap_socket_action(controller, socket_action, path));
		}
	}

	__wrap_socket_action(controller, socket_action, path) {
		let io = this.io;
		return function (socket) {
			console.log(`Socket established at ${path} with address ${socket.handshake.address}.`);
			socket_action.apply(controller.def, [this.io, socket]);
		};
	}
}

module.exports = BeanRouter;