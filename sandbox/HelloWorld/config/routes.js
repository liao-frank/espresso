class AppRoutes extends BeanRoutes {
	// METHOD('PATH', 'CONTROLLER#ACTION');
	use() {
		this.get('/test/foo', 'test#foo');
		this.get('/test/bar', 'test#bar');
	}
}