let socket = io(window.location.pathname);
socket.on("connected", function() {
	let opts = socket.io.opts;
	console.log(`${ opts.secure ? "Secure" : "Non-secure" } socket connection established at "${ opts.hostname + opts.path }" on port ${ opts.port }.`);
});