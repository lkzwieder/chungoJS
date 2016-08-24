const cluster = require('cluster');

if(cluster.isMaster) {
   var numReqs = 0;
   setInterval(() => {
      console.log('numReqs =', numReqs);
   }, 5000);

   const numCPUs = require('os').cpus().length;
   for(let i = numCPUs; i--;) cluster.fork();
   Object.keys(cluster.workers).forEach((id) => {
      cluster.workers[id].on('message', (msg) => {
         if(msg.cmd && msg.cmd == 'notifyRequest') numReqs++;
      });
   });
} else {
   const http = require('http');
   const qs = require('querystring');
   const url = require('url');
   const fs = require('fs');
   const Fwk = require('Fwk/Base.js');

   http.createServer((req, res) => {
      process.send({cmd: 'notifyRequest'});

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
         let Fwk = new Fwk(req, res);
         let params = req.method == 'POST' ? qs.parse(body) : url.parse(req.url, true).query;

         res.on('error', function(err) {
            console.error(err);
         });
      }
   }).listen(config.server.port);
}