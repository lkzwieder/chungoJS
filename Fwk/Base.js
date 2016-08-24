class Base {
   constructor(req, res) {
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

         var Router = new Router(this._configs.routes, this._controllers);
      }, (err) => {
         console.log("ERR: ", err);
      });
   }

   get controllers () {return this._controllers}
   get policies () {return this._policies}
   get services () {return this._services}
   get configs () {return this._configs}

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