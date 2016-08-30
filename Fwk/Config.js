const fs = require('fs');

class Config { // FUTURE improve deepness of configs
   constructor(environment) {
      this._data = {};
      const root = './config';
      let configFiles = fs.readdirSync(root);
      let rawConfigs = {};
      configFiles.forEach((configFile) => {
         let file = require("." + root + "/" + configFile);
         let filename = configFile.slice(0, -3);
         this._data[filename] = file['all'];
         for(let prop in file[environment]) {
            this._data[filename][prop] = file[environment][prop];
         }
      });
   }

   get data() {return this._data;}
}

module.exports = Config;
