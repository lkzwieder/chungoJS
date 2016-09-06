const cluster = require('cluster');
if(cluster.isMaster) {
   let numReqs = 0;
   setInterval(() => {
//      console.log('numReqs =', numReqs);
   }, 5000);

   const numCPUs = require('os').cpus().length;
   for(let i = numCPUs; i--;) cluster.fork();
   Object.keys(cluster.workers).forEach((id) => {
      cluster.workers[id].on('message', (msg) => {
         if(msg.cmd && msg.cmd == 'notifyRequest') numReqs++;
      });
   });
} else {
   new (require('./Fwk/Base.js'))(process.argv[2] || 'develpment'); // FUTURE improve this, more flags can be accepted
}
