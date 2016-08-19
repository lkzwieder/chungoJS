var config = require('./config/dev.js');
var http = require('http');
var qs = require('querystring');
var url = require('url');

http.createServer(function(req, res) {
   var body = [];

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

      console.log(params.msg);


      res.on('error', function(err) {
         console.error(err);
      });
   }
}).listen(config.server.port);



//var Router = (function(d, w) {
//   var _default = {controller: function() {console.log('no default controller')}};
//   var _routes = _default;
//   var _hash = w.location.pathname;
//   var _change = function(name, path) {
//      var objState = {};
//      objState[name] = path;
//      history.pushState(objState, name, path);
//   };
//
//   var _addRoutes = function(routes) {
//      _routes = _utils.mergeObjects(_routes, routes);
//   };
//
//   var _delRoutes = function(route) {
//      delete _routes[route];
//   };
//
//   var _flushRoutes = function() {
//      _routes = _default;
//   };
//
//   var _run = function() {
//      var foundRoute = false;
//      for(var route in _routes) {
//         if(_routes[route].params && !_utils.isEmptyObject(_routes[route].params)) {
//            var routeRegex = route;
//            for(var param in _routes[route].params) {
//               routeRegex = routeRegex.replace(param, "(" + _routes[route].params[param] + ")");
//            }
//            var regex = new RegExp("^" + routeRegex + "$");
//            var matches = _hash.match(regex);
//            if(matches) {
//               var howManyParams = _utils.objectLen(_routes[route].params);
//               var newParams = [];
//               for(var i = 1; i <= howManyParams; i++) {
//                  newParams.push(matches[i]);
//               }
//               if(!_utils.isEmptyArray(matches)) {
//                  _routes[route].controller.apply(this, newParams);
//                  foundRoute = true;
//                  break;
//               }
//            }
//         }
//      }
//      if(!foundRoute) _routes.default.controller();
//   };
//
//   setInterval(function() {
//      var currentUrl = w.location.pathname;
//      if(_hash != currentUrl) {
//         var evt = new Event('urlChange');
//         _hash = w.location.pathname;
//         w.dispatchEvent(evt);
//      }
//   }, 50);
//
//   w.addEventListener('urlChange', function() {
//      _run();
//   });
//
//   var _utils = {
//      isEmptyObject: function(x) {
//         return !Object.keys(x).length;
//      },
//      isEmptyArray: function(x) {
//         return !x.length;
//      },
//      objectLen: function(x) {
//         return Object.keys(x).length;
//      },
//      mergeObjects: function() {
//         var args = Array.prototype.slice.call(arguments);
//         var merged = {};
//         args.forEach(function(obj) {
//            for(var key in obj) {
//               if(obj.hasOwnProperty(key)) {
//                  merged[key] = obj[key];
//               }
//            }
//         });
//         return merged;
//      }
//   };
//
//   return {
//      run: _run,
//      change: _change,
//      addRoutes: _addRoutes,
//      delRoutes: _delRoutes,
//      flushRoutes: _flushRoutes
//   };
//})();