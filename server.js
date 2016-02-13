var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var config      = require('./app/config');
var colors      = require('colors');

var mongoose    = require('mongoose');
mongoose.connect(config.database);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = config.port;

var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'Index Page' });
});

var environment = process.env.NODE_ENV || 'development';
app.use(express.static((environment == 'production' ? 'dist' : 'src')));

app.use('/', router);

var authentication      = require('./app/routes/authenticate');
var authorizeRouter     = require('./app/routes/authorize');
var coDataRouter        = require('./app/routes/co-data');
var countryDataRouter   = require('./app/routes/country-data');
var gameRouter          = require('./app/routes/game');
var mapRouter           = require('./app/routes/map');
var terrainRouter       = require('./app/routes/terrain-data');
var unitDataRouter      = require('./app/routes/unit-data');
var userRouter          = require('./app/routes/user');

app.use('/' + config.apiPathPrefix + '/authenticate', authentication.authRouter);
app.use('/' + config.apiPathPrefix + '/cos-data', coDataRouter);
app.use('/' + config.apiPathPrefix + '/countries-data', countryDataRouter);
app.use('/' + config.apiPathPrefix + '/terrain-data', terrainRouter);
app.use('/' + config.apiPathPrefix + '/units-data', unitDataRouter);
app.use(authorizeRouter);
app.use('/' + config.apiPathPrefix + '/authenticate/check', authentication.checkRouter);
app.use('/' + config.apiPathPrefix + '/games', gameRouter);
app.use('/' + config.apiPathPrefix + '/maps', mapRouter);
app.use('/' + config.apiPathPrefix + '/users', userRouter);

app.listen(port);
if (! process.env.SECRET) {
    console.log('\n ************************************************************************'.red);
    console.log(' * NO SECRET ENVIRONMENT VARIABLE SET, YOU SHOULD FIX THIS IMMEDIATELY! *'.red);
    console.log(' ************************************************************************\n'.red);
}
console.log('Running in ' + environment);
console.log('Listening on port ' + port);