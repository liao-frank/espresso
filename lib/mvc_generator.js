let fs = require('fs');
let cli = require(__dirname + '/cli.js');
let mvc_remover = require(__dirname + '/mvc_remover.js');
const ROUTE_METHODS = ['get','post', 'put', 'delete'];

function generateView(dirname, controller, action) {
	let ext = action && ('/' + action);
	// views
	cli.touch(`${dirname}/app/views/${controller}/${action || 'index'}`);
	console.log(`create		${dirname}/app/views/${controller}/${action || 'index'}`);
	// css
	cli.touch(`${dir_name}/app/assets/css/${controller}/${controller}${ext}.css`);
	console.log(`create		${dir_name}/app/assets/css/${controller}${ext}.css`);
	// js
	cli.touch(`${dir_name}/app/assets/js/${controller}/${controller}${ext}.js`);
	console.log(`create		${dir_name}/app/assets/js/${controller}${ext}.js`);
}

// PARAMS
// routes - { method, path, action }
function generateRoutes(dirname, controller, routes) {
	let route_def = cli.cat(dir_name + '/config/routes.js');
	let lines = [], line;
	let method, path, action;

	routes.forEach((route) => {
		// set parameters
		method = route.method; path = route.path;
		controller = route.controller; action = route.action;
		// create and add line
		line = `	${method}('${path}', '${controller}#${action}');`;
		lines.push(line);
	});
	// add lines to config file
	route_def = route_def.replace(/use\s?\(\)\s?{/, `use() {
	${lines.join('\n')}\n`);
	fs.writeFileSync(dir_name + '/config/routes.js', route_def);
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
function generateController(dir_name, name, actions) {
	// create controller file
	cli.touch(`${dir_name}/app/controllers/${name}_controller.js`);
	console.log(`create	app/controllers/${name}_controller.js`);
	// make asset directories
	//// views
	cli.mkdir(`${dir_name}/app/views/${name}`);
	//// css
	cli.mkdir(`${dir_name}/app/assets/css/${name}`);
	console.log(`create		${dir_name}/app/assets/css/${name}`);
	//// js
	cli.mkdir(`${dir_name}/app/assets/js/${name}`);
	console.log(`create		${dir_name}/app/assets/js/${name}`);
	// add controller specific assets
	generateView(dirname, name, '');

	// add route and route specific assets
	let parts, action, method;
	let routes = [];
	for (let i = 0; i < actions.length; i++) {
		parts = actions[i].split(':');;
		action = parts[0];
		if (parts[1] && ROUTE_METHODS.includes(parts[1])) {
			method = parts[1];
		} else { method = 'get'; }
		//// routes.js < route
		console.log(`route	${method} '/${name}/${action}'`)
		routes.push({
			method: method,
			path: `/${name}/${action}`,
			action: action
		});
		//// create view + assets
		generateView(dirname, name, action);
	}
	generateRoutes(dirname, name, routes);
}

function generateModel(dir_name, attrs) {

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
function generateScaffold() {

}

module.exports = {
	generateView: generateView,
	generateController: generateController,
	generateModel: generateModel,
	generateScaffold: generateScaffold
};


