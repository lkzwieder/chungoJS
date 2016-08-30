class UserController {
   constructor(services) {
      this._RedisService = services['RedisService'];
   }
   
   getId(req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      return res.end('okay');
   }
}

module.exports = UserController;