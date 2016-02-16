# Advance Wars by Web

*Mostly a learning project. Rebuilding [AWBW](http://awbw.amarriner.com) in [AngularJS](https://angularjs.org/) and [ExpressJS](http://expressjs.com/) with a [mongodb](https://www.mongodb.org/) backend.*

Doesn't do much of anything at the moment, but currently games can be created and units moved around the map. 

**Demo Site**

[http://awbw.bulletriddenlich.com:81](http://awbw.bulletriddenlich.com:81)

**Dependencies**

Aside from the dependencies in the package.json and bower.json files, you'll need [mongodb](https://www.mongodb.org/) installed as well as a web server to proxy the node server. [nginx](https://www.nginx.com/) is a goode one. Be sure that the [grunt-cli](https://github.com/gruntjs/grunt-cli) and [bower](https://www.npmjs.com/package/bower) [npm](https://www.npmjs.com) packages have been installed (ideally globally).

**Build and Install**

    npm install
    bower install
    grunt build

**Running**

    export NODE_ENV=<development or production>
    export SECRET=<your super secret password hash>
    node server.js
    
For production you can install something like [pm2](https://www.npmjs.com/package/pm2) to have the server running all the time, and use your web server as a proxy to the node server (doing something like what's described in [this article](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-14-04)).