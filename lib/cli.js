let fs = require('fs');

function mkdir(dir_name, escape=true) {
	let dir_path = this.formatPath(dir_name);
	if (fs.existsSync(dir_path)) {
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
	if (fs.existsSync(file_path)) {
		content = fs.readFileSync(file_path, 'utf8');
	} else {
		let msg = `No file exists at ${ file_name }.`;
		// escape?
		if (escape) { this.escape(msg); }
		else { console.log(msg); }
	}
	return content;
}

function formatPath(path) {
	// macOS
	if (path.match(/^\//)) {
		return path;
	}
	// TODO windows
	else if (path.match(/^C:\/\//)) {
		return path;
	}
	else {
		return './' + path;
	}
}

module.exports = {
	mkdir: mkdir, 
	touch: touch, 
	escape: escape,
	cat: cat,
	formatPath: formatPath
};