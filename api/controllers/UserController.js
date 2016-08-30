module.exports = {
   getId(req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      return res.end('okay');
   }
};