let fs = require('fs');
let cli = require(__dirname + '/cli.js');
const ROUTE_METHODS = ['get','post', 'put', 'delete'];

function uncamelcase(s) {
	chars = s.split('');
	new_chars = chars.map((char, index) => {
		if (char == char.toUpperCase() && index > 0) {
			return '_' + char.toLowerCase();
		} else {
			return char.toLowerCase();
		}
	});
	return new_chars.join('');
}

function generate_view(dir_name, controller, action) {
	let ext = action;

	// views
	cli.touch(`${dir_name}/app/views/${controller}/${ext}.ejs`);
	console.log(`create		${dir_name}/app/views/${controller}/${ext}.ejs`);
	// css
	cli.touch(`${dir_name}/app/assets/css/${controller}/${controller + "_" + ext}.css`);
	console.log(`create		${dir_name}/app/assets/css/${controller}/${controller + "_" + ext}.css`);
	// js
	cli.touch(`${dir_name}/app/assets/js/${controller}/${controller + "_" + ext}.js`);
	console.log(`create		${dir_name}/app/assets/js/${controller}/${controller + "_" + ext}.js`);
}

// PARAMS
// routes - { method, path, action }
function generate_routes(dir_name, controller, routes) {
	let route_def = cli.cat(dir_name + '/config/routes.js');
	let lines = [], line;
	let method, path, action;

	routes.forEach((route) => {
		// set parameters
		method = route.method; path = route.path;
		controller = route.controller; action = route.action;
		// create and add line
		line = `		this.${method}('${path}', '${controller}#${action}');`;
		lines.push(line);
	});
	// add lines to config file
	route_def = route_def.replace(/use\s?\(\)\s?{/, `use() {
${lines.join('\n')}${route_def.match(/use\s?\(\)\s?{\s*}/) ? '' : '\n'}`);
	fs.writeFileSync(dir_name + '/config/routes.js', route_def);
}

function generate_controller_file(dir_name, controller, actions) {
	// cli.touch(`${dir_name}/app/controllers/${name}_controller.js`);
	let content = [];
	content.push(`class ${controller.charAt(0).toUpperCase() + controller.slice(1)}Controller extends BeanController {
	constructor() {
		super();
	}`);

	actions.forEach((action, index) => {
		content.push('');
		if (action) {
			content.push(`	${action}(req, res) {\n\n		res.render({});\n	}`);
		}
	});
	content.push('}');
	fs.writeFileSync(`${dir_name}/app/controllers/${controller}_controller.js`, content.join('\n'));
}
function generate_socketed_controller_file(dir_name, controller, actions) {
	let content = [];
	let cased_controller_name = controller.charAt(0).toUpperCase() + controller.slice(1);
	content.push(`class ${cased_controller_name}SocketedController extends ${cased_controller_name}Controller {
	constructor() {
		super();
	}`);

	actions.forEach((action, index) => {
		content.push('');
		if (action) {
			content.push(`	${action}_socket(io, socket) {\n		socket.emit("connected", {});\n	}`);
		}
	});
	content.push('}');
	fs.writeFileSync(`${dir_name}/app/controllers/socketed_controllers/${controller}_socketed_controller.js`, content.join('\n'));
}

// create  app/controllers/greetings_controller.rb
// route  get "greetings/hello"
// invoke  erb
// create    app/views/greetings
// create    app/views/greetings/hello.html.erb
// invoke  test_unit
// create    test/controllers/greetings_controller_test.rb
// invoke  helper
// create    app/helpers/greetings_helper.rb
// invoke  assets
// invoke    coffee
// create      app/assets/javascripts/greetings.coffee
// invoke    scss
// create      app/assets/stylesheets/greetings.scss
function generate_controller(dir_name, controller, actions) {
	name = uncamelcase(controller);
	// create controller file
	actions = actions.map(a => a.toLowerCase());
	generate_controller_file(dir_name, name, actions.map((ca) => { return ca.split(':')[0]; }));
	console.log(`create	app/controllers/${name}_controller.js`);
	generate_socketed_controller_file(dir_name, name, actions.filter((ca) => { return ca.split(':').length == 1 || ca.split(':')[1] == 'get'}).map((ca) => { return ca.split(':')[0]; }));
	console.log(`create	app/controllers/socketed_controllers/${name}_socketed_controller.js`);
	// make asset directories
	//// views
	cli.mkdir(`${dir_name}/app/views/${name}`);
	console.log(`create		${dir_name}/app/views/${name}`);
	//// css
	cli.mkdir(`${dir_name}/app/assets/css/${name}`);
	console.log(`create		${dir_name}/app/assets/css/${name}`);
	//// js
	cli.mkdir(`${dir_name}/app/assets/js/${name}`);
	console.log(`create		${dir_name}/app/assets/js/${name}`);
	// add controller specific assets
	//// css
	cli.touch(`${dir_name}/app/assets/css/${name}/${name}.css`);
	console.log(`create		${dir_name}/app/assets/css/${name}/${name}.css`);
	//// js
	cli.touch(`${dir_name}/app/assets/js/${name}/${name}.js`);
	console.log(`create		${dir_name}/app/assets/js/${name}/${name}.js`);
	// add route and route specific assets
	let parts, action, method;
	let routes = [];
	for (let i = 0; i < actions.length; i++) {
		parts = actions[i].split(':');
		action = parts[0];
		if (parts[1] && ROUTE_METHODS.includes(parts[1])) {
			method = parts[1];
		} else { method = 'get'; }
		//// routes.js < route
		console.log(`route	${method} '/${name}/${action}'`)
		routes.push({
			method: method,
			path: `/${name}/${action}`,
			controller: name,
			action: action
		});
		//// create view + assets
		generate_view(dir_name, name, action);
	}
	generate_routes(dir_name, name, routes);
}

function generate_model(dir_name, attrs) {

}

// invoke  active_record
// create    db/migrate/20130717151933_create_high_scores.rb
// create    app/models/high_score.rb
// invoke    test_unit
// create      test/models/high_score_test.rb
// create      test/fixtures/high_scores.yml
// invoke  resource_route
// route    resources :high_scores
// invoke  scaffold_controller
// create    app/controllers/high_scores_controller.rb
// invoke    erb
// create      app/views/high_scores
// create      app/views/high_scores/index.html.erb
// create      app/views/high_scores/edit.html.erb
// create      app/views/high_scores/show.html.erb
// create      app/views/high_scores/new.html.erb
// create      app/views/high_scores/_form.html.erb
// invoke    test_unit
// create      test/controllers/high_scores_controller_test.rb
// invoke    helper
// create      app/helpers/high_scores_helper.rb
// invoke    jbuilder
// create      app/views/high_scores/index.json.jbuilder
// create      app/views/high_scores/show.json.jbuilder
// invoke  assets
// invoke    coffee
// create      app/assets/javascripts/high_scores.coffee
// invoke    scss
// create      app/assets/stylesheets/high_scores.scss
// invoke  scss
// identical    app/assets/stylesheets/scaffolds.scss
function generate_scaffold() {

}

module.exports = {
	generate_view: generate_view,
	generate_controller: generate_controller,
	generate_model: generate_model,
	generate_scaffold: generate_scaffold
};


