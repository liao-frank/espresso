let fs = require('fs');
let cli = require(__dirname + '/../lib/cli.js');

function parseArguments(args) {
	while (args[0].match(/(node)|(espresso)/)) {
		args = args.slice(1);
	}

	return {
		command: args[0],
		args: args.slice(1)
	};
}

let props = parseArguments(process.argv);
switch(props.command) {
	case 'server':
		// TODO start server script
		require(__dirname + '').init(props.args);
		break;
	case 'new':
		require(__dirname + '/new_app.js').init(props.args);
		break;
	case 'generate':
		require(__dirname + '/generate_mvc.js').init(props.args);
		break;
	default:
		true;
}