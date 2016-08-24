class Router {
   constructor(routes, controllers, commonParams) {
      this._controllers = controllers;
      this._routes = {};

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
         this._routes[kind][regex] = routes[k];
      }
   }

   run(req, res) {
      let all = this._routes[req.method].concat(this._routes['ANY']);
      let matches = false;
      for(let regex in all) {
         matches = req.url.match(regex);
         if(matches) {
            let howManyGetParams = Object.keys(all[regex].params).length;
            let getParams = [];
            for(let i = 1; i <= howManyGetParams; i++) getParams.push(matches[i]);
            req.getParams = getParams;
            let [controller, method] = all[regex].handler.split('.');
            this._controllers[controller][method](req, res);
            break;
         }
      }
   }
}

module.exports = Router;