#!/usr/bin/env node
let fs = require('fs');
let cli = require(__dirname + '/../lib/cli.js');

function parse_arguments(args) {
	while (args[0].match(/(node)|(espresso)/)) {
		if (args.length == 1) {
			console.log("It's morning somewhere");
			return {
				command: "",
				args: []
			};
		}
		args = args.slice(1);
	}

	return {
		command: args[0],
		args: args.slice(1)
	};
}

let props = parse_arguments(process.argv);
switch(props.command) {
	case 'server':
		// TODO start server script
		require(__dirname + '/new_server.js').init(props.args);
		break;
	case 'new':
		require(__dirname + '/new_app.js').init(props.args);
		break;
	case 'generate':
		require(__dirname + '/generate_mvc.js').init(props.args);
		break;
	case 'destroy':
		require(__dirname + '/remove_mvc.js').init(props.args);
		break;
	default:
		true;
}