let BeanController = require(__dirname + '/bean_controller.js');
let cli = require(__dirname + '/cli.js');

class BeanRouter {
	// PARAMS
	// live instances of controllers
	constructor(controllers) {
		// map controllers to their names
		this.controllers = this.__map_controller_names(controllers);
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
				controller_name = controller_name.toLowerCase().replace('controller', '');
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

	__init(app) {
		// for each method
		let routes;
		Object.keys(this.routes).forEach((method) => {
			routes = this.routes[method];
			// for each route in this method
			routes.forEach((route) => {
				this.__init_route(app, method, route);
			});
		});
	}

	__init_route(app, method, route) {
		let controller_name = route.controller,
		action_name = route.action,
		path = route.path;

		let controller = {
			name: controller_name,
			def: this.controllers[controller_name]
		},
		action = {
			name: action_name,
			def: controller.def[action_name]
		};
		
		switch(method) {
			case 'get':
				app.get(path, this.__wrap_action(controller, action));
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
			return '';
		}
		function get_javascript_tags() {
			return '';
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
}

module.exports = BeanRouter;