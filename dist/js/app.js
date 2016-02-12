(function(){"use strict";var a=angular.module("advanceWarsByWeb",["ngResource","ngRoute","ui.bootstrap","ui.bootstrap.popover","advanceWarsByWeb.coData","advanceWarsByWeb.dataService","advanceWarsByWeb.login","advanceWarsByWeb.loginService","advanceWarsByWeb.map","advanceWarsByWeb.mapService","advanceWarsByWeb.navbar","advanceWarsByWeb.utilsService"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"js/views/index.html"})}]).directive("setFocus",["$timeout","$parse",function(a,b){return{link:function(c,d,e){var f=b(e.setFocus);c.$watch(f,function(b){if(b===true){a(function(){d[0].focus()})}})}}}]).directive("tile",[function(){return{restrict:"E",templateUrl:"js/views/tile.html"}}])})();(function(){"use strict";angular.module("advanceWarsByWeb.coData",["ngRoute"]).config(["$routeProvider",function(a){a.when("/co-data",{templateUrl:"js/views/co-data.html",controller:"CoDataCtrl"})}]).controller("CoDataCtrl",["$scope","Data",function(a,b){b.getCoData().then(function(b){a.data=b}).catch(function(a){})}])})();(function(){"use strict";angular.module("advanceWarsByWeb.login",["ngRoute"]).config(["$routeProvider",function(a){a.when("/login",{templateUrl:"js/views/login.html",controller:"LoginCtrl"})}]).controller("LoginCtrl",["$scope","$window","$location","Login",function(a,b,c,d){var e;a.login=function(){a.error="";d.authenticate({username:a.username,password:a.password}).then(function(a){d.setCurrentUser(a.data.user);b.sessionStorage.token=a.data.token;c.path(b.sessionStorage.previousLocation)}).catch(function(b){a.error=b.data.error})}}])})();(function(){"use strict";angular.module("advanceWarsByWeb.map",["ngRoute"]).config(["$routeProvider",function(a){a.when("/maps",{templateUrl:"js/views/maps.html",controller:"MapsCtrl"}).when("/maps/:slug",{templateUrl:"js/views/map.html",controller:"MapCtrl"})}]).controller("MapCtrl",["$scope","$routeParams","Map","Data","Utils",function(a,b,c,d,e){d.getAll().then(function(d){a.menuData=d.menuData;a.units=d.unitData;a.countries=d.countryData;a.terrain=d.terrainData;c.get(b.slug).then(function(b){a.map=b})});a.utils=e;a.getTerrainClass=function(b){return a.getCountry(b)+a.getTerrainName(b)};a.getCountry=function(b){return a.map.tiles[b].country||""};a.getTerrainName=function(b){return a.terrain[a.map.tiles[b].terrain].name.toLowerCase()}}]).controller("MapsCtrl",["$scope","Map",function(a,b){b.get().then(function(b){a.maps=b})}])})();(function(){"use strict";angular.module("advanceWarsByWeb.navbar",["ngRoute"]).config(["$routeProvider",function(a){}]).directive("navbar",function(){return{templateUrl:"js/views/navbar.html"}}).controller("NavbarCtrl",["$scope","$window","$location","Login",function(a,b,c,d){a.currentUser=d.getCurrentUser;a.isUserCollapsed=true;a.isMenuCollapsed=true;a.$on("$routeChangeSuccess",function(){a.location=c.path()});a.menus=[];a.menus[0]=true;a.menus[1]=true;a.menus[2]=true;a.resetMenu=function(b){for(var c=1;c<a.menus.length;c++){if(b===c){a.menus[c]=!a.menus[c]}else{a.menus[c]=true}}};a.logout=function(){d.clearCurrentUser();b.sessionStorage.token="";c.path("/")}}])})();(function(){"use strict";angular.module("advanceWarsByWeb.dataService",[]).factory("Data",["$http","$resource","$q",function(a,b,c){
//
// Local variables to cache data so it only polls the API once
//
var d;var e;var f;var g;var h;
//
// Promise wrapper to get all data endpoints, cache them and return them
//
var i=function(){return c(function(a,b){j.getMenuData().then(j.getCoData).then(j.getUnitData).then(j.getCountryData).then(j.getTerrainData).then(function(){a({coData:d,countryData:e,menuData:f,terrainData:g,unitData:h})}).catch(function(a){b(a);return})})};
//
// Public functions that actually get exposed 
//
var j={
//
// Wrapper to private function above
//
getAll:i,
//
// Get CO data from API/cache
//
getCoData:function(){return c(function(b,c){if(d){b(d);return}a.get("/api/cos-data").success(function(a){d=a;b(a)}).error(function(a){c(a)})})},
//
// Get country data from API/cache
//
getCountryData:function(){return c(function(b,c){if(e){b(e);return}return a.get("/api/countries-data").success(function(a){e=a;b(a)}).error(function(a){console.log("didnt get countries");c(a)})})},
//
// Get menu data from API/cache
//
getMenuData:function(){return c(function(a,c){if(f){a(f);return}b("js/data/menu.json").get().$promise.then(function(b){f=b;a(b)}).catch(function(a){c(a)})})},
//
// Get terrain data from API/cache
//
getTerrainData:function(){return c(function(b,c){if(g){b(g);return}return a.get("/api/terrain-data").success(function(a){g=a;b(a)}).error(function(a){c(a)})})},
//
// Get unit data from API/cache
//
getUnitData:function(){return c(function(b,c){if(h){b(h);return}return a.get("/api/units-data").success(function(a){h=a;b(a)}).error(function(a){c(a)})})}};
//
// Exposes functions for use in app
//
return j}])})();(function(){"use strict";angular.module("advanceWarsByWeb.loginService",[]).factory("Login",["$http","$window","$q",function(a,b,c){var d={};return{authenticate:function(c){return a.post("/api/authenticate",c).success(function(a){return a}).error(function(a){b.sessionStorage.token="";return a})},clearCurrentUser:function(){d={}},getCurrentUser:function(){return d},setCurrentUser:function(b){if(b){return c(function(a,c){console.log("Setting user");d=b})}return a.get("/api/authenticate").success(function(a){d=a.user;return a})}}}])})();(function(){"use strict";angular.module("advanceWarsByWeb.mapService",[]).factory("Map",["$http","$q",function(a,b){return{get:function(c){return b(function(b,d){a.get("/api/maps/"+(c||"")).success(function(a){b(a)}).error(function(a){d(a)})})}}}])})();(function(){"use strict";angular.module("advanceWarsByWeb.utilsService",[]).factory("Utils",[function(){return{range:function(a,b,c){c=c||1;var d=[];for(var e=a;e<=b;e+=c){d.push(e)}return d}}}])})();