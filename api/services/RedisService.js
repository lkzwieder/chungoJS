class RedisService {
   constructor(configs) {
      this._configs = configs;
   }
   
   get configs() {return this._configs;}
}

module.exports = RedisService;