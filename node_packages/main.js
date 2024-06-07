const my_http = require('follow-redirects').http;
const my_https = require('follow-redirects').http;
const my_punycode = require('punycode');

global.window.http = my_http;
global.window.https = my_https;
global.window.punycode = my_punycode;