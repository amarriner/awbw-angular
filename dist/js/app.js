(function(){"use strict";var a=angular.module("advanceWarsByWeb",["ngResource","ngRoute","oitozero.ngSweetAlert","ui.bootstrap","ui.bootstrap.popover","advanceWarsByWeb.coData","advanceWarsByWeb.dataService","advanceWarsByWeb.game","advanceWarsByWeb.gameService","advanceWarsByWeb.login","advanceWarsByWeb.loginService","advanceWarsByWeb.map","advanceWarsByWeb.mapService","advanceWarsByWeb.navbar","advanceWarsByWeb.register","advanceWarsByWeb.utilsService"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"js/views/index.html"})}]).directive("setFocus",["$timeout","$parse",function(a,b){return{link:function(c,d,e){var f=b(e.setFocus);c.$watch(f,function(b){if(b===true){a(function(){d[0].focus()})}})}}}]).directive("tile",[function(){return{restrict:"E",templateUrl:"js/views/tile.html"}}]);a.factory("authInterceptor",["$window","$location","$q",function(a,b,c){return{request:function(b){b.headers=b.headers||{};if(a.sessionStorage.token){b.headers["x-access-token"]=a.sessionStorage.token}return b},response:function(a){return a},responseError:function(d){if(b.path()!=="/login"){a.sessionStorage.previousLocation=b.path()}return c.reject(d)}}}]).config(["$httpProvider",function(a){a.interceptors.push("authInterceptor")}])})();(function(){"use strict";angular.module("advanceWarsByWeb.coData",["ngRoute"]).config(["$routeProvider",function(a){a.when("/co-data",{templateUrl:"js/views/co-data.html",controller:"CoDataCtrl"})}]).controller("CoDataCtrl",["$scope","Data",function(a,b){b.getCoData().then(function(b){a.data=b}).catch(function(a){})}])})();(function(){"use strict";angular.module("advanceWarsByWeb.game",["ngRoute"]).config(["$routeProvider",function(a){a.when("/games",{templateUrl:"js/views/games.html",controller:"GamesCtrl"}).when("/games/create",{templateUrl:"js/views/game-create.html",controller:"GameCreateCtrl"}).when("/games/:slug",{templateUrl:"js/views/game.html",controller:"GameCtrl"})}]).controller("GameCtrl",["$scope","$routeParams","$timeout","Game","Data","Utils","SweetAlert","Login",function(a,b,c,d,e,f,g,h){a.popover=[];a.utils=f;a.currentUser=h.getCurrentUser;
//
// Get all static data
//
e.getAll().then(function(c){a.menuData=c.menuData;a.units=c.unitData;a.countries=c.countryData;a.terrain=c.terrainData;
//
// Find the game
//
d.get(b.slug).then(function(b){a.game=b.data.game;
//
// Determine active player
//
a.activePlayer=a.game.players.filter(function(a){return a.active});if(a.activePlayer.length===1){a.activePlayer=a.activePlayer[0]}else{a.activePlayer=""}
//
// Adjust map for game-specific objects
//
a.map=a.game.map;angular.forEach(a.game.units,function(b,c){b.movementPoints=a.units[b.id].movementPoints;b.movementType=a.units[b.id].movementType;a.map.tiles[b.tile].unit=b})}).catch(function(a){g.swal({title:"Error",text:a.data.message})})});
// ----------------------------------------------------------------
// Build units
// ----------------------------------------------------------------
a.buildUnit=function(b,c){
//
// Set the country of the pending unit to the same as the 
// active player
//
c.country=a.activePlayer.country;
//
// Send API call 
//
d.put(a.game.slug,"build",{unit:c,tile:b}).then(function(d){
//
// Add unit to game on the client
//
c.tile=b;a.game.units.push(c);a.map.tiles[b].unit=c}).catch(function(a){g.swal({title:"Error",text:a.data.message})})};
// ----------------------------------------------------------------
// Move units
// ----------------------------------------------------------------
a.moveUnit=function(b){d.put(a.game.slug,"move",{toTile:b,fromTile:a.movingUnit.tile,cost:a.map.tiles[b].cost}).then(function(c){
// 
// Move unit on the client
//
a.map.tiles[b].unit=a.map.tiles[a.movingUnit.tile].unit;delete a.map.tiles[a.movingUnit.tile].unit;var d=a.game.units.map(function(a){if(a){return a.tile}}).indexOf(a.movingUnit.tile);a.game.units[d].tile=b;a.clearMovementSquares()}).catch(function(b){a.clearMovementSquares();g.swal({title:"Error",text:b.data.message})})};
// ----------------------------------------------------------------
// Start Game
// ----------------------------------------------------------------
a.startGame=function(){d.put(a.game.slug,"start").then(function(b){a.game=b.data.game;g.swal({title:"Success",text:b.data.message})}).catch(function(a){g.swal({title:"Error",text:a.data.message})})};
// ----------------------------------------------------------------
// End Turn
// ----------------------------------------------------------------
a.endTurn=function(){d.put(a.game.slug,"end-turn").then(function(b){a.game=b.data.game;g.swal({title:"Success",text:b.data.message})}).catch(function(a){g.swal({title:"Error",text:a.data.message})})};
//
// Helper functions
//
a.movingUnit="";a.getMovement=function(b,c){a.popover[b.tile].isOpen=false;a.movingUnit=b;a.map=f.dijkstra(b,c,a.terrain)};a.clearMovementSquares=function(){a.movingUnit="";angular.forEach(a.map.tiles,function(b,c){a.map.tiles[c].cost=1e3})};a.getTerrainClass=function(b){return a.getCountry(b)+a.getTerrainName(b)};a.getCountry=function(b){return a.map.tiles[b].country||""};a.getTerrainName=function(b){return a.terrain[a.map.tiles[b].terrain].name.toLowerCase()};a.getUnitClass=function(b){if(!a.map.tiles[b].unit){return}return a.map.tiles[b].unit.country+a.units[a.map.tiles[b].unit.id].filename};a.getUnitName=function(b){if(!a.map.tiles[b].unit){return}return a.units[a.map.tiles[b].unit.id].name}}]).controller("GamesCtrl",["$scope","Game","SweetAlert",function(a,b,c){b.get().then(function(b){a.games=b.data});a.deleteGame=function(d){c.swal({title:"Delete "+d.name,text:"Are you sure you want to delete this game?",showCancelButton:true},function(e){if(e){b.delete(d.slug).then(function(b){if(b.status===200){a.games.splice(a.games.indexOf(d),1)}}).catch(function(a){c.swal({title:"Error",text:a.data.message})})}})}}]).controller("GameCreateCtrl",["$scope","$location","Data","Game","Map","SweetAlert",function(a,b,c,d,e,f){a.game={};a.bD=false;e.get().then(function(b){a.maps=b.data});c.getCountryData().then(function(b){a.countryData=b});a.changeMap=function(){a.mapCountries=[];angular.forEach(a.game.map.tiles,function(b,c){var d=a.countryData.filter(function(a){return a.abbreviation===b.country})[0];if(b.country&&a.mapCountries.indexOf(d)===-1){a.mapCountries.push(d)}})};a.createGame=function(){
//
// Determines whether the create button is disabled or not
//
a.bD=true;
//
// Check for required parameters
//
if(!a.game.name){return f.swal({title:"Error",text:"Name is required"},function(){a.bD=false})}if(!a.game.map){return f.swal({title:"Error",text:"Map is required"},function(){a.bD=false})}if(!a.game.country){return f.swal({title:"Error",text:"Country is required"},function(){a.bD=false})}
//
// Attempt to create the game via the API
//
d.post(a.game).then(function(a){
//
// Success, redirect to the game page
//
f.swal({title:"Success",text:"Game created successfully"},function(){b.path("/games/"+a.data.game.slug)})}).catch(function(c){
//
// An error occurred creating the game
//
f.swal({title:"Error",text:JSON.stringify(c)},function(){a.bD=false;if(c.status===401){b.path("/login")}})})}}])})();(function(){"use strict";angular.module("advanceWarsByWeb.login",["ngRoute"]).config(["$routeProvider",function(a){a.when("/login",{templateUrl:"js/views/login.html",controller:"LoginCtrl"})}]).controller("LoginCtrl",["$scope","$window","$location","Login","SweetAlert",function(a,b,c,d,e){var f;a.buttonDisabled=false;a.login=function(){a.buttonDisabled=true;a.error="";d.authenticate({username:a.username,password:a.password}).then(function(a){d.setCurrentUser(a.data.user);b.sessionStorage.token=a.data.token;if(b.sessionStorage.previousLocation){c.path(b.sessionStorage.previousLocation)}else{c.path("/")}}).catch(function(b){e.swal({title:"Error",text:b.data.message},function(){a.buttonDisabled=false})})}}])})();(function(){"use strict";angular.module("advanceWarsByWeb.map",["ngRoute"]).config(["$routeProvider",function(a){a.when("/maps",{templateUrl:"js/views/maps.html",controller:"MapsCtrl"}).when("/maps/:slug",{templateUrl:"js/views/map.html",controller:"MapCtrl"})}]).controller("MapCtrl",["$scope","$routeParams","Map","Data","Utils",function(a,b,c,d,e){d.getAll().then(function(d){a.menuData=d.menuData;a.units=d.unitData;a.countries=d.countryData;a.terrain=d.terrainData;c.get(b.slug).then(function(b){a.map=b.data})});a.utils=e;a.getTerrainClass=function(b){return a.getCountry(b)+a.getTerrainName(b)};a.getCountry=function(b){return a.map.tiles[b].country||""};a.getTerrainName=function(b){return a.terrain[a.map.tiles[b].terrain].name.toLowerCase()}}]).controller("MapsCtrl",["$scope","Map",function(a,b){b.get().then(function(b){a.maps=b.data})}])})();(function(){"use strict";angular.module("advanceWarsByWeb.navbar",["ngRoute"]).config(["$routeProvider",function(a){}]).directive("navbar",function(){return{templateUrl:"js/views/navbar.html"}}).controller("NavbarCtrl",["$scope","$window","$location","Login",function(a,b,c,d){a.currentUser=d.getCurrentUser;a.$on("$routeChangeSuccess",function(){a.location=c.path()});a.menus=[];a.closeMenu=function(){a.menus[0]=true;a.menus[1]=true;a.menus[2]=true;a.menus[3]=true};a.closeMenu();if(b.sessionStorage.token){d.setCurrentUser()}a.resetMenu=function(b){for(var c=1;c<a.menus.length;c++){if(b===c){a.menus[c]=!a.menus[c]}else{a.menus[c]=true}}};a.logout=function(){a.closeMenu();d.clearCurrentUser();b.sessionStorage.token="";c.path("/")}}])})();(function(){"use strict";angular.module("advanceWarsByWeb.register",["ngRoute"]).config(["$routeProvider",function(a){a.when("/register",{templateUrl:"js/views/register.html",controller:"RegisterCtrl"})}]).controller("RegisterCtrl",["$scope","$window","$location","Login","SweetAlert",function(a,b,c,d,e){var f;a.buttonDisabled=false;a.register=function(){a.buttonDisabled=true;a.error="";d.register({username:a.username,password:a.password,email:a.email}).then(function(a){console.log(a);d.setCurrentUser(a.data.user);b.sessionStorage.token=a.data.token;e.swal({title:"Registered",text:"User account created, logged in"},function(){c.path("/")})}).catch(function(b){e.swal({title:"Error",text:b.data.message},function(){a.buttonDisabled=false})})}}])})();(function(){"use strict";angular.module("advanceWarsByWeb.dataService",[]).factory("Data",["$http","$resource","$q",function(a,b,c){
//
// Local variables to cache data so it only polls the API once
//
var d;var e;var f;var g;var h;
//
// Promise wrapper to get all data endpoints, cache them and return them
//
var i=function(){return c(function(a,b){j.getMenuData().then(j.getCoData).then(j.getUnitData).then(j.getCountryData).then(j.getTerrainData).then(function(){a({coData:d,countryData:e,menuData:f,terrainData:g,unitData:h})}).catch(function(a){b(a)})})};
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
getCoData:function(){return c(function(b,c){if(d){return b(d)}a.get("/api/cos-data").then(function(a){d=a.data;b(d)}).catch(function(a){c(a)})})},
//
// Get country data from API/cache
//
getCountryData:function(){return c(function(b,c){if(e){return b(e)}return a.get("/api/countries-data").then(function(a){e=a.data;b(e)}).catch(function(a){c(a)})})},
//
// Get menu data from API/cache
//
getMenuData:function(){return c(function(a,c){if(f){return a(f)}b("js/data/menu.json").get().$promise.then(function(b){f=b;a(b)}).catch(function(a){c(a)})})},
//
// Get terrain data from API/cache
//
getTerrainData:function(){return c(function(b,c){if(g){return b(g)}return a.get("/api/terrain-data").then(function(a){g=a.data;b(g)}).catch(function(a){c(a)})})},
//
// Get unit data from API/cache
//
getUnitData:function(){return c(function(b,c){if(h){return b(h)}return a.get("/api/units-data").then(function(a){h=a.data;b(h)}).catch(function(a){c(a)})})}};
//
// Exposes functions for use in app
//
return j}])})();(function(){"use strict";angular.module("advanceWarsByWeb.gameService",[]).factory("Game",["$http","$q",function(a,b){return{"delete":function(c){return b(function(b,d){a.delete("/api/games/"+c).then(function(a){b(a)}).catch(function(a){d(a)})})},get:function(c){return b(function(b,d){a.get("/api/games/"+(c||"")).then(function(a){b(a)}).catch(function(a){d(a)})})},post:function(c){return b(function(b,d){a.post("/api/games/",c).then(function(a){b(a)}).catch(function(a){d(a)})})},put:function(c,d,e){return b(function(b,f){a.put("/api/games/"+d+"/"+c,e).then(function(a){b(a)}).catch(function(a){f(a)})})}}}])})();(function(){"use strict";angular.module("advanceWarsByWeb.loginService",[]).factory("Login",["$http","$window","$q",function(a,b,c){var d={};return{authenticate:function(d){return c(function(c,e){a.post("/api/authenticate",d).then(function(a){c(a)}).catch(function(a){b.sessionStorage.token="";e(a)})})},register:function(d){return c(function(c,e){a.post("/api/users",d).then(function(a){c(a)}).catch(function(a){b.sessionStorage.token="";e(a)})})},clearCurrentUser:function(){d={}},getCurrentUser:function(){return d},setCurrentUser:function(b){if(b){return c(function(a,c){d=b;a(d)})}return a.post("/api/authenticate/check").then(function(a){d=a.data.user;return a})}}}])})();(function(){"use strict";angular.module("advanceWarsByWeb.mapService",[]).factory("Map",["$http","$q",function(a,b){return{get:function(c){return b(function(b,d){a.get("/api/maps/"+(c||"")).then(function(a){b(a)}).catch(function(a){d(a)})})}}}])})();(function(){"use strict";angular.module("advanceWarsByWeb.utilsService",[]).factory("Utils",["Data",function(a){var b;var c;var d;var e=function(a,f){
//
// Don't process squares off the map
//
if(f<0||f>=d.tiles.length){return}
//
// Calculate cost to current square, if we're out of 
// MP or (TODO) fuel, return
//
var g=parseInt(d.tiles[a].cost)+parseInt(b[d.tiles[f].terrain].costs.C[c.movementType]);if(g>c.movementPoints){return}
//
// If there is a unit in this square, make sure we can pass through it
//
if(d.tiles[f].unit){
//
// If the unit is from another player, return
//
if(d.tiles[f].unit.country!==c){return}
//
// If it's the same country, but the unit would be out of
// MP or (TODO) fuel, return
// (TODO) Add APC/Lander/T-Copter checks
//
if(g===c.movementPoints){return}}
//
// Update cost for current square, and then check neighbors if
// the cost was less
//
if(g<d.tiles[f].cost){d.tiles[f].cost=g;
//
// Only check the square to the left if we're not on the map edge
//
if(f%d.width){e(f,f-1)}
//
// Only check the square on the right if we're not on the map edge
//
if((f+1)%d.width){e(f,f+1)}
//
// Check up and down as well
//
e(f,f-d.width);e(f,f+d.width)}};var f=function(a,f,g){
//
// Set local variables to parameters
//
b=g;c=a;d=f;
//
// Initialize map
//
for(var h=0;h<d.tiles.length;h++){d.tiles[h].cost=1e3}d.tiles[c.tile].cost=0;
//
// Begin checking squares for costs
//
if(c.tile%d.width){e(c.tile,c.tile-1)}if((c.tile+1)%d.width){e(c.tile,c.tile+1)}e(c.tile,c.tile-d.width);e(c.tile,c.tile+d.width);return d};return{dijkstra:f,range:function(a,b,c){c=c||1;var d=[];for(var e=a;e<=b;e+=c){d.push(e)}return d}}}])})();