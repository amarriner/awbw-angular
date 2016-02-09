module.exports = {
    
    //
    // Port to serve on
    //
    port: process.env.PORT || 8888,
    
    //
    // URL to serve API on
    //
    apiPathPrefix: 'api',
    
    //
    // Secret string for JWT
    //
    secret: process.env.SECRET || 'qowio2i3j0r982u30w9eujfoiqjrefo093qu4f0943jfpoqijreflaksviuh',
    
    //
    // Database connection
    //
    database: 'mongodb://localhost:27017/awbw',
    
};