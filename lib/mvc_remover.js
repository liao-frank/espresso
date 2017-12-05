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

function remove_view(dir_name, controller) {
	// views
	cli.rmdir(`${dir_name}/app/views/${controller}`);
	console.log(`remove		${dir_name}/app/views/${controller}`);
	// css
	cli.rmdir(`${dir_name}/app/assets/css/${controller}`);
	console.log(`remove		${dir_name}/app/assets/css/${controller}`);
	// js
	cli.rmdir(`${dir_name}/app/assets/js/${controller}`);
	console.log(`remove		${dir_name}/app/assets/js/${controller}`);
}

// PARAMS
// routes - { method, path, action }
function remove_routes(dir_name, controller) {
	let route_def = cli.cat(dir_name + '/config/routes.js');
	let lines = route_def.split('\n');
	let new_lines = [], match;
	lines.forEach((line, index) => {
		match = line.match(new RegExp(`${controller}#.+('|")`));
		if (!match) {
			new_lines.push(line);
		}
	});
	// add lines to config file
	fs.writeFileSync(dir_name + '/config/routes.js', new_lines.join('\n'));
}

function remove_controller(dir_name, name) {
	name = uncamelcase(name);
	// remove controller file
	cli.rm(`${dir_name}/app/controllers/${name}_controller.js`);
	console.log(`remove	${dir_name}/app/controllers/${name}_controller.js`);
	cli.rm(`${dir_name}/app/controllers/socketed_controllers/${name}_socketed_controller.js`);
	console.log(`remove	${dir_name}/app/controllers/socketed_controllers/${name}_socketed_controller.js`);
	// remove asset directories
	remove_view(dir_name, name);
	// remove controller specific assets
	remove_routes(dir_name, name);
}

function remove_model(dir_name, attrs) {

}

function remove_scaffold() {

}

module.exports = {
	remove_view: remove_view,
	remove_controller: remove_controller,
	remove_model: remove_model,
	remove_scaffold: remove_scaffold
};


