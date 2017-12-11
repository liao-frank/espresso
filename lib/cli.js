let fs = require('fs');
let path = require('path');

function mkdir(dir_name, escape=true) {
	let dir_path = this.formatPath(dir_name);
	if (fs.existsSync(dir_path) && fs.lstatSync(dir_path).isDirectory()) {
		let msg = `Non-empty directory already exists at ${ dir_name }.`;
		// escape?
		if (escape) { this.escape(msg); }
		else { console.log(msg); }
	} else {
		fs.mkdirSync(dir_path);
	}
}

function touch(file_name, escape=true) {
	let file_path = this.formatPath(file_name);
	if (fs.existsSync(file_path)) {
		let msg = `File already exists at ${ file_name }.`;
		// escape?
		if (escape) { this.escape(msg); }
		else { console.log(msg); }
	} else {
		fs.writeFileSync(file_path, '');
	}
}

function escape(msg, status=1) {
	console.error(msg);
	process.exit(status);
}

function cat(file_name, escape=true) {
	let file_path = this.formatPath(file_name);
	let content = '';
	// if single file, cat file contents
	if (fs.existsSync(file_path) && fs.lstatSync(file_path).isFile()) {
		content = fs.readFileSync(file_path, 'utf8');
	} else {
		let msg = `No file exists at ${ file_name }.`;
		// escape?
		if (escape) { this.escape(msg); }
		else { console.log(msg); }
	}
	return content;
}

function catdir(dir_name, escape=true) {
	let dir_path = this.formatPath(dir_name);
	let content = [];
	let file_path;
	if (fs.existsSync(dir_path) && fs.lstatSync(dir_path).isDirectory()) {
		fs.readdirSync(dir_path).forEach((file_name) => {
			file_path = `${dir_path}/${file_name}`;
			// if file, add contents
			if (fs.lstatSync(file_path).isFile()) {
				content.push(fs.readFileSync(file_path, 'utf8'));
			}
		});
	} else {
		let msg = `No directory exists at ${ dir_name }.`;
		// escape?
		if (escape) { this.escape(msg); }
		else { console.log(msg); }
	}
	return content;
}

function formatPath(path) {
	// macOS
	if (path.match(/^\./)) {
		return path;
	}
	// TODO windows
	else if (path.match(/^C:\\/)) {
		return path.replace(/\\/g, '/');
	}
	else {
		return './' + path;
	}
}

function rm(file_name, escape=false) {
	let file_path = this.formatPath(file_name);
	if (fs.existsSync(file_path) && fs.lstatSync(file_path).isFile()) {
		fs.unlinkSync(file_path);
	} else {
		let msg = `No file exists at ${ file_name }.`;
		// escape?
		if (escape) { this.escape(msg); }
		else { console.log(msg); }
	}
}

function rmdir(dir_name, escape=false) {
	let dir_path = this.formatPath(dir_name);
	if (fs.existsSync(dir_path) && fs.lstatSync(dir_path).isDirectory()) {
		let list = fs.readdirSync(dir_path)
		let file_path;
		list.forEach((file_name) => {
			file_path = dir_path + '/' + file_name;
			if (fs.existsSync(file_path) && fs.lstatSync(file_path).isDirectory()) {
				this.rmdir(file_path);
			} else if (fs.existsSync(file_path) && fs.lstatSync(file_path).isFile()) {
				this.rm(file_path);
			}
		});
		fs.rmdirSync(dir_path);
	} else {
		let msg = `No directory exists at ${ dir_name }.`;
		// escape?
		if (escape) { this.escape(msg); }
		else { console.log(msg); }
	}
}

function get_app_dir() {
	return path.resolve();
}

function cli_require(module) {
	return require(get_app_dir() + `/node_modules/${module}`);
}

module.exports = {
	mkdir: mkdir, 
	touch: touch, 
	escape: escape,
	cat: cat,
	catdir: catdir,
	formatPath: formatPath,
	rm: rm,
	rmdir: rmdir,
	get_app_dir: get_app_dir,
	require: cli_require
};