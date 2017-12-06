class HomeController extends BeanController {
	constructor() {
		super();
	}

	home(req, res) {

		res.render({
			__title: 'Espresso.js'
		});
	}

	about(req, res) {

		res.render({});
	}

	contact(req, res) {

		res.render({});
	}
}