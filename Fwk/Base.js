const http = require('http');
const fs = require('fs');

class Base {
   constructor(environment) {
      Promise.all([
         this.setter('controllers'),
         this.setter('policies'),
         this.setter('services'),
         this.setConfigs(environment)
      ]).then((data) => {
         let [controllers, policies, services, configs] = data;
         let Policer = new (require('./Policer.js'))(configs, policies);
         let Router = new (require('./Router.js'))(configs, controllers, services);

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
               Policer.run(req, res);
               Router.run(req, res);
            });
         }).listen(configs.server.port);
      }, (err) => {
         console.log("ERR: ", err);
      });
   }

   setter(kind) {
      return new Promise((resolve, reject) => {
         const root = `./api/${kind}`;
         fs.readdir(root, (e, r) => {
            if(e) reject(e);
            let res = {};
            r.forEach((name) => {
               res[name.slice(0, -3)] = require("." + root + "/" + name);
            });
            resolve(res);
         });
      });
   }

   setConfigs(environment) {
      return new Promise((resolve, reject) => {
         let Config = new (require('./Config.js'))(environment);
         let res = Config.data;
         res ? resolve(res) : reject('error in some settings');
      });
   }
}

module.exports = Base;
