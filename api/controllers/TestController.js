module.exports = {
   getDos(req, res) {
      console.log("PARAMS: ", req.getParams);
      res.writeHead(200, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify(req.getParams));
   }
};