const mongoose = require('mongoose'),
    config = require('config'),
    // https = require('https'),
    http = require('http'),
    fs = require('fs');
// Use a different Promise provider then mongooses mpromise (its depricated)

module.exports = app => {
// optional callback that gets fired when initial connection completed
const uri = config.database;
mongoose.connect(uri, { useMongoClient: true }, (error) => {
  // if error is true, the problem is often with mongoDB not connection
  if (error){
    console.log("ERROR can't connect to mongoDB. Did you forgot to run mongod?");
  }
}).then( () => {
    console.log(config.util.getEnv('NODE_ENV'));
    if(config.util.getEnv('NODE_ENV') == 'production') {
      var options = {
        // cert: fs.readFileSync('/etc/letsencrypt/live/vitensurvey.party/fullchain.pem'),
        // key: fs.readFileSync('/etc/letsencrypt/live/vitensurvey.party/privkey.pem')
      };

      // var server = https.createServer(options, app);
      var server = http.createServer(app);

      server.listen(app.get("port"), () => {
        if(config.util.getEnv('NODE_ENV') !== 'test') {
          console.log(`Sotingane running on - Port ${app.get("port")}...`);
        };
      });
    } else {
      // Start to listen on port specified in the config file
      app.listen(app.get("port"), () =>{
        if(config.util.getEnv('NODE_ENV') !== 'test') {
          console.log(`Sotingane running on - Port ${app.get("port")}...`);
        };
      });
    }
  })
};
