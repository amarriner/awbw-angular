var authorizationChecks     = require('./authorization-checks');

module.exports = function(config) {
    
    config.userIdentity(function(id) {

        //
        // determine if this user is authenticated or not
        //
        id.isAuthenticated(function(user, cb) {
          
            //
            // note that the "user" in this case, is the user
            // that was supplied by the routeHelpers.getUser function
            //
            var isAuthenticated = false;

            if (user) {
                isAuthenticated = user.authenticated;
            }
            
            cb(null, isAuthenticated);
            
        });
    });
    
    config.routeHelpers(function(rh) {

        //
        // Get user object from request
        //
        rh.getUser(function(req, cb){
            cb(null, req.user);
        });
        
        //
        // Throw 401 if not authenticated
        //
        rh.notAuthenticated(function(req, res, next) {
            res.status(401).json({ success: false, message: req.message });
        });
            
        //
        // Throw 401 if not authorized 
        //
        rh.notAuthorized(function(req, res, next) {
            res.status(401).json({ success: false, message: req.message });
        });
            

        rh.parameterMaps(function(params) {
            
            //
            // Maps the incoming /games/:game_id parameter to the corresponding
            // update.game activity below
            //
            params.map('update.game', function(req) {
                return { gameId: req.params.game_id };
            });
            
            //
            // Maps the incoming /users/:user_id parameter to the corresponding
            // update.user activity below
            //
            params.map('update.user', function(req) {
                return { userId: req.params.user_id };
            });
        });
    
    });
        
    config.activities(function(activities) {
            
        //
        // Authorization for updating a game object
        //
        activities.can('update.game', function(identity, params, cb) {
            var user = identity.user;
                
            authorizationChecks.userCreatedGame(user, params.gameId, function(err, allow) {
                if (err) {
                    cb(err, false);
                }
                
                cb(null, allow);
            });
        });    
        
        //
        // Authorization for updating a user object
        //
        activities.can('update.user', function(identity, params, cb) {
            var user = identity.user;
            
            authorizationChecks.isUserThisAuthenticatedUser(user, params.userId, function(err, allow) {
                if (err) {
                    cb(err, false);
                }
                
                cb(null, allow);
            });
        });
    });
    
};