var authorizationChecks     = require('./libs/authorization-checks');

var apiPathPrefix = 'api';

module.exports = {
    'apiPathPrefix': apiPathPrefix,
    'secret': process.env.SECRET || 'qowio2i3j0r982u30w9eujfoiqjrefo093qu4f0943jfpoqijreflaksviuh',
    'database': 'mongodb://localhost:27017/awbw',
    
    'mustBeConfig': function(config){
    
        config.userIdentity(function(id) {

            // determine if this user is authenticated or not
            id.isAuthenticated(function(user, cb) {
            
                // note that the "user" in this case, is the user
                // that was supplied by the routeHelpers.getUser function
                var isAuthenticated = false;

                if (user) {
                    isAuthenticated = user.authenticated;
                }
            
                cb(null, isAuthenticated);
            
            });
        });
    
        config.routeHelpers(function(rh) {

            // Get user object from request
            rh.getUser(function(req, cb){
                cb(null, req.user);
            });
        
            // Throw 401 if not authenticated
            rh.notAuthenticated(function(req, res, next) {
                res.status(401).json({ success: false, message: req.message });
            });
            
            // Throw 401 is not authorized 
            rh.notAuthorized(function(req, res, next) {
                res.status(401).json({ success: false, message: req.message });
            });
            
            // Parameter map
            rh.parameterMaps(function(params) {
                params.map('update.game', function(req) {
                    return { gameId: req.params.game_id };
                });
            });
        
        });
        
        config.activities(function(activities) {
            
            activities.can('update.game', function(identity, params, cb) {
                var user = identity.user;
                
                authorizationChecks.userCreatedGame(user, params.gameId, function(err, allow) {
                    if (err) {
                        cb(err, false);
                    }
                    
                    cb(null, allow);
                });
            });
            
        });
    }
};