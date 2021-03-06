class TestController {
   constructor(services) {
      console.log("entra");
      this._RedisService = services['RedisService'];
   }
   
   home(req, res) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify('hello world!'));
   }

   getDos(req, res) {
      console.log("PARAMS URL: ", req.urlParams);
      console.log("PARAMS COMMONS: ", req.commonParams);
      console.log("REDIS SERVICE CONFIGS: ", this._RedisService.configs);
      res.writeHead(200, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify(req.getParams));
   }
}

module.exports = TestController;
