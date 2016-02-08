var authorizationChecks     = require('./authorization-checks');

module.exports = function(config) {
    
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
    
};