let BeanController = require(__dirname + '/bean_controller.js');
let cli = require(__dirname + '/cli.js');

class BeanRoutes {
	// PARAMS
	// controllers - controller class definitions
	constructor(controllers) {
		this.controllers = __map_names(controllers);
		this.controller_actions = __map_actions(controllers);
		this.routes = {
			'get': [],
			'put': [],
			'post': [],
			'delete': []
		};
	}

	get(path, controller_action) {
		request('get', path, controller_action);
	}

	put(path, controller_action) {
		request('put', path, controller_action);
	}

	post(path, controller_action) {
		request('post', path, controller_action);
	}

	delete(path, controller_action) {
		request('delete', path, controller_action);
	}

	// resources(controller_name) {
	// 	get(`/${controller_name}`, ``);
	// 	get(`/${controller_name}`, ``);
	// 	get(`/${controller_name}`, ``);
	// 	post(`/${controller_name}`, ``);
	// 	get(`/${controller_name}`, ``);
	// 	get(`/${controller_name}`, ``);
	// 	put(`/${controller_name}`, ``);
	// 	delete(`/${controller_name}`, ``);
	// }

	__request(method, path, controller_action) {
		if (!(method in this.routes)) {
			// create new method
			this.routes[method] = [];
		}
		// add route
		this.routes[method].push([path, controller_action]);
	}

	// RETURNS
	// { controller_name : [controller_action_names] }
	__map_actions(controllers) {
		const FORBIDDEN_ACTIONS = Object.getOwnPropertyNames(BeanController.prototype);
		let controller_actions = {};
		let actions, name;
		controllers.forEach((controller) => {
			// add controller to controller actions
			name = controller.name;
			this.controller_actions[name] = [];
			// add each allowed action to controller actions
			actions = Object.getOwnPropertyNames(controller.prototype);
			actions.forEach((action) => {
				if (!FORBIDDEN_ACTIONS.includes(action)) {
					this.controller_actions[name].push(action);
				}
			});
		});
		return controller_actions;
	}

	__map_names(controllers) {
		let controller_names = {};
		let name;
		controllers.forEach((controller) => {
			name = controller.name;
			controller_names[name] = controller;
		});
		return controller_names;
	}

	__init(app) {
		let routes, path, def,
			controller_name, controller,
			action_name, action;
		// FOR EACH METHOD
		Object.keys(this.routes).forEach((method) => {
			routes = this.routes[method];
			// FOR EACH ROUTE
			routes.forEach((route) => {
				path = route[0];
				def = route[1].split('#');
				// get controller
				controller_name = def[0];
				controller = this.controllers[controller_name];
				// if action exists, init route
				action_name = def[1];
				if (this.controller_actions[controller_name].includes(action_name)) {
					__init_route(app, method, path, controller_name, action_name, controller.prototype[action_name]);
				}
			});
		});
	}

	__init_route(app, method, path, controller_name, action_name, action_definition) {
		switch(method) {
			case 'get':
				app.get(path, __extend_callback_request(controller_name, action_name, action_definition));
			case 'put':
				app.put(path, __extend_callback_request(controller_name, action_name, action_definition));
			case 'post':
				app.post(path, __extend_callback_request(controller_name, action_name, action_definition));
			case 'delete':
				app.delete(path, __extend_callback_request(controller_name, action_name, action_definition));
		}
	}

	__extend_callback_request(controller_name, action_name, action_definition) {
		let locals_extension = {
			__title: `${controller_name} - ${action_name}`,
			__stylesheet_tags: ``,
			__javascript_tags: ``
		};

		return function (req, res) {
			res.render = function(view, locals, callback) {
				// support callback function as second arg
				if (typeof locals === 'function') {
					callback = locals;
					locals = {};
				}

				locals = Object.assign(locals_extension, locals);
				res.render(view, locals, callback);
			}
		};
	}

}

module.exports = BeanRoutes;


