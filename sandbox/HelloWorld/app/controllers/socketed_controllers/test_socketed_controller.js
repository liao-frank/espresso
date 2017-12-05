class TestSocketedController extends TestController {
	constructor() {
		super();
	}

	foo_socket(io, socket) {
		socket.emit("connected", {});
	}

	bar_socket(io, socket) {
		socket.emit("connected", {});
	}
}