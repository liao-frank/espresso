class HomeSocketedController extends HomeController {
	constructor() {
		super();
	}

	home_socket(io, socket) {
		socket.emit("connected", {});
	}

	about_socket(io, socket) {
		socket.emit("connected", {});
	}

	contact_socket(io, socket) {
		socket.emit("connected", {});
	}
}