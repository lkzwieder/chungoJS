class Router {
   constructor(routes, controllers) {
      this._controllers = controllers;
      this._routes = {};
      
      let res = {};
      for(let k in routes) {
         let [method, route] = k.split(' ');
         let [kind, r] = route ? [method, route] : ['ANY', method];
         this._routes[kind] = res[kind] || {};
         let routeRegex = r;
         if(routes[k].params && Object.keys(routes[k].params).length) {
            for(let param in routes[k].params) {
               routeRegex = routeRegex.replace(param, `(${routes[k].params[param]})`);
            }
         }
         let regex = new RegExp(`^${routeRegex}$`);
         this._routes[kind][r] = routes[k];
         this._routes[kind][r].regex = regex;
      }
   }

   run(req, res) {
      const qs = require('querystring');
      const url = require('url');

      let commonParams = req.method == 'POST' ? qs.parse(req.body) : url.parse(req.url, true).query;
      let all = this._routes['ANY'] || {};

      for(let route in this._routes[req.method]) {
         all[route] = this._routes[req.method][route];
      }

      let matches = false;
      for(let route in all) {
         matches = req.url.match(all[route].regex);
         matches = matches ? matches.splice(1, matches.length -1) : false;
         if(matches) {
            let howManyGetParams = Object.keys(all[route].params).length;
            let getParams = [];
            for(let i = 0; i < howManyGetParams; i++) getParams.push(matches[i]);
            req.getParams = getParams; // TODO include commonParams
            let [controller, method] = all[route].handler.split('.');
            (this._controllers[controller][method])(req, res);
            break;
         }
      }
   }
}

module.exports = Router;