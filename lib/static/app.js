// express
let express = require('express');
let app = express();
// ejs
app.set('views', __dirname + '/../app/views');
app.set('view engine', 'ejs');
// http
let http = require('http');
// socket.io
let httpServer = http.Server(app);
let sio = require('socket.io');
let io = sio(httpServer);

// morgan
let morgan = require('morgan');
app.use(morgan('tiny'));

// read controllers
let BeanController = require('');

// TODO: route definitions
require(__dirname + '/../config/routes.js').init(app, io);
// asset routes
app.use(express.static(__dirname + '/../app/assets'));
// static routes
app.use(express.static(__dirname + '/../public'));

// start server
httpServer.listen(50000, function() {
	console.log('Server listening at http://localhost:50000/');
});