class Base {
   constructor() {
      const http = require('http');
      const qs = require('querystring');
      const url = require('url');
      const fs = require('fs');

      const Router = require('Router.js');
      const Config = require('Config.js');

      Promise.all([
         this.setControllers(),
         this.setPolicies(),
         this.setServices(),
         this.setConfigs()
      ]).then((data) => {
         let [controllers, policies, services, configs] = data;
         this._controllers = controllers;
         this._policies = policies;
         this._services = services;
         this._configs = configs;

         http.createServer((req, res) => {
            var body = [];
            process.send({cmd: 'notifyRequest'});

            req.on('error', (err) => {
               console.log('Connection error: ', err);
            });

            req.on('data', (d) => {
               body.push(d);
            });

            req.on('end', () => {
               res.on('error', console.error);

               req.body = Buffer.concat(body).toString();
               // TODO run policies before Router
               new Router(this._configs.routes, this._controllers, req.method == 'POST' ? qs.parse(req.body) : url.parse(req.url, true).query).run(req, res);
            });
         }).listen(this._configs.server.port);
      }, (err) => {
         console.log("ERR: ", err);
      });
   }

   setControllers() {
      return new Promise((resolve, reject) => {
         const root = '../api/controllers';
         fs.readdir(root, (e, r) => {
            if(e) reject(e);
            var res = {};
            r.forEach((controllerName) => {
               res[controllerName] = require("${root}/${controllerName}.js");
            });
            resolve(res);
         });
      });
   }

   setPolicies() { //TODO

   }

   setServices() {
      return new Promise((resolve, reject) => {
         const root = '../api/services';
         fs.readdir(root, (e, r) => {
            if(e) reject(e);
            var res = {};
            r.forEach((serviceName) => {
               res[serviceName] = require("${root}/${serviceName}.js");
            });
            resolve(res);
         });
      });
   }

   setConfigs() { //TODO

   }
}

module.exports = Base;