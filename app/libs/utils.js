var Q       = require('q');
var slug    = require('slug');

module.exports = {

    //
    // Abstract promise wrapper to finding a model by its ID
    //
    findModelById: function(id, Model) {
        
        var deferred = Q.defer();
        Model.findById(id, function(err, model) {
            if(err) {
                deferred.reject(err);
                return;
            }
            
            deferred.resolve(model);
            
        });
        
        return deferred.promise;
    },
    
    //
    // Abstract promise wrapper to find a model by a slug
    //
    findModelBySlug: function(slug, Model) {
    
        var deferred = Q.defer();
        Model.findOne({slug: slug}, function(err, model) {
            if (err) {
                deferred.reject(err);
                return;
            }
            
            deferred.resolve(model);
        
        });
        
        return deferred.promise;
    },
    
    //
    // Abstract promise wrapper to generating a slug based on the 
    // incoming string. Will check for a Model with the generated 
    // slug, and if one is found will increment to ensure 
    // uniqueness.
    //
    generateSlug: function (s, Model) {
    
        var deferred = Q.defer();
        var newSlug = slug(s);
    
        Model.count({ slug: new RegExp('^' + newSlug + '(-([0-9])+)?$') }, function(err, c) {
            if (err) {
                deferred.reject(err);
                return;
            }
       
            if (c === 0) {
                deferred.resolve(newSlug);
                return;
            }
        
            deferred.resolve(slug(s + '-' + c));
    
        });
    
        return deferred.promise;
    },
    
    //
    // Abstract promise wrapper to save a model instance
    //
    saveModel: function(model) {
        
        var deferred = Q.defer();
        
        model.save(function(err) {
            if (err) {
                deferred.reject(err);
                return;
            }

            deferred.resolve(model);
        });
        
        return deferred.promise;
    }

};