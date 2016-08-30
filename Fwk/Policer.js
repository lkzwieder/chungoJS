class Policer {
   constructor(config, policies) {
      this._toApply = [];
      this._policies = policies;

      for(let k in config) {
         if(k == '*') {
            if(config[k]) {
               this._toApply = Object.keys(config);
               this._toApply.splice(this._toApply.indexOf(k), 1);
            } else {
               this._toApply = [];
            }
         } else {
            if(config[k]) {
               this._toApply.push(k);
            } else {
               this._toApply.splice(this._toApply.indexOf(k), 1);
            }
         }
      }
   }

   run(req, res) {
      this._toApply.forEach((policy) => {
         this._policies[policy](req, res);
      })
   }
}

module.exports = Policer;
