var mustBeConfig        = require('./libs/mustbe-config');

module.exports = {
    
    apiPathPrefix: 'api',
    
    secret: process.env.SECRET || 'qowio2i3j0r982u30w9eujfoiqjrefo093qu4f0943jfpoqijreflaksviuh',
    
    database: 'mongodb://localhost:27017/awbw',
    
    mustBeConfig: mustBeConfig
    
};