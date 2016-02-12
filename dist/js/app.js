(function(){"use strict";var a=angular.module("advanceWarsByWeb",["ngResource","ngRoute","ui.bootstrap","ui.bootstrap.popover","advanceWarsByWeb.coData","advanceWarsByWeb.dataService","advanceWarsByWeb.login","advanceWarsByWeb.loginService","advanceWarsByWeb.map","advanceWarsByWeb.mapService","advanceWarsByWeb.navbar"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"js/views/index.html"})}]).directive("setFocus",["$timeout","$parse",function(a,b){return{link:function(c,d,e){var f=b(e.setFocus);c.$watch(f,function(b){if(b===true){a(function(){d[0].focus()})}})}}}]).directive("tile",[function(){return{restrict:"E",templateUrl:"js/views/tile.html"}}])})();(function(){"use strict";angular.module("advanceWarsByWeb.coData",["ngRoute"]).config(["$routeProvider",function(a){a.when("/co-data",{templateUrl:"js/views/co-data.html",controller:"CoDataCtrl"})}]).controller("CoDataCtrl",["$scope","Data",function(a,b){b.getCoData().then(function(b){a.data=b.data;console.log(a.data)}).catch(function(a){})}])})();(function(){"use strict";angular.module("advanceWarsByWeb.login",["ngRoute"]).config(["$routeProvider",function(a){a.when("/login",{templateUrl:"js/views/login.html",controller:"LoginCtrl"})}]).controller("LoginCtrl",["$scope","$window","$location","Login",function(a,b,c,d){var e;a.login=function(){a.error="";d.authenticate({username:a.username,password:a.password}).then(function(a){d.setCurrentUser(a.data.user);b.sessionStorage.token=a.data.token;c.path(b.sessionStorage.previousLocation)}).catch(function(b){a.error=b.data.error})}}])})();(function(){"use strict";angular.module("advanceWarsByWeb.map",["ngRoute"]).config(["$routeProvider",function(a){a.when("/maps",{templateUrl:"js/views/map.html",controller:"MapCtrl"})}]).controller("MapCtrl",["$scope","Map","Data",function(a,b,c){/*
            $scope.getCountries = function(err, callback) {
                if (err) {
                    console.log(err);
                    return;
                }
                
                Data.getCountryData().then(function(response) {
                    console.log('Found country data');
                    $scope.countries = response.data;
                    callback(null);
                }).catch(function(response) {
                    callback('Error getting country data'); 
                });
            }
            
            $scope.getTerrain = function(callback) {
                Data.getTerrainData().then(function(response) {
                    console.log('Found terrain data');
                    $scope.terrain = response.data;
                    callback(null);
                }).catch(function(response) {
                    callback('Error getting terrain data'); 
                });                                           
            }

            
            $scope.getTerrain($scope.getCountryData);
            */
c.getMenuData().then(function(b){a.menuData=b});c.getUnitData().then(function(d){a.units=d.data;c.getCountryData().then(function(d){a.countries=d.data;c.getTerrainData().then(function(c){a.terrain=c.data;b.get("56ba2e146d4875a31f1d66c6").then(function(b){a.map=b.data}).catch(function(a){})}).catch(function(a){})}).catch(function(a){})}).catch(function(a){});a.range=function(a,b,c){c=c||1;var d=[];for(var e=a;e<=b;e+=c){d.push(e)}return d};a.getTerrainClass=function(b){return a.getCountry(b)+a.getTerrainName(b)};a.getCountry=function(b){return a.map.tiles[b].country||""};a.getTerrainName=function(b){return a.terrain[a.map.tiles[b].terrain].name.toLowerCase()}}])})();(function(){"use strict";angular.module("advanceWarsByWeb.navbar",["ngRoute"]).config(["$routeProvider",function(a){}]).directive("navbar",function(){return{templateUrl:"js/views/navbar.html"}}).controller("NavbarCtrl",["$scope","$window","$location","Login",function(a,b,c,d){a.currentUser=d.getCurrentUser;a.isUserCollapsed=true;a.isMenuCollapsed=true;a.$on("$routeChangeSuccess",function(){a.location=c.path()});a.menus=[];a.menus[0]=true;a.menus[1]=true;a.menus[2]=true;a.resetMenu=function(b){for(var c=1;c<a.menus.length;c++){if(b===c){a.menus[c]=!a.menus[c]}else{a.menus[c]=true}}};a.logout=function(){d.clearCurrentUser();b.sessionStorage.token="";c.path("/")}}])})();(function(){"use strict";angular.module("advanceWarsByWeb.dataService",[]).factory("Data",["$http","$resource","$q",function(a,b,c){var d;return{getCoData:function(){return a.get("/api/cos-data").success(function(a){return a}).error(function(a){return a})},getCountryData:function(){return a.get("/api/countries-data").success(function(a){return a}).error(function(a){return a})},getTerrainData:function(){return a.get("/api/terrain-data").success(function(a){return a}).error(function(a){return a})},getUnitData:function(){return a.get("/api/units-data").success(function(a){return a}).error(function(a){return a})},getMenuData:function(){return c(function(a,c){if(d){a(d);return}b("js/data/menu.json").get().$promise.then(function(b){d=b;a(b)})})}}}])})();(function(){"use strict";angular.module("advanceWarsByWeb.loginService",[]).factory("Login",["$http","$window","$q",function(a,b,c){var d={};return{authenticate:function(c){return a.post("/api/authenticate",c).success(function(a){return a}).error(function(a){b.sessionStorage.token="";return a})},clearCurrentUser:function(){d={}},getCurrentUser:function(){return d},setCurrentUser:function(b){if(b){return c(function(a,c){console.log("Setting user");d=b})}return a.get("/api/authenticate").success(function(a){d=a.user;return a})}}}])})();(function(){"use strict";angular.module("advanceWarsByWeb.mapService",[]).factory("Map",["$http",function(a){return{get:function(b){return a.get("/api/maps/"+b).success(function(a){return a}).error(function(a){return a})}}}])})();