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
//         this._routes[kind][regex] = routes[k];
         this._routes[kind][r] = routes[k];
         this._routes[kind][r].regex = regex;
//         console.log(Object.prototype.toString.call(regex));
      }
      console.log(this._routes);
   }

   run(req, res) {
      const qs = require('querystring');
      const url = require('url');

      let commonParams = req.method == 'POST' ? qs.parse(req.body) : url.parse(req.url, true).query;
      let all = this._routes['ANY'] || {};
      for(let kind in this._routes[req.method]) {
         all[route] = this._routes[req.method][route];
      }
      let matches = false;
      for(let regex in all) {
         matches = req.url.match(regex);
         console.log(typeof req.url, req.url, typeof regex, regex);
         console.log(matches);
         if(matches) {
            let howManyGetParams = Object.keys(all[regex].params).length;
            let getParams = [];
            for(let i = 1; i <= howManyGetParams; i++) getParams.push(matches[i]);
            req.getParams = getParams; // TODO include commonParams
            let [controller, method] = all[regex].handler.split('.');
            this._controllers[controller][method](req, res);
            break;
         }
      }
   }
}

module.exports = Router;