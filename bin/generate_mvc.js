let fs = require('fs');
let cli = require(__dirname + '/../lib/cli.js');
let mvc_generator = require(__dirname + '/../lib/mvc_generator.js');

function parseArguments(args) {
	if (args.length < 1) {
		cli.escape("Wrong number of parameters. Try 'espresso generate GENERATOR NAME [args]'.");
	}
	return {
		generator: args[0],
		args: args.slice(1)
	}
}

function generateController(dirname, args) {
	if ( args.length < 1 ) {
		cli.escape("Wrong number of parameters. Try 'espresso generate controller NAME [action:method]'.");
	}
	mvc_generator.generateController(dirname, args[0], args.slice(1)); 
}

function generateModel(dirname, args) {

}

exports.init = function(args) {
	let props = parseArguments(args);
	switch(props.generator) {
		case 'controller':
			generateController(props.args);
		case 'model':
			generateController(props.args);
		default:
			cli.escape(`Invalid Generator Type: ${props.generator}`);
	}
}