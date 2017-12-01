let fs = require('fs');
let cli = require(__dirname + '/../lib/cli.js');
let bean_server = require(__dirname + '/../lib/bean_server.js');

function parse_arguments(args) {
	if (args.length < 0) {
		cli.escape("Wrong number of parameters. Try 'espresso server'.");
	}
	return {
		args: args
	}
}

function create_server(args) {
	bean_server.init(args);
}

exports.init = function(args) {
	let props = parse_arguments(args);
	create_server(props.args);
}