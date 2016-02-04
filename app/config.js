var apiPathPrefix = 'api';

module.exports = {
    'apiPathPrefix': apiPathPrefix,
    'secret': 'qowio2i3j0r982u30w9eujfoiqjrefo093qu4f0943jfpoqijreflaksviuh',
    'database': 'mongodb://localhost:27017/awbw',
    'publicApiRoutes': [
        { 
            'path': '/' + apiPathPrefix + '/games',
            'method': 'GET'
        }
    ]
};