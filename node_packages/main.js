var http = require('follow-redirects').http;
var https = require('follow-redirects').https;

global.window.http = http;
global.window.https = https;