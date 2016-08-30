class Router {
   constructor(configs, controllers, services) {
      this._controllers = controllers;
      this._services = services;
      this._routes = {};
      for(let k in services) {
         this._services[k] = new services[k](configs);
      }
      
      for(let k in configs.routes) {
         let [method, route] = k.split(' ');
         let [kind, r] = route ? [method, route] : ['ANY', method];
         let routeRegex = r;
         if(configs.routes[k].params && Object.keys(configs.routes[k].params).length) {
            for(let param in configs.routes[k].params) {
               routeRegex = routeRegex.replace(param, `(${configs.routes[k].params[param]})`);
            }
         }
         let regex = new RegExp(`^${routeRegex}$`); // FIXME (\?.*)? add this to obtain querystring, could be or not
         this._routes[kind] = this._routes[kind] || {};
         this._routes[kind][r] = configs.routes[k];
         this._routes[kind][r].regex = regex;
      }
   }

   run(req, res) {
      const qs = require('querystring');
      const url = require('url');

      let commonParams = req.method == 'POST' ? qs.parse(req.body) : url.parse(req.url, true).query;
      req.commonParams = commonParams;
      let all = this._routes['ANY'] || {};

      for(let route in this._routes[req.method]) {
         all[route] = this._routes[req.method][route];
      }

      let matches = false;
      for(let route in all) {
         matches = req.url.match(all[route].regex);
         matches = matches ? matches.splice(1, matches.length -1) : false;
         if(matches) {
            let howManyUrlParams = Object.keys(all[route].params).length;
            let urlParams = [];
            for(let i = 0; i < howManyUrlParams; i++) urlParams.push(matches[i]);
            req.urlParams = urlParams;
            let [controller, method] = all[route].handler.split('.');
            // Only services are available in controllers, any other thing must be triggered in Services
            // that is why controllers doesn't have the configs.
            let c = new this._controllers[controller](this._services);
            c[method](req, res);
            break;
         }
      }
   }
}

module.exports = Router;
