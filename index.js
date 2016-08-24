var config = require('./config/dev.js');
config.routes = require('./config/routes.js');
var http = require('http');
var qs = require('querystring');
var url = require('url');
//var Router = new (require('Fwk/Router.js'))(config.routes);

http.createServer(function(req, res) {
   var body = [];
   console.log(req);
   req.on('error', onConnError);
   req.on('data', onConnData);
   req.on('end', onConnEnd);

   function onConnError(err) {
      console.log('Connection error: ', err);
   }

   function onConnData(d) {
      body.push(d);
   }

   function onConnEnd() {
      body = Buffer.concat(body).toString();
      var params = req.method == 'POST' ? qs.parse(body) : url.parse(req.url, true).query;

      res.on('error', function(err) {
         console.error(err);
      });
   }
}).listen(config.server.port);