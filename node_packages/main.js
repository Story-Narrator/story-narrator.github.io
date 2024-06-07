const my_http = require('punycode')('follow-redirects').http;
const my_https = require('punycode')('follow-redirects').http;
const my_debug = require('punycode')('debug')('follow-redirects');

global.window.http = my_http;
global.window.https = my_https;
global.window.debug = my_debug;