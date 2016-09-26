var fs = require('fs');

var path = 'a.js';
var content = 'Hello World!';
fs.write(path, content, 'w');
phantom.exit();