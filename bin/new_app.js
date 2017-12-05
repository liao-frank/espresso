let fs = require('fs');
let cli = require(__dirname + '/../lib/cli.js');

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

function parse_arguments(args) {
	if ( args.length != 1 ) {
		cli.escape("Wrong number of parameters. Try 'espresso new NAME'.");
	}
	return {
		app_name: args[0]
	}
}

function setup_dir(dir_name) {
	let content;
	// app directory
	cli.mkdir(dir_name + '/app');
	cli.mkdir(dir_name + '/app/assets');
	cli.mkdir(dir_name + '/app/assets/images');
	cli.mkdir(dir_name + '/app/assets/js');
	copy_static(dir_name + '/app/assets/js/scripts.js', 'scripts.js');
	cli.mkdir(dir_name + '/app/assets/css');
	cli.touch(dir_name + '/app/assets/css/styles.css');
	cli.mkdir(dir_name + '/app/controllers');
	cli.mkdir(dir_name + '/app/controllers/socketed_controllers');
	cli.mkdir(dir_name + '/app/models');
	cli.mkdir(dir_name + '/app/views');
	cli.mkdir(dir_name + '/app/views/layouts');
	copy_static(dir_name + '/app/views/layouts/application.ejs', 'application.ejs');
	// config directory
	cli.mkdir(dir_name + '/config');
	copy_static(dir_name + '/config/routes.js', 'routes.js');
	// public directory
	cli.mkdir(dir_name + '/public');
	// lib directory
	cli.mkdir(dir_name + '/lib');
	// main directory
	content = cli.cat(`${__dirname}/../lib/static/package.json`);
	fs.writeFileSync(dir_name + '/package.json', content.replace(/\$\{ uncamelcase\(dir_name\) \}/, `${ uncamelcase(dir_name) }`));
	cli.touch(dir_name + '/README.md');
}

function copy_static(file_path, static_file_name) {
	fs.writeFileSync(file_path, cli.cat(`${__dirname}/../lib/static/${static_file_name}`));
}

exports.init = function(args) {
	let props = parse_arguments(args);
	cli.mkdir(props.app_name);
	setup_dir(props.app_name);
}

