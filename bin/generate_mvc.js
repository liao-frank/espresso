let fs = require('fs');
let cli = require(__dirname + '/../lib/cli.js');
let mvc_generator = require(__dirname + '/../lib/mvc_generator.js');

function parse_arguments(args) {
	if (args.length < 1) {
		cli.escape("Wrong number of parameters. Try 'espresso generate GENERATOR NAME [args]'.");
	}
	return {
		generator: args[0],
		args: args.slice(1)
	}
}

function generate_controller(dirname, args) {
	if ( args.length < 1 ) {
		cli.escape("Wrong number of parameters. Try 'espresso generate controller NAME [action:method]'.");
	}
	mvc_generator.generate_controller(dirname, args[0], args.slice(1)); 
}

function generate_model(dirname, args) {

}

exports.init = function(args) {
	let props = parse_arguments(args);
	switch(props.generator) {
		case 'controller':
			generate_controller('.', props.args);
			break;
		case 'model':
			generate_model('.', props.args);
			break;
		default:
			cli.escape(`Invalid Generator Type: ${props.generator}`);
	}
}