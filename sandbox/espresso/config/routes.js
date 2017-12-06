class AppRouter extends BeanRouter {
	// METHOD('PATH', 'CONTROLLER#ACTION');
	use() {
		this.get('/home', 'home#home');
		this.get('/about', 'home#about');
		this.get('/contact', 'home#contact');
	}
}