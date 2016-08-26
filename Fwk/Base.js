const http = require('http');
const fs = require('fs');

class Base {
   constructor(environment) {
      Promise.all([
         this.setControllers(),
         this.setPolicies(),
         this.setServices(),
         this.setConfigs(environment)
      ]).then((data) => {
         let [controllers, policies, services, configs] = data;
         this._controllers = controllers;
         this._policies = policies;
         this._services = services;
         this._configs = configs;

         http.createServer((req, res) => {
            let body = [];
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
               new (require('./Router.js'))(this._configs.routes, this._controllers).run(req, res);
            });
         }).listen(this._configs.server.port);
      }, (err) => {
         console.log("ERR: ", err);
      });
   }

   setControllers() {
      return new Promise((resolve, reject) => {
         const root = './api/controllers';
         fs.readdir(root, (e, r) => {
            if(e) reject(e);
            let res = {};
            r.forEach((controllerName) => {
               res[controllerName] = require("." + root + "/" + controllerName);
            });
            resolve(res);
         });
      });
   }

   setPolicies() { //TODO

   }

   setServices() {
      return new Promise((resolve, reject) => {
         const root = './api/services';
         fs.readdir(root, (e, r) => {
            if(e) reject(e);
            let res = {};
            r.forEach((serviceName) => {
               res[serviceName] = require("." + root + "/" + serviceName);
            });
            resolve(res);
         });
      });
   }

   setConfigs(environment) { //TODO
      return new Promise((resolve, reject) => {
         let Config = new (require('./Config.js'))(environment);
         let res = Config.data;
         res ? resolve(res) : reject('error in some settings');
      });
   }
}

module.exports = Base;