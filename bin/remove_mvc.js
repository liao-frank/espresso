let fs = require('fs');
let cli = require(__dirname + '/../lib/cli.js');
let mvc_remover = require(__dirname + '/../lib/mvc_remover.js');

function parse_arguments(args) {
	if (args.length < 2) {
		cli.escape("Wrong number of parameters. Try 'espresso destroy DESTROYER NAME'.");
	}
	return {
		remover: args[0],
		args: args.slice(1)
	}
}

function remove_controller(dirname, args) {
	if ( args.length != 1 ) {
		cli.escape("Wrong number of parameters. Try 'espresso destroy controller NAME'.");
	}
	mvc_remover.remove_controller(dirname, args[0]); 
}

function remove_model(dirname, args) {
	
}

exports.init = function(args) {
	let props = parse_arguments(args);
	switch(props.remover) {
		case 'controller':
			remove_controller('.', props.args);
			break;
		case 'model':
			remove_model('.', props.args);
			break;
		default:
			cli.escape(`Invalid Destroyer Type: ${props.remover}`);
	}
}